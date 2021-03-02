import * as React from "react";
import styles from "../../css/DepositPage.module.css";
import { DashboardButtonUI } from "../../managed/DashboardButtonView";
import { GetCurrentWEthBalance } from "../../../services/OaknutsSmartContract";
import { DepositDepositTile } from "./DepositDepositTile";
import { DepositEthAddressTile } from "../../managed/DepositEthAddressTileView";
import { DepositWithdrawTile } from "./DespoitWithdrawTile";
import { DepositButtonUI } from "../../managed/DepositButtonView";
import { Cluster } from "@solana/web3.js";

export interface DepositPageProps {
    wEthAddress: string;
    wallet: any;
    cluster: Cluster;
}

export interface DepositPageState {
    currentWEthBalance: number;
}

export class DepositPageUI extends React.Component<
    DepositPageProps,
    DepositPageState
> {
    constructor(props: DepositPageProps) {
        super(props);
        this.state = {
            currentWEthBalance: GetCurrentWEthBalance(),
        };

        this.updateBalance = this.updateBalance.bind(this);
    }

    updateBalance(newBalance: number) {
        this.setState({
            currentWEthBalance: newBalance,
        });
    }

    render() {
        return (
            <div>
                <div className={styles.topRightButtons}>
                    <ul>
                        <li>
                            <DashboardButtonUI
                                buttonIdentifier="DashboardButton"
                                buttonType="top"
                            />
                        </li>
                        <li>
                            <DepositButtonUI
                                buttonIdentifier="DepositButton"
                                buttonType="top"
                            />
                        </li>
                    </ul>
                </div>
                <div className={styles.rowContainer}>
                    <DepositDepositTile
                        currentWEthBalance={this.state.currentWEthBalance}
                        updateBalance={this.updateBalance}
                    />
                    <DepositEthAddressTile
                        ethAddress={this.props.wEthAddress}
                        wallet={this.props.wallet}
                        cluster={this.props.cluster}
                    />
                    <DepositWithdrawTile
                        currentWEthBalance={this.state.currentWEthBalance}
                        updateBalance={this.updateBalance}
                    />
                </div>
            </div>
        );
    }
}

export default DepositPageUI;
