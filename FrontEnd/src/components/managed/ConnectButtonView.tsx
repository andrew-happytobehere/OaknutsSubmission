import { connect } from "react-redux";
import {
    YellowButtonUI,
    YellowButtonProps,
    YellowButtonDispatch,
} from "../ui/YellowButtonUI";
import { AppState, Action } from "../../redux/reducer";
import { Dispatch } from "react";
import { ConnectSolletWallet } from "../../services/SolanaWalletServices";
import { Cluster } from "@solana/web3.js";

export interface ConnectButtonProps {
    buttonIdentifier: string;
    buttonType: string;
    cluster: Cluster;
    handleConnectWallet: (wallet: any) => void;
}

// mapProps, mapDispatch, and connect is what makes redux work
const mapProps = (
    state: AppState,
    props: ConnectButtonProps
): YellowButtonProps => {
    return {
        buttonIdentifier: props.buttonIdentifier,
        buttonType: props.buttonType,
        buttonString: "Connect",
        cluster: props.cluster,
        handleConnectWallet: props.handleConnectWallet,
    };
};

// Override the onConnectWalletClick with the dispatched ActionCreater + token
// This should set the userToken and set the currentPage to Dashboard.
// Pass handleConnectWallet (that comes from Props passed in by parent) into the Sollet service so it can callback when the wallet connects
const mapDispatch = (dispatch: Dispatch<Action<any>>): YellowButtonDispatch => {
    return {
        onConnectWalletClick: (
            handleConnectWallet: (wallet: any) => void,
            cluster: Cluster
        ) => {
            ConnectSolletWallet(dispatch, handleConnectWallet, cluster);
        },
    };
};

const ConnectButonUI = connect(mapProps, mapDispatch)(YellowButtonUI);
export { ConnectButonUI };
