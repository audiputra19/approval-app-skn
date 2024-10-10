import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/alert";
import Loading from "../Components/loading";
import PinInputForm from "../Components/pinInputForm";
import { useAlert } from "../Contexts/alertContext";
import { PinReq } from "../Interfaces/pin";
import { usePinAccessMutation } from "../Services/api";
import { useAppDispatch } from "../Store";
import { setToken } from "../Store/pinSlice";

export const PinAccess: FC = () => {

    const [token, {data, isLoading, isSuccess, error}] = usePinAccessMutation();
    const dispatch = useAppDispatch();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    useEffect(() => {
        if(data && isSuccess) {
            dispatch(setToken(data.data));
            showAlert(data.message);
            navigate('/');
        } else if(error) {
            const message = (error as any).data.message;
            showAlert(message);
        }
    }, [data, isSuccess, error, dispatch, showAlert, navigate]);

    const handlePinSubmit = (pin: string) => {
        const pinPayload: PinReq = {pin}
        token(pinPayload);
    };

    return (
        isLoading ? (
            <Loading/>
        ) : (
            <div className="flex justify-center items-center min-h-screen w-full bg-white">
                <Alert/>
                <div className="">
                    <PinInputForm onSubmit={handlePinSubmit} />
                </div>
            </div>
        )
    )
} 