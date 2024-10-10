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
    const [main, {data, isLoading, error}] = useMainPostMutation();
    const { showAlert } = useAlert();
    const report = data?.data as CashRequestRes[] | undefined;

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

    return (
        isLoading ? (
            <Loading/>
        ) : (
            <div className="min-h-screen w-full bg-white">
                <Alert/>
                <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
                    <select
                        className="select w-[150px] rounded-xl bg-white text-black border border-gray-200"
                        value={selectedItem.selectedComp}
                        onChange={handleSelectCompChange}
                    >
                        <option value="0">BES</option>
                        <option value="1">UTM</option>
                    </select>
                </div>
                <div className="p-5 flex flex-col gap-5 mb-[75px]">
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

                        return (
                            <div 
                                key={i}
                                className={`border shadow-md ${i === 0 ? 'bg-blue-100 border-blue-100 shadow-blue-200' : 'bg-white border-gray-100 shadow-gray-200'} rounded-xl p-5`}
                            >
                                <div 
                                    className="flex justify-between items-center"
                                >
                                    <div className={`font-semibold ${i === 0 ? 'text-blue-900' : 'text-black'}`}>
                                        {item.id_cash}
                                    </div>
                                    <div>
                                        <input type="checkbox" className="checkbox checkbox-md checkbox-primary border-blue-900" />
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-col gap-3">
                                    <div className={`${i === 0 ? 'bg-blue-200 text-blue-900' : 'bg-gray-100 text-gray-700'} rounded-xl p-3`}>
                                        <div className={`text-sm ${i === 0 ? 'text-blue-900' : 'text-gray-700'}`}>
                                            {item.peruntukan}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className={`flex gap-2 px-3 py-2 ${i === 0 ? 'bg-blue-200 text-blue-900' : 'bg-gray-100 text-gray-700'} rounded-xl items-center text-sm`}>
                                            <CreditCard size={20}/>
                                            <div>
                                                {item.norek}
                                            </div>
                                        </div>
                                        <div className={`flex gap-2 px-3 py-2 ${i === 0 ? 'bg-blue-200 text-blue-900' : 'bg-gray-100 text-gray-700'} rounded-xl items-center text-sm`}>
                                            <CalendarClock size={20}/>
                                            <div>
                                                <span className={`${i === 0 ? 'text-blue-900' : 'text-black'}`}>Due Date - </span>
                                                {dueDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <p className={`${i === 0 ? 'text-blue-900' : 'text-black'} font-semibold`}>Rp. 
                                            <span className={`${i === 0 ? 'text-blue-900' : 'text-black'} text-xl font-semibold ml-1`}>{Number(item.jumlah).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </p>
                                        <div
                                            className="bg-transparent border border-blue-900 text-blue-900 p-2 rounded-xl text-xs font-semibold"
                                        >
                                            {days} Days
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