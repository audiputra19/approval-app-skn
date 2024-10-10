export interface ApiCashRes<T> {
    data: T;
    message: string;
}

export interface CashRequestReq {
    selectedComp: string,
    selectedAll: string
}

export interface CashRequestRes {
    id_cash: number,
    duedate: Date,
    appr_date: Date,
    jumlah: number,
    peruntukan: string,
    penerima: string,
    norek: string,
    status: number
}
