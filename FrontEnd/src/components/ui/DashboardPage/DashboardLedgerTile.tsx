import * as React from "react";
import styles from "../../css/DashboardPage.module.css";
import {
    EthLedgerDataSet,
    SolLedgerDataSet,
} from "../../../services/BackendServices";

export interface DashboardLedgerTileProps {
    headerText: string;
    tableHeaderText: string[];
    dataSet: EthLedgerDataSet[] | SolLedgerDataSet[];
    isEth: boolean;
}

export interface DashboardLedgerTileState {}

export class DashboardLedgerTileUI extends React.Component<
    DashboardLedgerTileProps,
    DashboardLedgerTileState
> {
    totalColumns: number;
    constructor(props: DashboardLedgerTileProps) {
        super(props);
        this.totalColumns = this.props.headerText.length;
    }

    getTotals(): number[] {
        let totalDataPoint2: number = 0;
        let totalDataPoint4: number = 0;
        let totalDataPoint5: number = 0;

        this.props.dataSet.forEach(
            (element: EthLedgerDataSet | SolLedgerDataSet) => {
                totalDataPoint2 += element.data2;
                if ("data4" in element && "data5" in element) {
                    totalDataPoint4 += element.data4;
                    totalDataPoint5 += element.data5;
                }
            }
        );

        if (this.props.isEth) {
            return [0, totalDataPoint2, 0, totalDataPoint4, totalDataPoint5];
        } else {
            return [totalDataPoint2, totalDataPoint2, totalDataPoint2];
        }
    }

    render() {
        let castDataSet: any;
        let tableBody = <div />;
        if (this.props.isEth) {
            castDataSet = this.props.dataSet as EthLedgerDataSet[];
            tableBody = castDataSet.map(
                (dataSet: EthLedgerDataSet, index: number) => (
                    <tr key={dataSet.toString() + index}>
                        <td key={dataSet.date.toString() + index}>
                            {dataSet.date.toString()}
                        </td>
                        <td key={dataSet.data1.toString() + index}>
                            {dataSet.data1}
                        </td>
                        <td key={dataSet.data2.toString() + index}>
                            {dataSet.data2}
                        </td>
                        <td key={dataSet.data3.toString() + index}>
                            {dataSet.data3}
                        </td>
                        <td key={dataSet.data4.toString() + index}>
                            {dataSet.data4}
                        </td>
                        <td key={dataSet.data5.toString() + index}>
                            {dataSet.data5}
                        </td>
                    </tr>
                )
            );
        } else {
            castDataSet = this.props.dataSet as SolLedgerDataSet[];
            tableBody = castDataSet.map(
                (dataSet: SolLedgerDataSet, index: number) => (
                    <tr key={dataSet.toString() + index}>
                        <td key={dataSet.date.toString() + index}>
                            {dataSet.date.toString()}
                        </td>
                        <td key={dataSet.data1.toString() + index}>
                            {dataSet.data1}
                        </td>
                        <td key={dataSet.data2.toString() + index}>
                            {dataSet.data2}
                        </td>
                        <td key={dataSet.data3.toString() + index}>
                            {dataSet.data3}
                        </td>
                    </tr>
                )
            );
        }

        return (
            <div className={styles.ledgerTable}>
                <h1>{this.props.headerText}</h1>
                <table>
                    <thead>
                        <tr>
                            {this.props.tableHeaderText.map(
                                (tableHeaderText: string) => (
                                    <th key={tableHeaderText}>
                                        {tableHeaderText}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>{tableBody}</tbody>
                    <tfoot>
                        <tr>
                            <td>Totals</td>
                            {this.getTotals().map((element: number, index) =>
                                element != 0 ? (
                                    <td key={element.toString() + index}>
                                        {element}
                                    </td>
                                ) : (
                                    <td key={element.toString() + index} />
                                )
                            )}
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}
