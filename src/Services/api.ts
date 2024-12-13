import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiRes, PinChangeReq, PinChangeRes, PinReq, PinRes } from "../Interfaces/pin";
import { ApiCashRes, CashRequestReq, CashRequestRes } from "../Interfaces/main";

export const api = createApi({
    reducerPath: "api",
    //baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
     baseQuery: fetchBaseQuery({ baseUrl: "https://api-approval.vercel.app" }),
    endpoints: build => ({
        PinAccess: build.mutation<ApiRes<PinRes>, PinReq>({
            query: body => ({
                url: "/pin-access",
                method: "POST",
                body,
            })
        }),
        MainPost: build.mutation<ApiCashRes<CashRequestRes>, CashRequestReq>({
            query: body => ({
                url: "/main",
                method: "POST",
                body,
            })
        })
        ,
        PinChange: build.mutation<PinChangeRes, PinChangeReq>({
            query: body => ({
                url: "/pin-change",
                method: "POST",
                body,
            })
        })
    })
})

export const { usePinAccessMutation, useMainPostMutation, usePinChangeMutation } = api;