//!Sub-module that handles parsing and configuration of OakNuts accounts
use byteorder::{ByteOrder, LittleEndian};

use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    program::{invoke},
    instruction::{Instruction, AccountMeta},
    system_program,
    rent::Rent,
    system_instruction::SystemInstruction,
    msg
};

union SwapTotal {
    total: u64,
    bytes: [u8; 8]
}

struct EthereumAddress {
    byte_addr: [u8;40]
}

impl EthereumAddress {
    pub fn from_string(input: &str) -> EthereumAddress {
        let string_bytes = input.as_bytes();
        let mut trimmed : [u8; 40] = [0;40];
        trimmed.copy_from_slice(string_bytes);
        return Self {byte_addr: trimmed};
    }
    pub fn from_bytes(input: &[u8]) -> EthereumAddress {
        //Initialise with zeroes
        let mut trimmed : [u8; 40] = [0;40];
        trimmed.copy_from_slice(input);
        return Self {byte_addr: trimmed}
    }
}

//Account instruction opcodes
const UPDATE_ETH : u8 = 1;
const CREATE_ACCOUNT: u8 = 2;
const INITIALISE_WALLET: u8 = 3;
const UPDATE_SWAP_TOTAL: u8 = 4;

pub fn process_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {
    //Determine if we're creating a new account or updating their Eth address
    let (&opcode, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
    match opcode {
        UPDATE_ETH => {
            // Iterating accounts is safer then indexing
            let accounts_iter = &mut accounts.iter();
            let user_account = next_account_info(accounts_iter)?;
            
            // Strip out new Ethereum Address
            let new_eth_address = EthereumAddress::from_bytes(&rest[0..40]);

            // Update the address section
            return update_eth_address(user_account, &new_eth_address);
        }
        CREATE_ACCOUNT => {
            return create_oaknuts_account(program_id, accounts);
        }
        INITIALISE_WALLET => {
            // Iterating accounts is safer then indexing
            let accounts_iter = &mut accounts.iter();
            let user_account = next_account_info(accounts_iter)?;
            return initialise_wallet(user_account, rest);
        }
        UPDATE_SWAP_TOTAL => {
            let accounts_iter = &mut accounts.iter();
            let user_account = next_account_info(accounts_iter)?;
            let new_total: SwapTotal = SwapTotal{total: LittleEndian::read_u64(rest)};
            return update_total_swapped(user_account, new_total)
        }
        _ => return Err(ProgramError::InvalidInstructionData)

    }
}

fn update_eth_address(
    account: &AccountInfo,
    new_address: &EthereumAddress
) -> ProgramResult {
    let mut mutable_data = account.data.borrow_mut();
    mutable_data[32..72].copy_from_slice(&new_address.byte_addr); 
    Ok(())
}

fn update_total_swapped(
    account: &AccountInfo,
    new_swap_total: SwapTotal
) -> ProgramResult {
    let mut mutable_data = account.data.borrow_mut();
    unsafe{
        mutable_data[72..80].copy_from_slice(&new_swap_total.bytes);
    }
    Ok(())
}

fn create_oaknuts_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let user_wallet = next_account_info(accounts_iter)?;
    let new_account = next_account_info(accounts_iter)?;
    let system_account = next_account_info(accounts_iter)?;
    let oaknuts_contract_account = next_account_info(accounts_iter)?;
    
    // Create the OakNuts account
    // with rent-exempt lamports
    // and a 100 bytes to play with

    msg!("Trying to make account");
    invoke(
        &Instruction::new(
            system_program::id(),
            &SystemInstruction::CreateAccountWithSeed {
                base: *user_wallet.key,
                seed: String::from("imgonnanut"),
                lamports: Rent::default().minimum_balance(100),
                space: 100,
                owner: *program_id,
            },
            vec![
                AccountMeta::new(*user_wallet.key, true), 
                AccountMeta::new(*new_account.key, false)
            ]
        ),
        &[
            user_wallet.clone(),
            new_account.clone(),
            system_account.clone(),
            oaknuts_contract_account.clone()
        ]
    )?;

    msg!("Adding wallet address to account");
    initialise_wallet(&new_account, &user_wallet.key.to_bytes())?;

    Ok(())
}

fn initialise_wallet(
    account: &AccountInfo,
    wallet: &[u8]
) -> ProgramResult {
    let mut mutable_data = account.data.borrow_mut();
    mutable_data[0..32].copy_from_slice(&wallet); 
    Ok(())
}

#[cfg(test)]
mod account_test {

    use super::*;
    use solana_program::clock::Epoch;

    #[test]
    fn test_bad_process_account() {
        let program_id = Pubkey::new_unique();      
        let accounts = Vec::new();
        let bad_instruction: Vec<u8> = vec![0];

        let status = process_account(&program_id, &accounts, &bad_instruction);
        assert_eq!(status.is_err(), true);
    }

    #[test]
    fn test_update_eth_address() {
        let program_id = Pubkey::new_unique();
        let account_id = Pubkey::new_unique();
        let new_eth_address: EthereumAddress = EthereumAddress::from_string("Da844a62B2F57413f9ca460CD2F4Ea2d4E2C4cf5");
        let mut lamports : u64 = 0;
        let mut account_data = [0; 1000];
        let account = AccountInfo::new(&account_id, false, true, &mut lamports, &mut account_data, &program_id, false, Epoch::default());

        let accounts = vec![account];
        let mut input : [u8; 41] = [0;41];
        input[0] = UPDATE_ETH; //Opcode
        input[1..].copy_from_slice(&new_eth_address.byte_addr);       
        let status = process_account(&program_id, &accounts, &input);
        assert_eq!(status.is_ok(), true);
        
        //Verify data is correct
        let actual_data = accounts[0].data.borrow();
        let expected_data = new_eth_address.byte_addr;
        for i in 32..72{
            assert_eq!(actual_data[i], expected_data[i-32]);
        }
    }

    #[test]
    fn test_update_swap_total() {
        let program_id = Pubkey::new_unique();
        let account_id = Pubkey::new_unique();
        let mut lamports : u64 = 0;
        let mut account_data = [0; 1000];
        let account = AccountInfo::new(&account_id, false, true, &mut lamports, &mut account_data, &program_id, false, Epoch::default());

        let accounts = vec![account];
        let mut input : [u8; 9] = [0;9];
        input[0] = UPDATE_SWAP_TOTAL; //Opcode
        let expected_swap_total: SwapTotal = SwapTotal{total: 800};
        unsafe{
            input[1..].copy_from_slice(&expected_swap_total.bytes); 
        }
        let status = process_account(&program_id, &accounts, &input);
        assert_eq!(status.is_ok(), true);
        
        //Verify data is correct
        let actual_data = accounts[0].data.borrow();
        for i in 72..80{
            unsafe{
                assert_eq!(actual_data[i], expected_swap_total.bytes[i-72]);
            }
        }
    }

    #[test]
    fn test_initialise_wallet() {
        let mut account_data = [0; 1000];
        let program_id = Pubkey::new_unique();
        let account_id = Pubkey::new_unique();
        let mut lamports : u64 = 0;
        let account = AccountInfo::new(&account_id, false, true, &mut lamports, &mut account_data, &program_id, false, Epoch::default());

        let wallet = Pubkey::new_unique();

        let status = initialise_wallet(&account, &wallet.to_bytes());
        
        assert_eq!(status.is_ok(), true);
        
        // Verify data is correct
        let actual_data = account.data.borrow();
        let expected_data = wallet.to_bytes();
        for i in 0..32{
            assert_eq!(actual_data[i], expected_data[i]);
        }
    }
}