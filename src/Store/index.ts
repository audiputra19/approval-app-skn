import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import pinSlice from "./pinSlice";
import { persistReducer, persistStore } from "redux-persist";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { api } from "../Services/api";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['pin'],
}

const rootReducer = combineReducers({
    pin: pinSlice,
    [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            api.middleware
        )
});

export const persistor = persistStore(store);
export type Rootstate = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<Rootstate> = useSelector;