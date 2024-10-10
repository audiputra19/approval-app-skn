export interface ApiRes<T> {
    data: T,
    message: string;
}

export interface PinReq {
    pin: string;
}

export interface PinRes {
    token: string;
}