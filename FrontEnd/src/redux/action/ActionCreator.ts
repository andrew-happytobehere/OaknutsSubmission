import { ActionType } from "./ActionType";
import { Action } from "../reducer";
// This action is called whenever the user successfully signs in with their wallet
export function SignInUserWithToken(userToken: string): Action<string> {
    return {
        properties: userToken,
        type: ActionType.CONNECT_WALLET,
    };
}

// This action is called whenever the user disconnects their wallet
export function DisconnectUser(): Action<string> {
    return {
        properties: "",
        type: ActionType.DISCONNECT_WALLET,
    };
}

export function OnDepositButtonPress(): Action<string> {
    return {
        properties: "",
        type: ActionType.DEPOSIT_BUTTON,
    };
}

export function OnDashboardButtonPress(): Action<string> {
    return {
        properties: "",
        type: ActionType.DASHBOARD_BUTTON,
    };
}

export function OnChangeEthAddress(ethAddress: string): Action<string> {
    return {
        properties: ethAddress,
        type: ActionType.CHANGE_ETH_ADDRESS,
    };
}

export function OnInitializeComplete(currentSol: number): Action<number> {
    return {
        properties: currentSol,
        type: ActionType.INITIALIZE_SUCCESS,
    };
}
