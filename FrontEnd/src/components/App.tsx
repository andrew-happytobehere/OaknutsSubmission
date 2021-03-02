import React from "react";
import SignInPage from "./ui/SignInPage/SignInPageUI";
import { DashboardPageUI } from "./ui/DashboardPage/DashboardPageUI";
import DepositPageUI from "./ui/DepositPage/DepositPageUI";
import { AppState } from "../redux/reducer";
import { Action } from "../redux/reducer";
import { connect } from "react-redux";
import { hot } from "react-hot-loader/root";
import { ProgressPage } from "./managed/ProgressPageView";
import * as Web3 from "@solana/web3.js";
import {
    booleanWalletCouple,
    CheckAccountForWallet,
    CreateAccountForWallet,
} from "../services/OaknutsSmartContract";
import { GetCurrentSolBalance } from "../services/SolanaWalletServices";
import {
    EthLedgerDataSet,
    GetEthLedgerDataSet,
} from "../services/BackendServices";

import store from "../redux/store";
import { OnInitializeComplete } from "../redux/action/ActionCreator";

export type ProgressState =
    | "lookingForAccount"
    | "creatingAccount"
    | "finishing"
    | "error";

export interface AppProps {
    userToken: string;
    ethAddress: string;
    currentPage: string;
}

export interface AppDispatch {}

export interface AppPageState {
    wallet: any;
    cluster: Web3.Cluster;
    progressState: ProgressState;
}

class App extends React.Component<AppProps, AppPageState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            ...this.state,
            cluster: "devnet",
            progressState: "lookingForAccount",
        };

        this.OnWalletConnected = this.OnWalletConnected.bind(this);
    }

    // This gets called when the sollet wallet service successfully connects
    // this contains all of the progress page logic, so it will:
    //     1) Try and see if a wallet exists
    //     2.a) If it doesn't, create a new one
    //     2.b) If it does, use it
    //     3) Do any other initial prep work
    //     4) Finally, it calls OnInitializeComplete() and navigates to the Dashboard Page
    async OnWalletConnected(wallet: any) {
        console.log("Wallet connected! Starting progress page");
        this.setState({
            wallet: wallet,
        });
        let commitment: Web3.Commitment = "finalized";
        const connection = new Web3.Connection(
            Web3.clusterApiUrl(this.state.cluster),
            commitment
        );
        CheckAccountForWallet(wallet, connection).then(
            (found: booleanWalletCouple) => {
                if (!found.isTrue) {
                    console.log("progress state: creating account");
                    this.setState({
                        progressState: "creatingAccount",
                    });
                    CreateAccountForWallet(wallet, connection).then(
                        (didSucceed: boolean) => {
                            if (didSucceed) {
                                console.log("progress state: finishing");
                                this.setState({
                                    progressState: "finishing",
                                });

                                GetCurrentSolBalance().then(
                                    (currentSol: number) => {
                                        console.log(
                                            "Current sol balance: " + currentSol
                                        );
                                        store.dispatch(
                                            OnInitializeComplete(currentSol)
                                        );
                                    }
                                );
                            } else {
                                console.log("progress state: ERROR");
                                this.setState({
                                    progressState: "error",
                                });
                            }
                        }
                    );
                } else {
                    // we have the associated account in found.associatedWalletPubKey
                    this.setState({
                        progressState: "finishing",
                    });
                }
            }
        );
    }

    render() {
        // in JS, true && expression == expression
        return (
            <div>
                {this.props.currentPage == "SignIn" && (
                    <SignInPage
                        cluster={this.state.cluster}
                        onWalletConnected={this.OnWalletConnected}
                    />
                )}
                {this.props.currentPage == "Progress" && (
                    <ProgressPage progressState={this.state.progressState} />
                )}
                {this.props.currentPage == "Dashboard" && (
                    <DashboardPageUI
                        userToken={this.props.userToken}
                        ethAddress={this.props.ethAddress}
                        wallet={this.state.wallet}
                        cluster={this.state.cluster}
                    />
                )}
                {this.props.currentPage == "Deposit" && (
                    <DepositPageUI
                        wEthAddress={this.props.ethAddress}
                        wallet={this.state.wallet}
                        cluster={this.state.cluster}
                    />
                )}
            </div>
        );
    }
}

// mapProps, mapDispatch, and connect are what make redux work
const mapProps = (state: AppState): AppProps => ({
    userToken: state.userToken,
    ethAddress: state.ethAddress,
    currentPage: state.currentPage,
});

const mapDispatch = (
    dispatch: React.Dispatch<Action<any>>
): AppDispatch => ({});
const app = hot(connect(mapProps, mapDispatch)(App));

export { app as App };
