import { connect } from "react-redux";
import { AppState, Action } from "../../redux/reducer";
import { Dispatch } from "react";
import { OnChangeEthAddress } from "../../redux/action/ActionCreator";
import {
    DepositEthAddressTileUIDispatch,
    DepositEthAddressTileUIProps,
} from "../ui/DepositPage/DepositEthAddressTileUI";
import { DepositEthAddressTileUI } from "../ui/DepositPage/DepositEthAddressTileUI";
import { Cluster } from "@solana/web3.js";

export interface DepositEthAddressTileViewProps {
    ethAddress: string;
    wallet: any;
    cluster: Cluster;
}

// mapProps, mapDispatch, and connect is what makes redux work
const mapProps = (
    state: AppState,
    props: DepositEthAddressTileViewProps
): DepositEthAddressTileUIProps => {
    return {
        currentEthAddress: props.ethAddress,
        wallet: props.wallet,
        cluster: props.cluster,
    };
};

// Override the OnChangeEthAddressButtonPress with the dispatched ActionCreater.
// This should update the Eth Address
const mapDispatch = (
    dispatch: Dispatch<Action<any>>
): DepositEthAddressTileUIDispatch => {
    return {
        OnChangeEthAddressButtonPress: (newEthAddress: string) =>
            dispatch(OnChangeEthAddress(newEthAddress)),
    };
};

const DepositEthAddressTile = connect(
    mapProps,
    mapDispatch
)(DepositEthAddressTileUI);
export { DepositEthAddressTile };
