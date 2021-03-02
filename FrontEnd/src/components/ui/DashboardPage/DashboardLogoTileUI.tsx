import * as React from "react";
import styles from "../../css/DashboardPage.module.css";
import logo from "../../../logo.svg";
import store from "../../../redux/store";
export interface DashboardLogoTileUIState {
    currentSol: number;
    currentNuts: number;
}

export class DashboardLogoTileUI extends React.Component<
    any,
    DashboardLogoTileUIState
> {
    timerId: number;
    demoCount: number;
    constructor(props: any) {
        super(props);
        this.state = {
            currentSol: 0.0,
            currentNuts: 0.0,
        };
        this.demoCount = 0;
        this.timerId = 0;
        this.updateState = this.updateState.bind(this);
    }

    componentDidMount() {
        this.timerId = window.setInterval(
            () => this.updateState(this.state),
            30000
        ); // update every 3 seconds
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    updateState(state: DashboardLogoTileUIState) {
        if (this.demoCount == 0) {
            this.setState({
                currentSol: 1.686,
                currentNuts:
                    state.currentNuts +
                    Math.round(Math.random() * 100 * 1000000) / 100000,
            });
            this.demoCount++;
        } else if (this.demoCount == 1) {
            this.setState({
                currentSol: 1420.6337,
                currentNuts:
                    state.currentNuts +
                    Math.round(Math.random() * 100 * 1000000) / 100000,
            });
            this.demoCount++;
        } else {
            this.setState({
                currentSol: store.getState().currentSolBalance,
                currentNuts:
                    state.currentNuts +
                    Math.round(Math.random() * 100 * 1000000) / 100000,
            });
        }
    }

    render() {
        return (
            <div className={styles.logoTileGridContainer}>
                <div className={styles.logoArea}>
                    <img src={logo} className={styles.logoTileLogoAnimation} />
                </div>
                <div className={styles.solArea}>
                    <h1>Your $SOL</h1>
                    <div className={styles.line} />
                    <p>{this.state.currentSol}</p>
                </div>
                {/*<div className={styles.nutsArea}>
                    <h1>Your $NUTS</h1>
                    <div className={styles.line} />
                    <p>{this.state.currentNuts}</p>
                </div>*/}
            </div>
        );
    }
}
