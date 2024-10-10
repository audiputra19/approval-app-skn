import React, { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Store";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../Store/pinSlice";

interface TokenPayload {
    exp: number;
}

export const ProtectedRouter: FC<{ children: JSX.Element }> = ({ children }) => {
    
    const token = useAppSelector(state => state.pin.token);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(token) {
            const decodeToken = jwtDecode<TokenPayload>(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if(decodeToken.exp < currentTime) {
                dispatch(clearToken());
                navigate('/pin-access');
            }
        } else {
            navigate('/pin-access');
        }
    }, [token, navigate, dispatch]);

    return children;
}