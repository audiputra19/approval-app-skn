import { X } from "lucide-react";
import { FC, useState } from "react";
import { useGetSaldoQuery, usePinChangeMutation } from "../Services/api";
import { useAlert } from "../Contexts/alertContext";
import Loading from "./loading";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const ModalSaldo: FC<ModalProps> = ({ isOpen, onClose }) => {
    const { data, isLoading } = useGetSaldoQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    if(!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {isLoading && <Loading/>}
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-end cursor-pointer">
                    <X onClick={onClose}/>
                </div>
                <h2 className="text-xl font-bold mb-4">Saldo Saat ini</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                        <span className="w-[60px]">Mandiri</span>:
                        <span className="font-bold text-lg text-green-500">{data?.saldoMandiri.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className="w-[60px]">BCA</span>:
                        <span className="font-bold text-lg text-green-500">{data?.saldoBca.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className="w-[60px]">Kas</span>:
                        <span className="font-bold text-lg text-green-500">{data?.saldoKas.toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}