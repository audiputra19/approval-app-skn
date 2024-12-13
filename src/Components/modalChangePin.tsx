import { X } from "lucide-react";
import { FC, useState } from "react";
import { usePinChangeMutation } from "../Services/api";
import { useAlert } from "../Contexts/alertContext";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}
export const ChangePinModal: FC<ModalProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        newPin: '',
        reEnterPin: ''
    });
    const [ changePin, { data } ] = usePinChangeMutation();
    const { showAlert } = useAlert();

    if(!isOpen) return null

    const handleSubmit = async () => {
        // Validasi PIN

        if (form.newPin !== form.reEnterPin) {
            showAlert('PINs do not match');
            return;
        }

        if (form.newPin.length !== 6) {
            showAlert('PIN must be 6 digits');
            return;
        }

        const response = await changePin({ newPin: form.newPin }).unwrap();
        showAlert(response.message);
        
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="flex justify-end cursor-pointer">
                    <X onClick={onClose}/>
                </div>
                <h2 className="text-xl font-bold mb-4">Change PIN</h2>
                <div className="flex flex-col gap-3">
                    <div>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-gray-300 rounded-md" 
                            placeholder="New PIN" 
                            onChange={(e) => setForm({...form, newPin: e.target.value})}   
                        />
                    </div>
                    <div>
                        <input 
                            type="number" 
                            className="w-full p-3 border border-gray-300 rounded-md" 
                            placeholder="Re-enter PIN"
                            onChange={(e) => setForm({...form, reEnterPin: e.target.value})}    
                        />
                    </div>
                    <div className="mt-3">
                        <button 
                            className="w-full bg-blue-500 text-white font-semibold py-3 px-4 
                            rounded-md hover:bg-blue-600"
                            onClick={handleSubmit}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}