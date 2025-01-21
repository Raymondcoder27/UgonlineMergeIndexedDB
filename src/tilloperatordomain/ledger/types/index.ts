export interface GraphData {
    data: Statistic[]
}

export interface Statistic {
    x: string
    y: number
}

export interface ProviderRegistrationStatistic {
    date: string
    providers: number
}

export interface FloatRequest {
    id: number
    requestDate: string
    amount: number
    status: string
    // branchId: number
    tillId: string
}

export interface RequestFloat {
    amount: number
    tillId: number
    branch: string
    requestDate: string
    status: string
}

export type Transaction = {
    // id: string;
    id: number;
    // branchName: string;
    // manager: string;
    // transactionType: string;
    trackingNumber: string;
    service: string;
    provider: string;
    till: string;
    fee: number;
    status: string;
    date: string;
    // amount: number;
};

export interface FloatLedger {
    // id: string;
    id: number;
    date: string;
    description: string;
    amount: number;
    balance: number;
    createdAt: string;
}