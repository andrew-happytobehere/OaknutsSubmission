import * as React from "react";
import { DashboardLogoTileUI } from "./DashboardLogoTileUI";
import styles from "../../css/DashboardPage.module.css";
import { DepositButtonUI } from "../../managed/DepositButtonView";
import { DashboardButtonUI } from "../../managed/DashboardButtonView";
import { DashboardUserInfoComponent } from "./DashboardUserInfoComponent";
import { DashboardLedgerTileUI } from "./DashboardLedgerTile";
import * as Web3 from "@solana/web3.js";
import {
    EthLedgerDataSet,
    GetEthLedgerDataSet,
    GetSolLedgerDataSet,
    SolLedgerDataSet,
} from "../../../services/BackendServices";

export interface DashboardPageUIProps {
    userToken: string;
    ethAddress: string;
    wallet: any;
    cluster: Web3.Cluster;
}

export interface DashboardPageUIState {
    ethLedgerHeaderText: string[];
    ethLedgerDataSet: EthLedgerDataSet[];
    solLedgerHeaderText: string[];
    solLedgerDataSet: SolLedgerDataSet[];
}

export class DashboardPageUI extends React.Component<
    DashboardPageUIProps,
    DashboardPageUIState
> {
    timerId: number;
    demoNumber: number;
    constructor(props: DashboardPageUIProps) {
        super(props);
        this.state = {
            ethLedgerHeaderText: [
                "Date",
                "ETH transaction address",
                "Gas used",
                "Gas price (Gwei)",
                "Total gas fees (ETH)",
                "Total gas fees (USD)",
            ],
            ethLedgerDataSet: [],
            solLedgerHeaderText: [
                "Date",
                "SOL transaction address",
                "wETH swapped",
                "SOL recieved",
            ],
            solLedgerDataSet: [],
        };
        this.timerId = 0;
        this.demoNumber = 0;
        this.CheckLedgerAndSwap = this.CheckLedgerAndSwap.bind(this);
    }

    componentDidMount() {
        this.timerId = window.setInterval(
            () => this.CheckLedgerAndSwap(),
            30000
        ); // update every 10 seconds
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    async CheckLedgerAndSwap() {
        GetEthLedgerDataSet(this.demoNumber).then(
            (dataSet: EthLedgerDataSet[]) => {
                this.setState({
                    ethLedgerDataSet: dataSet,
                });
            }
        );
        this.demoNumber++;

        GetSolLedgerDataSet().then((dataSet: SolLedgerDataSet[]) => {
            this.setState({
                solLedgerDataSet: dataSet,
            });
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
                <div className={styles.logoTileContainer}>
                    <DashboardLogoTileUI />
                </div>
                <div className={styles.userInfoContainer}>
                    <div className={styles.leftTileArea}>
                        <DashboardUserInfoComponent
                            headerText="User Token"
                            value={
                                this.props.userToken.slice(0, 8) +
                                "..." +
                                this.props.userToken.slice(-8)
                            }
                        />
                    </div>
                    <div className={styles.rightTileArea}>
                        <DashboardUserInfoComponent
                            headerText="ETH Address"
                            value={
                                this.props.ethAddress.slice(0, 8) +
                                "..." +
                                this.props.ethAddress.slice(-8)
                            }
                            shouldShowChangeButton={true}
                        />
                    </div>
                </div>
                <div className={styles.ledgerContainer}>
                    <DashboardLedgerTileUI
                        headerText="ETH Ledger"
                        tableHeaderText={this.state.ethLedgerHeaderText}
                        dataSet={this.state.ethLedgerDataSet}
                        isEth={true}
                    />
                </div>
                <div className={styles.ledgerContainer}>
                    <DashboardLedgerTileUI
                        headerText="SOL Ledger"
                        tableHeaderText={this.state.solLedgerHeaderText}
                        dataSet={this.state.solLedgerDataSet}
                        isEth={false}
                    />
                </div>
            </div>
        );
    }
}
