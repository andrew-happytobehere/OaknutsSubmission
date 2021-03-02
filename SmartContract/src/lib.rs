use solana_program::{
    account_info::{AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
};

mod swap_instruction;
mod account_instruction;

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Declare the program's ID for convenience
//DevNet address
solana_program::declare_id!("7hdnq9bTCxHKTpWiBJoML2b6YCmte8qRJzYuUZrLzJ3s");

//Instruction categories
const SWAP: u8 = 1;
const ACCOUNT: u8 = 2;

// Program entrypoint's implementation
fn process_instruction(
    program_id: &Pubkey, // Public key of the account this program was loaded into
    accounts: &[AccountInfo], //Accounts that may be used for processing
    instruction_data: &[u8] // Collection of instruction data, will be interpretted 
) -> ProgramResult {
    let (&opcode, rest) = instruction_data.split_first().ok_or(ProgramError::InvalidInstructionData)?;
    Ok( match opcode {
        SWAP => {
            // Perform a swap for wETH tokens to wSOL
            swap_instruction::process_instruction(program_id, accounts, rest)?;
        }
        ACCOUNT => {
            //Set Eth Address for given Wallet Address
            account_instruction::process_account(program_id, accounts, rest)?;
        }
        _ => return Err(ProgramError::InvalidInstructionData)
    })
}

// Basic tests
#[cfg(test)]
mod test {
    use super::*;
    
    #[test]
    fn test_bad_opcode() {
        // Make bad arguments
        let program_id = Pubkey::new_unique();      
        let accounts = Vec::new();
        let bad_instruction: Vec<u8> = vec![0];
        
        //Test error
        let status = process_instruction(&program_id, &accounts, &bad_instruction);
        assert_eq!(status.is_err(), true);

    }
}