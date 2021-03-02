import * as React from "react";
import styles from "../../css/DashboardPage.module.css";
import { DepositButtonUI } from "../../managed/DepositButtonView";

export interface DashboardUserInfoComponentProps {
    headerText: string;
    value: string;
    shouldShowChangeButton?: boolean;
}

export class DashboardUserInfoComponent extends React.Component<DashboardUserInfoComponentProps> {
    constructor(props: DashboardUserInfoComponentProps) {
        super(props);
    }

    render() {
        return (
            <div className={styles.dashboardUserInfoComponentGridContainer}>
                <div className={styles.headerArea}>
                    <h1>{this.props.headerText}</h1>
                    <div className={styles.line} />
                </div>
                <div className={styles.valueArea}>
                    <p>{this.props.value}</p>
                </div>
                {this.props.shouldShowChangeButton ? (
                    <div className={styles.changeButtonArea}>
                        <DepositButtonUI
                            buttonIdentifier="ChangeButton"
                            buttonType="change"
                        />
                    </div>
                ) : (
                    <div />
                )}
            </div>
        );
    }
}
