import * as React from "react";
import store from "../../../redux/store";
import {
    GetWEthExchangeRate,
    GetSolExchangeRate,
    MakeWEthWithdraw,
} from "../../../services/OaknutsSmartContract";
import styles from "../../css/DepositPage.module.css";
import { DepositSingleRowComponent } from "./DepositSingleRowComponent";

export interface DepositWithdrawTileProps {
    currentWEthBalance: number;
    updateBalance: (newBalance: number) => void;
}

export interface DepositWithdrawTileState {
    currentSolBalance: number;
    currentWEthBalance: number;
    wEthExchangeRate: number;
    solExchangeRate: number;
    currentSolInputFieldValue: string;
    currentWEthInputFieldValue: string;
}

export class DepositWithdrawTile extends React.Component<
    DepositWithdrawTileProps,
    DepositWithdrawTileState
> {
    constructor(props: DepositWithdrawTileProps) {
        super(props);
        this.state = {
            currentWEthBalance: this.props.currentWEthBalance,
            currentSolBalance: store.getState().currentSolBalance,
            wEthExchangeRate: GetWEthExchangeRate(),
            solExchangeRate: GetSolExchangeRate(),
            currentWEthInputFieldValue: "0",
            currentSolInputFieldValue: "0",
        };

        this.handleChange = this.handleChange.bind(this);
        this.onWEthWithdrawClick = this.onWEthWithdrawClick.bind(this);
        this.onSolWithdrawClick = this.onSolWithdrawClick.bind(this);
        this.onMaxWEthButtonClick = this.onMaxWEthButtonClick.bind(this);
        this.onMaxSolButtonClick = this.onMaxSolButtonClick.bind(this);
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        if (
            event.currentTarget.value === "" ||
            /^[0-9\b]+$/.test(event.currentTarget.value)
        )
            this.setState({
                ...this.state,
                [event.currentTarget.name]: event.currentTarget.value,
            });
    }

    onMaxWEthButtonClick() {
        this.setState({
            ...this.state,
            currentWEthInputFieldValue: this.props.currentWEthBalance.toString(),
        });
    }

    onMaxSolButtonClick() {
        this.setState({
            ...this.state,
            currentSolInputFieldValue: this.state.currentSolBalance.toString(),
        });
    }

    onWEthWithdrawClick() {
        var currentValueNumber = parseFloat(
            this.state.currentWEthInputFieldValue
        );
        this.props.updateBalance(MakeWEthWithdraw(currentValueNumber));
    }

    onSolWithdrawClick() {
        // if ThryWithdrawSol succeeded
        this.setState({
            currentSolBalance:
                this.state.currentSolBalance -
                parseFloat(this.state.currentSolInputFieldValue),
            currentSolInputFieldValue: "0",
        });
    }

    render() {
        return (
            <div className={styles.withdrawTileGridContainer}>
                <div className={styles.withdrawTileHeaderArea}>
                    <h1>Current Balance</h1>
                    <div className={styles.line} />
                </div>
                <div className={styles.topWithdrawRowArea}>
                    <DepositSingleRowComponent
                        mainText={this.props.currentWEthBalance.toString()}
                        middleText={this.state.wEthExchangeRate.toString()}
                        unitText="wEth"
                        inputFieldValue={this.state.currentWEthInputFieldValue}
                        inputFieldName="currentWEthInputFieldValue"
                        handleInputFieldChange={this.handleChange}
                        firstButtonText="Max"
                        secondButtonText="Withdraw"
                        onFirstButtonClick={this.onMaxWEthButtonClick}
                        onSecondButtonClick={this.onWEthWithdrawClick}
                    />
                </div>
                {/* <div className={styles.bottomWithdrawRowArea}>
                    <DepositSingleRowComponent
                        mainText={this.state.currentSolBalance.toString()}
                        middleText={this.state.solExchangeRate.toString()}
                        unitText="SOL"
                        inputFieldValue={this.state.currentSolInputFieldValue}
                        inputFieldName="currentSolInputFieldValue"
                        handleInputFieldChange={this.handleChange}
                        firstButtonText="Max"
                        secondButtonText="Withdraw"
                        onFirstButtonClick={this.onMaxSolButtonClick}
                        onSecondButtonClick={this.onSolWithdrawClick}
                    />
                </div> */}
            </div>
        );
    }
}
