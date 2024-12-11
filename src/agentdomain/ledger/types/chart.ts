export interface GraphData {
   data:Statistic[]
}

export interface Statistic {
    x:string
    y:number
}

export interface ProviderRegistrationStatistic {
    date:string
    providers:number
}

export interface FloatRequest {
    id:number
    dateRequested:string
    amount:number
    status:string
    branchId:number
}

export interface RequestFloat {
    amount:number
    tillId:number
}