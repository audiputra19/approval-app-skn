import React, { FC, useEffect, useState } from "react";
import Alert from "../Components/alert";
import { useMainPostMutation } from "../Services/api";
import { useAlert } from "../Contexts/alertContext";
import Loading from "../Components/loading";
import { CashRequestRes } from "../Interfaces/main";
import { CalendarClock, CreditCard } from "lucide-react";
import moment from "moment";

const Home: FC = () => {

    const [selectedItem, setSelectedItem] = useState({
        selectedComp: '',
        selectedAll: ''
    });
    const [selectedCheckbox, setSelectedCheckbox] = useState<number[]>([]);
    const [main, {data, isLoading, error}] = useMainPostMutation();
    const { showAlert } = useAlert();
    const report = data?.data as CashRequestRes[] | undefined;

    // console.log('selected checkbox all:', selectedItem.selectedAll);
    // console.log('selected checkbox item:', selectedCheckbox);

    useEffect(() => {
        main(selectedItem);
    }, [main, selectedItem]);

    useEffect(() => {
        if (error) {
            const message = (error as any).data.message;
            showAlert(message);
        }
    }, [error, showAlert]);

    const handleSelectCompChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedItem(prev => ({
            ...prev,
            selectedComp: e.target.value
        }));

        main({ ...selectedItem, selectedComp: e.target.value });
    }

/*************  ✨ Codeium Command ⭐  *************/
    /**
     * Handles the change event of a checkbox and updates the state accordingly.
     * @param {number} id - The id of the checkbox that was changed.
     * @returns {void}
     */
/******  0b05862d-ffc0-4730-afa8-86b5b0348bb8  *******/    const handleCheckboxChange = (id: number) => {
        setSelectedCheckbox(prevCheckboxes => {
            if(prevCheckboxes.includes(id)) {
                return prevCheckboxes.filter(checkbox => checkbox !== id);
            } else {
                return [...prevCheckboxes, id];
            }
        })
    }

    return (
        isLoading ? (
            <Loading/>
        ) : (
            <div className="min-h-screen w-full bg-white">
                <Alert/>
                <div className="sticky top-0 bg-white p-3 border-b border-gray-200 shadow-sm">
                    <div className="flex gap-3">
                        <select
                            className="select w-[150px] rounded-xl bg-white text-black border border-gray-200"
                            value={selectedItem.selectedComp}
                            onChange={handleSelectCompChange}
                        >
                            <option value="0">BES</option>
                            <option value="1">UTM</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-black">Show All</span>
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-md checkbox-primary border-blue-900"
                                onChange={(e) => setSelectedItem(prev => ({
                                    ...prev,
                                    selectedAll: e.target.checked ? '1' : '0'
                                }))}
                                checked={selectedItem.selectedAll === '1'}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-5 flex flex-col gap-5 mb-[70px]">
                    {report?.map((item: CashRequestRes, i: number) => {
                        const dueDate = moment(item.duedate).format('DD MMM YYYY');
                        const apprDate = moment(item.appr_date);
                        const dueDateOri = moment(item.duedate);
                        const today = new Date();
                        let days = 0;
                        if(item.status === 3){
                            days = apprDate.diff(dueDateOri, 'days');
                        } else {
                            days = dueDateOri.diff(today, 'days');
                        }

                        const interval = days;

                        let bgColor = 'bg-white';
                        let bgSecondary = 'bg-gray-100'
                        let borderColor = 'border-gray-200';
                        let borderSecondary = 'border-gray-200';
                        let textColor = 'text-black';
                        let textSecondary = 'text-gray-700';
                        let checkboxColor = 'checkbox-primary';
                        if(interval < 0){
                            if(item.status === 3){
                                bgColor = 'bg-green-100';
                                bgSecondary = 'bg-green-200'
                                borderColor = 'border-green-100';
                                borderSecondary = 'border-green-900';
                                textColor = 'text-green-900';
                                textSecondary = 'text-green-900';
                                checkboxColor = 'checkbox-success';
                            } else {
                                bgColor = 'bg-red-100';
                                bgSecondary = 'bg-red-200'
                                borderColor = 'border-red-100';
                                borderSecondary = 'border-red-900';
                                textColor = 'text-red-900';
                                textSecondary = 'text-red-900';
                                checkboxColor = 'checkbox-danger';
                            }
                        } else if(interval >= 0 && interval < 8){
                            bgColor = 'bg-blue-100';
                            bgSecondary = 'bg-blue-200'
                            borderColor = 'border-blue-100';
                            borderSecondary = 'border-blue-900';
                            textColor = 'text-blue-900';
                            textSecondary = 'text-blue-900';
                            checkboxColor = 'checkbox-primary';
                        }

                        return (
                            <div 
                                key={i}
                                className={`border ${bgColor} ${borderColor} rounded-xl p-5`}
                            >
                                <div 
                                    className="flex justify-between items-center"
                                >
                                    <div className={`font-semibold ${textColor}`}>
                                        {item.id_cash}
                                    </div>
                                    <div>
                                        <input 
                                            type="checkbox" 
                                            className={`checkbox checkbox-md ${checkboxColor} ${borderSecondary}`}
                                            onChange={() => handleCheckboxChange(item.id_cash)} 
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-col gap-3">
                                    <div className={`${bgSecondary} ${textSecondary} rounded-xl p-3`}>
                                        <div className={`text-sm ${textSecondary}`}>
                                            {item.peruntukan}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className={`flex gap-2 px-3 py-2 ${bgSecondary} ${textSecondary} rounded-xl items-center text-sm`}>
                                            <CreditCard size={20}/>
                                            <div>
                                                {item.norek}
                                            </div>
                                        </div>
                                        <div className={`flex gap-2 px-3 py-2 ${bgSecondary} ${textSecondary} rounded-xl items-center text-sm`}>
                                            <CalendarClock size={20}/>
                                            <div>
                                                <span className={`${textColor}`}>Due Date - </span>
                                                {dueDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <p className={`${textColor} font-semibold`}>Rp. 
                                            <span className={`${textColor} text-xl font-semibold ml-1`}>{Number(item.jumlah).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </p>
                                        <div
                                            className={`bg-transparent border ${borderSecondary} ${textColor} p-2 rounded-xl text-xs font-semibold`}
                                        >
                                            {days.toLocaleString('id-ID')} Days
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="fixed bottom-0 bg-white p-3 w-full border-t border-gray-200">
                    <button
                        className="w-full bg-blue-500 p-3 text-white rounded-xl font-semibold"
                    >
                        Save
                    </button>
                </div>
            </div>
        )
    )
}

export default Home;