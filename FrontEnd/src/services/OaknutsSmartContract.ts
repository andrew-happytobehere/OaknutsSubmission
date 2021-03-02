import * as Web3 from "@solana/web3.js";
import Wallet from "@project-serum/sol-wallet-adapter";
import { SSL_OP_EPHEMERAL_RSA } from "constants";
import { wait, waitForDomChange } from "@testing-library/react";
import { WatchOfFilesAndCompilerOptions } from "typescript";
import { AppState } from "../redux/reducer";
import store from "../redux/store";
import { stringify } from "querystring";

const oaknutsProgramID: Web3.PublicKey = new Web3.PublicKey(
    "7hdnq9bTCxHKTpWiBJoML2b6YCmte8qRJzYuUZrLzJ3s"
);

const progressSleepAmount = 3000; // how many ms each phase of the Progress Page sleeps for

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function GetCurrentEthAddress(accountInfo?: Web3.AccountInfo<Buffer>): string {
    if (accountInfo === undefined) {
        return "00000000000000000";
    } else {
        // Ethereum address is stored between bytes 32-72 of the account
        return String(Buffer.from(accountInfo.data, 32, 40));
    }
}

function UpdateEthAddress(
    wallet: any,
    connection: Web3.Connection,
    newAddress: string,
    userAccountMeta: Web3.AccountMeta
): boolean {
    console.log("Updating address to:" + newAddress);

    // let transactionInstruction: Web3.TransactionInstruction = {
    //     keys: [userAccountMeta],
    //     programId: oaknutsProgramID,
    //     data: Buffer.from(["2", "1", newAddress]),
    // };

    // return SendTransaction(wallet, connection, transactionInstruction);
    return true;
}

async function SendTransaction(
    wallet: any,
    connection: Web3.Connection,
    instruction: Web3.TransactionInstruction
): Promise<boolean> {
    console.log("Sending transaction...");
    let transactionCtorFields: Web3.TransactionCtorFields = {
        recentBlockhash: connection.commitment,
        feePayer: new Web3.PublicKey(wallet.publicKey.toBase58()),
    };

    let transaction: Web3.Transaction = new Web3.Transaction(
        transactionCtorFields
    );
    transaction.add(instruction);

    return connection
        .getRecentBlockhash()
        .then((ret: Web3.BlockhashAndFeeCalculator) => {
            console.log("RecentBlockhash complete");
            transaction.recentBlockhash = ret.blockhash;
            return wallet.signTransaction(transaction).then((signed: any) => {
                console.log("signTransaction returned: ");
                console.log(signed);
                try {
                    let transaction = connection
                        .sendRawTransaction(signed.serialize())
                        .then(
                            (txid: string) => {
                                console.log("sendTransactionReturned: " + txid);
                                return true;
                            },
                            (reason: any) => {
                                console.log(reason);
                                return false;
                            }
                        );
                } catch (error) {
                    console.log(error);
                    return false;
                }
            });
        });
}

export interface booleanWalletCouple {
    isTrue: boolean;
    associatedWalletPubKey?: string;
}

export async function CheckAccountForWallet(
    wallet: any,
    connection: Web3.Connection
): Promise<booleanWalletCouple> {
    return connection
        .getProgramAccounts(oaknutsProgramID, connection.commitment)
        .then(
            (ret: Web3.PublicKeyAndAccount<Buffer>[]): booleanWalletCouple => {
                let returnObject: booleanWalletCouple = {
                    isTrue: false,
                };
                console.log("Looking for associated program accounts...");
                for (var account of ret) {
                    console.log("AccountKey:" + account.pubkey.toBase58());
                    console.log("AccountData:");
                    console.log(account.account.data.buffer);

                    try {
                        let associated_wallet = new Web3.PublicKey(
                            Buffer.from(account.account.data.buffer, 0, 32)
                        );
                        if (
                            wallet.publicKey.toBase58() ==
                            associated_wallet.toBase58()
                        ) {
                            returnObject.isTrue = true;
                            returnObject.associatedWalletPubKey = associated_wallet.toBase58();
                            return returnObject;
                            //TODO: Somehow return the account found so that it can be used by app
                        }
                    } catch (error) {
                        console.log(error);
                        console.log("Checking account failed, skipping.");
                    }
                }

                console.log("failed to find any associated accounts");
                return returnObject;
            }
        );
}

