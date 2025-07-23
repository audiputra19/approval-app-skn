import { X } from "lucide-react";
import { FC, useEffect } from "react";
import { useFilePostMutation } from "../Services/api";
import { CashFilesRes } from "../Interfaces/main";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    idCash: number;
}
export const ModalDoc: FC<ModalProps> = ({ isOpen, onClose, idCash }) => {
    
    const [file, {data}] = useFilePostMutation();
    
    useEffect(() => {
        if (isOpen && idCash) {
        file({ id: idCash });
        }
    }, [isOpen, idCash, file]);

    if(!isOpen) return null

    const listFile = (data?.data as unknown as CashFilesRes[])?.map((item, index) => {
        return (
            <a href={`https://app.sknmedical.co.id/skn/fnc/cash_request/${item.path}`}>
                {item.name}
            </a>
        )
    })

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-end cursor-pointer">
                    <X onClick={onClose}/>
                </div>
                <h2 className="text-xl font-bold mb-4">Document</h2>
                <div className="flex flex-col gap-3">
                    {listFile}
                </div>
            </div>
        </div>
    )
}