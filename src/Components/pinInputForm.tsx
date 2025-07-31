import React, { useState, useRef, useEffect } from 'react';

interface PinInputFormProps {
  onSubmit: (pin: string) => void;
}

const PinInputForm: React.FC<PinInputFormProps> = ({ onSubmit }) => {
    const [pin, setPin] = useState<string[]>(Array(6).fill('')); // Array untuk menyimpan nilai 6 digit
    const inputRefs = useRef<HTMLInputElement[]>([]); // Referensi untuk mengontrol input secara manual

    // useEffect(() => {
    //     if (inputRefs.current[0]) {
    //       inputRefs.current[0].focus();
    //     }
    // }, []);    

    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) { // Hanya menerima satu digit angka
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Pindah ke input berikutnya jika ada input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Pindah ke input sebelumnya jika tombol "Backspace" ditekan dan input kosong
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pinCode = pin.join('');
        onSubmit(pinCode);
    };

    return (
        <div className='mx-'>
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl text-black font-bold mb-4 text-center">Enter PIN</h2>

            <div className="flex justify-between space-x-2 mb-4">
            {pin.map((_, index) => (
                <input
                key={index}
                type="number"
                maxLength={1}
                value={pin[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {inputRefs.current[index] = el!}}
                className="w-12 h-12 text-center text-black border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xl"
                />
            ))}
            </div>

            <button
            type="submit"
            className="w-full bg-blue-500 text-lg font-semibold text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
            Submit
            </button>
        </form>
    </div>
  );
};

export default PinInputForm;