export async function CreateAccountForWallet(
    wallet: any,
    connection: Web3.Connection
): Promise<boolean> {
    //Use the wallet address and a keyphrase to generate their new oaknuts account
    return Web3.PublicKey.createWithSeed(
        wallet.publicKey,
        "imgonnanut",
        Web3.SystemProgram.programId
    ).then((ret: Web3.PublicKey) => {
        let newAccountPubkey: Web3.PublicKey = ret;
        console.log("new account key: " + newAccountPubkey.toBase58());

        let newAccountMeta: Web3.AccountMeta = {
            pubkey: newAccountPubkey,
            isSigner: false,
            isWritable: true,
        };

        let accountMeta: Web3.AccountMeta = {
            pubkey: new Web3.PublicKey(wallet.publicKey.toBase58()),
            isSigner: true,
            isWritable: false,
        };

        let systemAccountMeta: Web3.AccountMeta = {
            pubkey: Web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        };

        let oaknutsContractMeta: Web3.AccountMeta = {
            pubkey: oaknutsProgramID,
            isSigner: false,
            isWritable: false,
        };

        let transactionInstruction: Web3.TransactionInstruction = {
            keys: [
                accountMeta,
                newAccountMeta,
                systemAccountMeta,
                oaknutsContractMeta,
            ],
            programId: oaknutsProgramID,
            data: Buffer.from(["2", "2"]),
        };

        // fake creatAccount on front end so the sollet wallet shows correctly
        // this is expected to fail
        let demoTransactionInstruction: Web3.TransactionInstruction = Web3.SystemProgram.createAccount(
            {
                fromPubkey: wallet.publicKey,
                newAccountPubkey: newAccountPubkey,
                lamports: 1000,
                space: 1000,
                programId: oaknutsProgramID,
            }
        );

        return SendTransaction(
            wallet,
            connection,
            demoTransactionInstruction
        ).then((didSucceed: boolean) => {
            return didSucceed;
        });
    });
}

/***********************************************************
 * **********************************************************
 * everything below this is not in use **********************
 * *********************************************************
 * *******************************************************/

// This API works, but isn't used
// Gets the TokenAccounts for a specific mint for a given owner
async function GetTokenAccountsForOaknutsSmartContracts(token: Web3.PublicKey) {
    let commitment: Web3.Commitment = "finalized";
    const connection = new Web3.Connection(
        Web3.clusterApiUrl("devnet"),
        commitment
    );
    console.log("trying");
    return connection
        .getTokenAccountsByOwner(
            token,
            {
                mint: new Web3.PublicKey(
                    "AxsUsNLTGpHswn7jC1a9xBg7ntYDgW8yVDoKp85kQbCX" // test token
                ),
            },
            commitment
        )
        .then(
            (
                response: Web3.RpcResponseAndContext<
                    {
                        pubkey: Web3.PublicKey;
                        account: Web3.AccountInfo<Buffer>;
                    }[]
                >
            ) => {
                console.log("success");
                console.log(response.value);
            }
        );
}

function GetCurrentSwapTotal(accountInfo?: Web3.AccountInfo<Buffer>): number {
    if (accountInfo === undefined) {
        return 800;
    } else {
        // Ethereum address is stored between bytes 72-80 of the account
        return Number(Buffer.from(accountInfo.data, 72, 8));
    }
}

function UpdateSwapTotal(
    wallet: any,
    connection: Web3.Connection,
    newTotal: Uint8Array,
    userAccountMeta: Web3.AccountMeta
) {
    console.log("Updating total to:" + newTotal);
    let transactionInstruction: Web3.TransactionInstruction = {
        keys: [userAccountMeta],
        programId: oaknutsProgramID,
        data: Buffer.from(["2", "4", newTotal.subarray(0, 8)]),
    };

    SendTransaction(wallet, connection, transactionInstruction);
}

function GetRandomFourDec(): number {
    return Math.floor(Math.random() * 10000) / 10000;
}

function GetCurrentWEthBalance(): number {
    return 100 + GetRandomFourDec();
}

function GetWEthExchangeRate(): number {
    return 420 + GetRandomFourDec();
}

function GetSolExchangeRate(): number {
    return 1337 + GetRandomFourDec();
}

function MakeWEthDeposit(deposit: number): number {
    // we did a deposit
    return GetCurrentWEthBalance() + deposit;
}

function MakeWEthWithdraw(withdraw: number): number {
    // we made a withdraw
    return GetCurrentWEthBalance() - withdraw;
}

export function CheckAndCreateAccountForWallet(wallet: any) {
    let commitment: Web3.Commitment = "recent";
    const connection = new Web3.Connection(
        Web3.clusterApiUrl("devnet"),
        commitment
    );

    CheckAccountForWallet(wallet, connection).then(
        (found: booleanWalletCouple) => {
            console.log("Account exists:" + found);
            if (!found.isTrue) {
                CreateAccountForWallet(wallet, connection);
            }
        }
    );
}

export {
    GetCurrentWEthBalance,
    GetWEthExchangeRate,
    MakeWEthDeposit,
    MakeWEthWithdraw,
    SendTransaction,
    GetSolExchangeRate,
    UpdateEthAddress,
    GetCurrentEthAddress,
    GetTokenAccountsForOaknutsSmartContracts,
};
