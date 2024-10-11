import React, { FC, useEffect, useState } from "react";
import Alert from "../Components/alert";
import { useMainPostMutation } from "../Services/api";
import { useAlert } from "../Contexts/alertContext";
import Loading from "../Components/loading";
import { CashRequestReq, CashRequestRes } from "../Interfaces/main";
import { CalendarClock, CreditCard } from "lucide-react";
import moment from "moment";
import { NotFound } from "../Components/notFound";
import { read } from "fs";

const Home: FC = () => {

    const [selectedItem, setSelectedItem] = useState({
        selectedComp: '',
        selectedAll: '',
        selectedCheckbox: []
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
    
    const handleCheckboxChange = (id: number) => {
        setSelectedCheckbox(prevCheckboxes => {
            if(prevCheckboxes.includes(id)) {
                return prevCheckboxes.filter(checkbox => checkbox !== id);
            } else {
                return [...prevCheckboxes, id];
            }
        })
    }

    const handleClickSave = async () => {
        const payload: CashRequestReq = {
            ...selectedItem,
            selectedCheckbox: selectedCheckbox,
        }

        await main(payload);
        await main(selectedItem);

        showAlert(data?.message as string);
    }

    return (
        isLoading ? (
            <Loading/>
        ) : (
            <div className="min-h-screen w-full bg-gray-50">
                <Alert/>
                <div className="sticky top-0 bg-white p-3 sm:px-10 md:px-28 lg:px-48 border-b border-gray-200 shadow-sm">
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
                    {report && report.length === 0 ? (
                        <NotFound/>
                    ) : (
                        report?.map((item: CashRequestRes, i: number) => {
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
    
                            const interval = Math.floor(days);
    
                            let color = 'border-gray-600 bg-gray-200 text-gray-600';
                            let colorItem = 'border-gray-400';
                            if(interval < 0){
                                if(item.status === 3){
                                    color = 'border-green-600 bg-green-200 text-green-600';
                                    colorItem = 'border-green-400';
                                } else {
                                    color = 'border-red-600 bg-red-200 text-red-600';
                                    colorItem = 'border-red-400';
                                }
                            } else if(interval >= 0 && interval < 8){
                                color = 'border-blue-600 bg-blue-200 text-blue-600';
                                colorItem = 'border-blue-400';
                            }
                            
    
                            return (
                                <div 
                                    key={i}
                                    className={`border bg-white border-gray-200 rounded-xl p-5 sm:mx-10 md:mx-28 lg:mx-72 shadow-sm`}
                                >
                                    <div 
                                        className="flex justify-between items-center"
                                    >
                                        <div className={`flex gap-3 items-center font-semibold text-black`}>
                                            <div className={`border-4 ${colorItem} p-1 rounded-full`}></div>
                                            {item.id_cash}
                                        </div>
                                        <div>
                                            <input 
                                                type="checkbox" 
                                                className={`checkbox checkbox-md ${item.status === 3 ? 'checkbox-success border-green-900' : 'checkbox-primary border-blue-900'}`}
                                                onChange={() => handleCheckboxChange(item.id_cash)}
                                                checked={item.status === 3 || selectedCheckbox.includes(item.id_cash)} 
                                                readOnly={item.status === 3}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-col gap-3">
                                        <div className={`bg-gray-100 text-gray-700 rounded-xl p-3`}>
                                            <div className={`text-sm text-gray-700`}>
                                                {item.peruntukan}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className={`flex gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl items-center text-sm`}>
                                                <CreditCard size={20}/>
                                                <div>
                                                    {item.norek ? item.norek : '-'}
                                                </div>
                                            </div>
                                            <div className={`flex gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl items-center text-sm`}>
                                                <CalendarClock size={20}/>
                                                <div>
                                                    <span className={`text-black`}>Due Date - </span>
                                                    {dueDate}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <p className={`text-black font-semibold`}>Rp. 
                                                <span className={`text-black text-xl font-semibold ml-1`}>{Number(item.jumlah).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </p>
                                            <div
                                                className={`bg-transparent border ${color} p-2 rounded-xl text-xs font-semibold`}
                                            >
                                                {days.toLocaleString('id-ID')} Days
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                {report && report?.length > 0 && (
                    <div className="fixed bottom-0 bg-white p-3 sm:px-10 md:px-28 lg:px-72 w-full border-t border-gray-200">
                        <button
                            className="w-full bg-blue-500 p-3 text-white rounded-xl font-semibold"
                            onClick={handleClickSave}
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        )
    )
}

export default Home;