import * as React from "react";
import styles from "../css/YellowButton.module.css";
import { Cluster } from "@solana/web3.js";

export interface YellowButtonProps {
    buttonIdentifier: string; // unique id of button
    buttonType: string; // type of button: main, middle, top
    buttonString: string; // text to show in the button
    cluster?: Cluster; // cluster for wallet connection
    handleConnectWallet?: (wallet: any) => void; // callback to App.tsx when wallet connects
}

// Views should override this
export interface YellowButtonDispatch {
    onButtonClick?: () => void;
    onConnectWalletClick?: (
        handleConnectWallet: (wallet: any) => void,
        cluster: Cluster
    ) => any; // Only used by connect wallet
}

export class YellowButtonUI extends React.Component<
    YellowButtonProps & YellowButtonDispatch
> {
    constructor(props: YellowButtonProps & YellowButtonDispatch) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.onButtonClick) {
            this.props.onButtonClick();
        }

        if (
            this.props.onConnectWalletClick &&
            this.props.handleConnectWallet &&
            this.props.cluster
        ) {
            this.props.onConnectWalletClick(
                this.props.handleConnectWallet,
                this.props.cluster
            );
        }
    }

    render() {
        // The buttonType defines the CSS style of the button rendered
        let button = <div></div>;
        switch (this.props.buttonType) {
            case "main":
                button = (
                    <button className={styles.main} onClick={this.handleClick}>
                        {this.props.buttonString}
                    </button>
                );
                break;
            case "middle":
                button = (
                    <button
                        className={styles.middle}
                        onClick={this.handleClick}
                    >
                        {this.props.buttonString}
                    </button>
                );
                break;
            case "top":
                button = (
                    <button className={styles.top} onClick={this.handleClick}>
                        {this.props.buttonString}
                    </button>
                );
                break;
            case "change":
                button = (
                    <button
                        className={styles.change}
                        onClick={this.handleClick}
                    >
                        {this.props.buttonString}
                    </button>
                );
                break;
            default:
                break;
        }

        return button;
    }
}
