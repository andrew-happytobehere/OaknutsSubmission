import * as OakNuts from "../services/OaknutsSmartContract";
import { ActionType } from "./action/ActionType";
import * as Web3 from "@solana/web3.js";

// This is the root app state that redux holds
export interface AppState {
    userToken: string;
    ethAddress: string;
    currentSolBalance: number;
    currentPage: string;
    currentAccount?: Web3.AccountInfo<Buffer>;
}

// Action interface, used by the reducer
export interface Action<T> {
    properties: T;
    type: ActionType;
}

// initial state when the webapp first loads
const initialState: AppState = {
    userToken: "",
    ethAddress: "",
    currentSolBalance: 0,
    currentPage: "SignIn",
    currentAccount: undefined,
};

// This is the reducer that takes in the current state & action, and spits out the new state.
// Think of it as the state machine that controls the navigation of our app.
export default function app(
    state: AppState = initialState,
    action: Action<any>
): AppState {
    console.log("reducer" + action.type);
    if (action.type === ActionType.CONNECT_WALLET) {
        const userTokenProp: string = action.properties as string;
        //TODO: Call CheckAndCreateAccount here
        //TODO: Assign account to AppState

        return {
            userToken: userTokenProp,
            ethAddress: OakNuts.GetCurrentEthAddress(state.currentAccount),
            currentSolBalance: state.currentSolBalance,
            currentPage: "Progress",
        };
    } else if (action.type === ActionType.DISCONNECT_WALLET) {
        //TODO: Clear AppState of current account
        return {
            userToken: "",
            ethAddress: "",
            currentSolBalance: state.currentSolBalance,
            currentPage: "SignIn",
        };
    } else if (action.type === ActionType.DEPOSIT_BUTTON) {
        return {
            userToken: state.userToken,
            ethAddress: state.ethAddress,
            currentSolBalance: state.currentSolBalance,
            currentPage: "Deposit",
        };
    } else if (action.type === ActionType.DASHBOARD_BUTTON) {
        return {
            userToken: state.userToken,
            ethAddress: state.ethAddress,
            currentSolBalance: state.currentSolBalance,
            currentPage: "Dashboard",
        };
    } else if (action.type === ActionType.CHANGE_ETH_ADDRESS) {
        const ethAddressProp: string = action.properties as string;
        console.log("change eth address called here too");
        return {
            userToken: state.userToken,
            ethAddress: ethAddressProp,
            currentSolBalance: state.currentSolBalance,
            currentPage: "Deposit",
        };
    } else if (action.type === ActionType.INITIALIZE_SUCCESS) {
        const currentSol: number = action.properties as number;
        return {
            userToken: state.userToken,
            ethAddress: state.ethAddress,
            currentSolBalance: currentSol,
            currentPage: "Dashboard",
        };
    }

    return state;
}
