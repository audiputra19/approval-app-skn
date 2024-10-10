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
    }, []);

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
                        className="select w-[150px] rounded-xl border border-gray-200"
                        value={selectedItem.selectedComp}
                        onChange={handleSelectCompChange}
                    >
                        <option value="0">BES</option>
                        <option value="1">UTM</option>
                    </select>
                </div>
                <div className="p-3 flex flex-col gap-5 mb-[75px]">
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
                                className="border border-gray-100 rounded-xl shadow-md shadow-gray-200"
                            >
                                <div 
                                    className="flex justify-between items-center border-b border-gray-200 p-3"
                                >
                                    <div className="font-semibold text-black">
                                        {item.id_cash}
                                    </div>
                                    <div
                                        className="bg-red-100 border border-red-500 text-red-500 p-2 rounded-xl text-xs font-semibold"
                                    >
                                        {days} Days
                                    </div>
                                </div>
                                <div className="p-3 flex flex-col gap-3">
                                    <div className="text-sm text-gray-400">
                                        {item.peruntukan}
                                    </div>
                                    <div className="flex gap-2 items-center text-sm text-gray-700">
                                        <CreditCard size={20}/>
                                        <div>
                                            <span className="pr-3 text-black">Norek/VA :</span>
                                            {item.norek}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center text-sm text-gray-700">
                                        <CalendarClock size={20}/>
                                        <div>
                                            <span className="pr-3 text-black">Due Date :</span>
                                            {dueDate}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center">
                                        <p className="text-black font-semibold">Rp. 
                                            <span className="text-black text-xl font-semibold ml-1">{Number(item.jumlah).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </p>
                                        <div>
                                            <input type="checkbox" className="checkbox checkbox-md checkbox-primary" />
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