import * as React from "react";
import {
    GetWEthExchangeRate,
    MakeWEthDeposit,
} from "../../../services/OaknutsSmartContract";
import styles from "../../css/DepositPage.module.css";
import { DepositSingleRowComponent } from "./DepositSingleRowComponent";

export interface DepositDepositTileProps {
    currentWEthBalance: number;
    updateBalance: (newBalance: number) => void;
}

export interface DepositDepositTileState {
    exchangeRate: number;
    currentInputFieldValue: string;
}

export class DepositDepositTile extends React.Component<
    DepositDepositTileProps,
    DepositDepositTileState
> {
    timerId: number;

    constructor(props: DepositDepositTileProps) {
        super(props);
        this.state = {
            exchangeRate: GetWEthExchangeRate(),
            currentInputFieldValue: "0.000",
        };

        this.timerId = 0;
        this.handleChange = this.handleChange.bind(this);
        this.onMaxButtonClick = this.onMaxButtonClick.bind(this);
        this.onDepositButtonClick = this.onDepositButtonClick.bind(this);
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        if (
            event.currentTarget.value === "" ||
            /^[0-9\b]+$/.test(event.currentTarget.value)
        )
            this.setState({
                ...this.state,
                currentInputFieldValue: event.currentTarget.value,
            });
    }

    onMaxButtonClick() {
        this.setState({
            ...this.state,
            currentInputFieldValue: this.props.currentWEthBalance.toString(),
        });
    }

    onDepositButtonClick() {
        // submit deposit request this.state.value
        // if successful
        var currentValueNumber = parseFloat(this.state.currentInputFieldValue);
        this.props.updateBalance(MakeWEthDeposit(currentValueNumber));
    }

    componentDidMount() {
        this.timerId = window.setInterval(
            () =>
                this.setState({
                    exchangeRate: GetWEthExchangeRate(),
                }),
            10000
        ); // update every 10 seconds
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    render() {
        return (
            <div className={styles.despositTileGridContainer}>
                <div className={styles.currentBalanceTextArea}>
                    <h1>Current Balance</h1>
                    <div className={styles.line} />
                </div>
                <div className={styles.depositRowArea}>
                    <DepositSingleRowComponent
                        mainText={this.props.currentWEthBalance.toString()}
                        middleText={this.state.exchangeRate.toString()}
                        unitText="wEth"
                        inputFieldValue={this.state.currentInputFieldValue}
                        handleInputFieldChange={this.handleChange}
                        firstButtonText="Max"
                        secondButtonText="Deposit"
                        onFirstButtonClick={this.onMaxButtonClick}
                        onSecondButtonClick={this.onDepositButtonClick}
                    />
                </div>
            </div>
        );
    }
}
