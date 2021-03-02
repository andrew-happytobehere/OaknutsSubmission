import * as React from "react";
import sad from "../../../sad.svg";
import { ProgressState } from "../../App";
import styles from "../../css/ProgressPage.module.css";

export interface ProgressPageUIProps {
    progressState: ProgressState;
}
export interface ProgressPageUIDispatch {
    InitializeComplete: (currentSol: number) => void;
}

export function ProgressPageUI(
    props: ProgressPageUIProps & ProgressPageUIDispatch
) {
    let progressElements = <div />;
    if (props.progressState == "lookingForAccount") {
        progressElements = (
            <div className={styles.load}>
                <div>s</div>
                <div>t</div>
                <div>u</div>
                <div>N</div>
                <div> </div>
                <div>g</div>
                <div>n</div>
                <div>i</div>
                <div>d</div>
                <div>a</div>
                <div>o</div>
                <div>L</div>
            </div>
        );
    } else if (props.progressState == "creatingAccount") {
        progressElements = (
            <div className={styles.load}>
                <div>s</div>
                <div>t</div>
                <div>u</div>
                <div>N</div>
                <div> </div>
                <div>g</div>
                <div>n</div>
                <div>i</div>
                <div>d</div>
                <div>a</div>
                <div>o</div>
                <div>L</div>
                <h1 className={styles.checkWallet}>Please check your wallet</h1>
            </div>
        );
    } else if (props.progressState == "finishing") {
        progressElements = (
            <div className={styles.load}>
                <div>S</div>
                <div>N</div>
                <div>I</div>
                <div>A</div>
                <div>G</div>
                <div> </div>
                <div>G</div>
                <div>N</div>
                <div>I</div>
                <div>K</div>
                <div>A</div>
                <div>M</div>
            </div>
        );
    } else if (props.progressState == "error") {
        progressElements = (
            <div>
                <img src={sad} className={styles.sadCritter} />
                <h1>Error... could not create an account for deez nuts</h1>
                <button
                    onClick={(
                        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                        props.InitializeComplete(100);
                    }}
                >
                    Skip to Dashboard
                </button>
            </div>
        );
    }

    return progressElements;
}
