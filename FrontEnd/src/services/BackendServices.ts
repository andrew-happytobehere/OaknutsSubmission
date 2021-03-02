export interface EthLedgerDataSet {
    date: Date;
    data1: string;
    data2: number;
    data3: number;
    data4: number;
    data5: number;
}

export interface SolLedgerDataSet {
    date: Date;
    data1: number;
    data2: number;
    data3: number;
}

// Get the dataset for all Eth transactions
export async function GetEthLedgerDataSet(
    demoIteration: number
): Promise<EthLedgerDataSet[]> {
    let returnSet: EthLedgerDataSet[] = [];
    // for the demo, return fake data
    if (demoIteration == 0) {
        let dataSet: EthLedgerDataSet = {
            date: new Date(2020, 3, 1),
            data1: "e6f3049a...814e2a4c",
            data2: 128622,
            data3: 125.865,
            data4: 128622 * (125.865 / 1000000000),
            data5: 128622 * (125.865 / 1000000000) * 1500,
        };
        returnSet.push(dataSet);
    } else if (demoIteration == 1) {
        let currentMonth = 1;
        let currentDay = 1;
        for (let i = 0; i < 20; i++) {
            let dataSet: EthLedgerDataSet = {
                date: new Date(2020, currentMonth++, currentDay++),
                data1:
                    Math.random().toString(16).substr(2, 8) +
                    "..." +
                    Math.random().toString(16).substr(2, 8),
                data2: Math.floor(Math.random() * 500000) + 10000,
                data3: Math.floor(Math.random() * 200) + 50,
                data4: 0,
                data5: 0,
            };
            dataSet.data4 = dataSet.data2 * (dataSet.data3 / 1000000000);
            dataSet.data5 = dataSet.data4 * 1500;
            returnSet.push(dataSet);
        }

        let dataSet1: EthLedgerDataSet = {
            date: new Date(2020, 3, 1),
            data1: "1A2B3C4D...6G8H9IJ0",
            data2: 54239,
            data3: 100,
            data4: 0.0007235,
            data5: 6.45,
        };
    } else {
        for (let i = 0; i < 20; i++) {
            let dataSet: EthLedgerDataSet = {
                date: new Date(2020, i, i),
                data1: i.toString(),
                data2: i + 0.1,
                data3: i + 0.2,
                data4: i + 0.3,
                data5: i + 0.4,
            };
            returnSet.push(dataSet);
        }
    }
    return new Promise((res, rej) => {
        res(returnSet);
    });
}

// Get the dataset for all Sol swaps
export async function GetSolLedgerDataSet(): Promise<SolLedgerDataSet[]> {
    let returnSet: SolLedgerDataSet[] = [];
    for (let i = 0; i < 20; i++) {
        let dataSet: SolLedgerDataSet = {
            date: new Date(2020, i, i),
            data1: i,
            data2: i + 0.1,
            data3: i + 0.2,
        };
        returnSet.push(dataSet);
    }
    return new Promise((res, rej) => {
        res(returnSet);
    });
}
