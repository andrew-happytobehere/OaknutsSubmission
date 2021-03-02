import { connect } from "react-redux";
import {
    YellowButtonUI,
    YellowButtonProps,
    YellowButtonDispatch,
} from "../ui/YellowButtonUI";
import { AppState, Action } from "../../redux/reducer";
import { Dispatch } from "react";
import { OnDepositButtonPress } from "../../redux/action/ActionCreator";

export interface DepositButtonProps {
    buttonIdentifier: string;
    buttonType: string;
}

// mapProps, mapDispatch, and connect is what makes redux work
const mapProps = (
    state: AppState,
    props: DepositButtonProps
): YellowButtonProps => {
    return {
        buttonIdentifier: props.buttonIdentifier,
        buttonType: props.buttonType,
        buttonString: props.buttonType == "change" ? "Change..." : "Deposit",
    };
};

// Override the onButtonClick with the dispatched ActionCreater.
// This should clear the userToken and set the currentPage to SignInPage.
const mapDispatch = (dispatch: Dispatch<Action<any>>): YellowButtonDispatch => {
    return {
        onButtonClick: () => dispatch(OnDepositButtonPress()),
    };
};

const DepositButtonUI = connect(mapProps, mapDispatch)(YellowButtonUI);
export { DepositButtonUI };
