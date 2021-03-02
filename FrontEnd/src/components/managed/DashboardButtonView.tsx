import { connect } from "react-redux";
import {
    YellowButtonUI,
    YellowButtonProps,
    YellowButtonDispatch,
} from "../ui/YellowButtonUI";
import { AppState, Action } from "../../redux/reducer";
import { Dispatch } from "react";
import { OnDashboardButtonPress } from "../../redux/action/ActionCreator";

export interface DashboardButtonProps {
    buttonIdentifier: string;
    buttonType: string;
}

// mapProps, mapDispatch, and connect is what makes redux work
const mapProps = (
    state: AppState,
    props: DashboardButtonProps
): YellowButtonProps => {
    return {
        buttonIdentifier: props.buttonIdentifier,
        buttonType: props.buttonType,
        buttonString: "Dashboard",
    };
};

// Override the onButtonClick with the dispatched ActionCreater.
// This should clear the userToken and set the currentPage to SignInPage.
const mapDispatch = (dispatch: Dispatch<Action<any>>): YellowButtonDispatch => {
    return {
        onButtonClick: () => dispatch(OnDashboardButtonPress()),
    };
};

const DashboardButtonUI = connect(mapProps, mapDispatch)(YellowButtonUI);
export { DashboardButtonUI };
