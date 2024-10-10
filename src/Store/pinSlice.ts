import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PinRes } from "../Interfaces/pin";

interface PinState {
    token?: string
}

const initialState: PinState = {
    token: undefined
}

const pinSlice = createSlice({
    name: 'pin',
    initialState,
    reducers: {
        setToken: (state, { payload }: PayloadAction<PinRes>) => {
            state.token = payload.token;
        },
        clearToken: (state) => {
            state.token = undefined;
        }
    }
});

export const { setToken, clearToken } = pinSlice.actions;
export default pinSlice.reducer;