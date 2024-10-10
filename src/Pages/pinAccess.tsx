import { FC, useEffect } from "react";
import PinInputForm from "../Components/pinInputForm";
import { usePinAccessMutation } from "../Services/api";
import { PinReq } from "../Interfaces/pin";
import { useAppDispatch, useAppSelector } from "../Store";
import { setToken } from "../Store/pinSlice";
import { useAlert } from "../Contexts/alertContext";
import Alert from "../Components/alert";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/loading";

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
    }, [data, isSuccess, error, dispatch, showAlert]);

    const handlePinSubmit = (pin: string) => {
        const pinPayload: PinReq = {pin}
        token(pinPayload);
    };

    return (
        isLoading ? (
            <Loading/>
        ) : (
            <div className="flex justify-center items-center min-h-screen w-full bg-white dark:bg-gray-900">
                <Alert/>
                <div className="">
                    <PinInputForm onSubmit={handlePinSubmit} />
                </div>
            </div>
        )
    )
} 