export interface ApiCashRes<T> {
    data: T;
    message: string | undefined;
}

export interface CashRequestReq {
    selectedTipe: string,
    selectedAll: string,
    selectedCheckbox: number[],
    action: string
}

export interface CashRequestRes {
    id_cash: number,
    duedate: Date,
    appr_date: Date,
    jumlah: number,
    peruntukan: string,
    penerima: string,
    norek: string,
    status: number,
    referensi: string,
    divisi: string
}

export interface CashFilesReq {
    id: number
}

export interface CashFilesRes {
    id_cash: number,
    file_name: string,
    file_path: string
}

export interface PoKontrabonReq {
    noKontrabon: string;
}

export interface PoKontrabonRes {
    nopo: string;
}

export interface GetSaldoRes {
    saldoMandiri: number;
    saldoBca: number;
    saldoKas: number;
}