import { X } from "lucide-react";
import { FC, useEffect } from "react";
import { useFilePostMutation, usePoKontrabonMutation } from "../Services/api";
import { CashFilesRes } from "../Interfaces/main";
import Loading from "./loading";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    noKontrabon: string;
}
export const ModalPoKontrabon: FC<ModalProps> = ({ isOpen, onClose, noKontrabon }) => {
    
    const [poKontrabon, {data, isLoading}] = usePoKontrabonMutation();
    //console.log(data?.length)
    
    useEffect(() => {
        if (isOpen && noKontrabon) {
        poKontrabon({ noKontrabon });
        }
    }, [isOpen, noKontrabon, poKontrabon]);

    if(!isOpen) return null

    const listFile = data?.map((item, index) => {
        return (
            <a
                href={`https://app.sknmedical.co.id/skn/purchasing/po_pdf.php?no=${item.nopo}`}
                key={item.nopo}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className="flex">
                    <p className="w-[25px] text-center font-bold">{index + 1}.</p>
                    <p className="text-blue-600 underline">{item.nopo}</p>
                </span>
            </a>
        )
    })

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {isLoading && <Loading/>}
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-end cursor-pointer">
                    <X onClick={onClose}/>
                </div>
                <h2 className="text-xl font-bold mb-4">Document</h2>
                <div className="flex flex-col gap-3">
                    {data && data.length > 0 ? (
                        listFile
                    ) : (
                        <p className="text-center">Tidak ada dokumen</p>
                    )}
                </div>
            </div>
        </div>
    )
}