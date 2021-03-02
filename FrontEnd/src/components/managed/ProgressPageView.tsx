import { connect } from "react-redux";
import { AppState, Action } from "../../redux/reducer";
import { Dispatch } from "react";
import {
    ProgressPageUI,
    ProgressPageUIDispatch,
    ProgressPageUIProps,
} from "../ui/ProgressPage/ProgressPageUI";
import { OnInitializeComplete } from "../../redux/action/ActionCreator";
import { ProgressState } from "../App";

export interface ProgressPageViewProps {
    progressState: ProgressState;
}

// mapProps, mapDispatch, and connect is what makes redux work
const mapProps = (
    state: AppState,
    props: ProgressPageViewProps
): ProgressPageUIProps => {
    return {
        progressState: props.progressState,
    };
};

// Override the onButtonClick with the dispatched ActionCreater + token
// This should set the userToken and set the currentPage to Dashboard.
const mapDispatch = (
    dispatch: Dispatch<Action<any>>
): ProgressPageUIDispatch => {
    return {
        InitializeComplete: (currentSol: number) => {
            dispatch(OnInitializeComplete(currentSol));
        },
    };
};

const ProgressPage = connect(mapProps, mapDispatch)(ProgressPageUI);
export { ProgressPage };
