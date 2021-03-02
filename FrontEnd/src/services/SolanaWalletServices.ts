import React, { useEffect, useMemo, useState } from "react";
import Wallet from "@project-serum/sol-wallet-adapter";
import {
    Connection,
    SystemProgram,
    clusterApiUrl,
    Cluster,
} from "@solana/web3.js";
import * as Web3 from "@solana/web3.js";

import { Dispatch } from "react";
import {
    DisconnectUser,
    SignInUserWithToken,
} from "../redux/action/ActionCreator";
import { Action, AppState } from "../redux/reducer";
import store from "../redux/store";

// This function launches the sollet wallet extension for DEVNET
// It handles updating the redux.state for both connecting & disconnecting the wallet
export function ConnectSolletWallet(
    dispatch: Dispatch<Action<any>>,
    handleConnectWallet: (wallet: any) => void,
    cluster: Cluster
): any {
    //const wallet = new Wallet('https://www.sollet.io', clusterApiUrl('devnet'));

    console.log("collect wallet pressed");
    const solletWallet = new Wallet(
        "https://www.sollet.io/",
        clusterApiUrl(cluster)
    );
    console.log(solletWallet);
    solletWallet.on("connect", () => {
        console.log("Connected to wallet " + solletWallet.publicKey.toBase58());
        dispatch(SignInUserWithToken(solletWallet.publicKey.toBase58()));
        handleConnectWallet(solletWallet);
    });
    solletWallet.on("disconnect", () => {
        console.log("Disconnected from wallet");
        dispatch(DisconnectUser());
    });
    solletWallet.connect();
}

// Gets the amount of SOL for the current wallet
export async function GetCurrentSolBalance(): Promise<number> {
    let commitment: Web3.Commitment = "finalized";
    const connection = new Web3.Connection(
        Web3.clusterApiUrl("devnet"),
        commitment
    );

    return connection
        .getBalance(new Web3.PublicKey(store.getState().userToken), commitment)
        .then((num: number) => {
            console.log("GetCurrentSol complete, currentBalance: " + num);
            return num / 100000000;
        });
}

// let commitment: Web3.Commitment = 'recent'
// const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"), commitment);

// let newAccountPubkey: Web3.PublicKey = new Web3.PublicKey(Math.random())

// let transactionInstruction: Web3.TransactionInstruction = Web3.SystemProgram.createAccount({
//     fromPubkey: solletWallet.publicKey,
//     newAccountPubkey: newAccountPubkey,
//     lamports: 1000,
//     space: 1000,
//     programId: new Web3.PublicKey("7hdnq9bTCxHKTpWiBJoML2b6YCmte8qRJzYuUZrLzJ3s")
// });

// let transactionCtorFields: Web3.TransactionCtorFields = {
//     recentBlockhash: commitment,
//     feePayer: solletWallet.publicKey,
// }

// let transaction: Web3.Transaction = new Web3.Transaction(transactionCtorFields);
// transaction.add(transactionInstruction);
// console.log("sending transaction");
//   connection.getRecentBlockhash().then((ret: Web3.BlockhashAndFeeCalculator) => {
//     transaction.recentBlockhash = ret.blockhash;
//     solletWallet.signTransaction(transaction).then((signed: any) => {
//         console.log("signTrasnactionret: " + signed);
//         connection.sendRawTransaction(signed.serialize()).then((txid: string) => {
//             console.log("sendtreansactionreturn: "+ txid);
//             //connection.confirmTransaction(txid).then(ret: any)
//         })
//     })
// });
//SendTransaction(solletWallet);
