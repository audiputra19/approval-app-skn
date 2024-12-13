import { FC } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Konfirmasi Keluar</h2>
                <p className="mb-6">Apakah Anda yakin ingin keluar?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => {
                        onClose();
                        // Action for logout can be placed here
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    )
}