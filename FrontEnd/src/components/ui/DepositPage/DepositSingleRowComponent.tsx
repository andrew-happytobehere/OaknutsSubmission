import * as React from "react";
import styles from "../../css/DepositPage.module.css";
export interface DepositSingleRowComponentProps {
    mainText: string;
    middleText: string;
    unitText?: string;
    inputFieldValue: string;
    inputFieldName?: string;
    handleInputFieldChange: (event: React.FormEvent<HTMLInputElement>) => void;
    firstButtonText?: string;
    onFirstButtonClick?: () => void;
    secondButtonText?: string;
    onSecondButtonClick?: () => void;
}
export function DepositSingleRowComponent(
    props: DepositSingleRowComponentProps
) {
    return (
        <div className={styles.depositSingleRowComponentGridContainer}>
            <div className={styles.mainTextArea}>
                <p>{props.mainText}</p>
            </div>
            <div className={styles.middleTextArea}>
                <p>{props.middleText}</p>
            </div>
            {props.unitText ? (
                <div className={styles.unitTextArea}>
                    <p>{props.unitText}</p>
                </div>
            ) : null}
            <div className={styles.inputFieldArea}>
                <input
                    type="text"
                    name={props.inputFieldName}
                    value={props.inputFieldValue}
                    onChange={props.handleInputFieldChange}
                />
                {props.firstButtonText ? (
                    <button
                        className={styles.firstButton}
                        onClick={props.onFirstButtonClick}
                    >
                        {props.firstButtonText}
                    </button>
                ) : null}
                {props.secondButtonText ? (
                    <button
                        className={styles.secondButton}
                        onClick={props.onSecondButtonClick}
                    >
                        {props.secondButtonText}
                    </button>
                ) : null}
            </div>
        </div>
    );
}
