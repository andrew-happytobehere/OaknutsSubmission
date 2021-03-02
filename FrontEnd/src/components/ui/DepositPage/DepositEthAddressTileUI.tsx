import {
    AccountMeta,
    Cluster,
    clusterApiUrl,
    Commitment,
    Connection,
    PublicKey,
} from "@solana/web3.js";
import * as React from "react";
import { UpdateEthAddress } from "../../../services/OaknutsSmartContract";
import styles from "../../css/DepositPage.module.css";
import { DepositSingleRowComponent } from "./DepositSingleRowComponent";

export interface DepositEthAddressTileUIProps {
    currentEthAddress: string;
    wallet: any;
    cluster: Cluster;
}

export interface DepositEthAddressTileUIState {
    newAddressInputValue: string;
}

// Views should override this
export interface DepositEthAddressTileUIDispatch {
    OnChangeEthAddressButtonPress: (newEthAddress: string) => void;
}

export class DepositEthAddressTileUI extends React.Component<
    DepositEthAddressTileUIProps & DepositEthAddressTileUIDispatch,
    DepositEthAddressTileUIState
> {
    constructor(
        props: DepositEthAddressTileUIProps & DepositEthAddressTileUIDispatch
    ) {
        super(props);

        this.state = {
            newAddressInputValue: "New Address...",
        };

        this.handleChange = this.handleChange.bind(this);
        this.onUpdateButtonClick = this.onUpdateButtonClick.bind(this);
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            newAddressInputValue: event.currentTarget.value,
        });
    }

    onUpdateButtonClick() {
        // if new address is 42 characters long...
        let commitment: Commitment = "finalized";
        const connection = new Connection(
            clusterApiUrl(this.props.cluster),
            commitment
        );

        let accountMeta: AccountMeta = {
            pubkey: new PublicKey(this.props.wallet.publicKey.toBase58()),
            isSigner: true,
            isWritable: false,
        };

        UpdateEthAddress(
            this.props.wallet,
            connection,
            this.state.newAddressInputValue,
            accountMeta
        );
        this.props.OnChangeEthAddressButtonPress(
            this.state.newAddressInputValue
        );
    }

    render() {
        return (
            <div className={styles.ethTileGridContainer}>
                <div className={styles.ethTileHeaderArea}>
                    <h1>Currently Tracking</h1>
                    <div className={styles.line} />
                </div>
                <div className={styles.ethRowArea}>
                    <DepositSingleRowComponent
                        mainText={
                            this.props.currentEthAddress.slice(0, 4) +
                            "..." +
                            this.props.currentEthAddress.slice(-4)
                        }
                        middleText=""
                        inputFieldValue={this.state.newAddressInputValue}
                        handleInputFieldChange={this.handleChange}
                        secondButtonText="Update"
                        onSecondButtonClick={this.onUpdateButtonClick}
                    />
                </div>
            </div>
        );
    }
}
