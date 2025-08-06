import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import Alert from "../Components/alert";
import Loading from "../Components/loading";
import { ChangePinModal } from "../Components/modalChangePin";
import { NotFound } from "../Components/notFound";
import { useAlert } from "../Contexts/alertContext";
import { CashFilesRes, CashRequestReq, CashRequestRes } from "../Interfaces/main";
import { useFilePostMutation, useMainPostMutation } from "../Services/api";
import { CircleDollarSign, FileText, SquareAsterisk } from "lucide-react";
import { ModalDoc } from "../Components/modalDoc";
import { ModalPoKontrabon } from "../Components/modalPoKontrabon";
import { ModalSaldo } from "../Components/modalSaldo";

const Home: FC = () => {

    const [selectedItem, setSelectedItem] = useState({
        selectedTipe: '0',
        selectedAll: '',
        selectedCheckbox: []
    });
    const [selectedCheckbox, setSelectedCheckbox] = useState<number[]>([]);
    const [main, {data, isLoading, error}] = useMainPostMutation();
    const { showAlert } = useAlert();
    const report = data?.data as CashRequestRes[] | undefined;
    const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false);
    const [isModalDocOpen, setIsModalDocOpen] = useState(false);
    const [isModalPoKontrabon, setisModalPoKontrabon] = useState(false);
    const [isModalSaldoOpen, setIsModalSaldoOpen] = useState(false);
    const [selectedIdCash, setSelectedIdCash] = useState(0);
    const [selectedReferensi, setSelectedReferensi] = useState("");
    const [fetchFile] = useFilePostMutation();
    const [docData, setDocData] = useState<CashFilesRes[]>([]);
    //console.log(docData);

    const openChangePinModal = () => setIsChangePinModalOpen(true);
    const closeChangePinModal = () => setIsChangePinModalOpen(false);

    const openModalDoc = () => setIsModalDocOpen(true);
    const closeModalDoc = () => setIsModalDocOpen(false);

    const openModalPoKontrabon = () => setisModalPoKontrabon(true);
    const closeModalPoKontrabon = () => setisModalPoKontrabon(false);

    const openModalSaldo = () => setIsModalSaldoOpen(true);
    const closeModalSaldo = () => setIsModalSaldoOpen(false);

    // console.log('selected checkbox all:', selectedItem.selectedAll);
    // console.log('selected checkbox item:', selectedCheckbox);

    useEffect(() => {
        const fetchAllDocs = async () => {
            if (report && report.length > 0) {
                const promises = report.map(async (item) => {
                    try {
                        const res = await fetchFile({ id: item.id_cash }).unwrap();
                        //console.log("Fetched doc for:", item.id_cash, res);
                        return res.map(file => ({ ...file, id_cash: item.id_cash }));
                    } catch (error) {
                        //console.warn("Failed to fetch for id_cash:", item.id_cash, error);
                        return [];
                    }
                });

                const allDocsArray = await Promise.all(promises);
                const flatDocs = allDocsArray.flat();

                setDocData(flatDocs);
            }
        };

        fetchAllDocs();
    }, [report]);


    useEffect(() => {
        main(selectedItem);
    }, [main, selectedItem]);

    useEffect(() => {
        if (error) {
            const message = (error as any).data.message;
            showAlert(message);
        }
    }, [error, showAlert]);
    
    const handleCheckboxChange = (id: number, status: number) => {
        setSelectedCheckbox(prevCheckboxes => {
            if(status === 3) {
                return prevCheckboxes;
            }

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
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div>
                                <select 
                                    className="border border-gray-400 text-xs px-2 py-1 rounded-lg"
                                    value={selectedItem.selectedTipe}
                                    onChange={(e) => 
                                        setSelectedItem(prev => ({
                                            ...prev, 
                                            selectedTipe: e.target.value
                                        }))
                                    }
                                >
                                    <option value="0">Dana</option>
                                    <option value="1">Acc PO</option>
                                </select>
                            </div>
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
                        <div>
                            {/*<button 
                                className="py-2 px-4 bg-blue-500 text-white rounded-xl 
                                text-sm font-semibold hover:bg-blue-600"
                                onClick={openChangePinModal}>
                                Change PIN
                            </button>*/}
                        </div>
                    </div>
                </div>
                <div className="p-5 flex flex-col gap-5 mb-[110px]">
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
                            
                            const kode = item.referensi;
                            const parts = kode.split('/');
                            const jenis = parts[1];

                            let link = "";
                            if (jenis === 'BS') {
                                link = "belanja_po";
                            } else if (jenis === 'KB') {
                                link = "kontra_bon_cetak";
                            } else if (jenis === 'PO') {
                                link = "po_pdf";
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
                                                onChange={() => handleCheckboxChange(item.id_cash, item.status)}
                                                checked={item.status === 3 || selectedCheckbox.includes(item.id_cash)} 
                                                readOnly={item.status === 3}
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-7">
                                        <p className="text-sm text-gray-500">{item.divisi}</p>
                                    </div> 
                                    <div className="mt-2 flex flex-col gap-3">
                                        <div className={`bg-gray-100 text-gray-700 rounded-xl p-3`}>
                                            <div className={`text-sm text-gray-700`}>
                                                {item.peruntukan}
                                            </div>
                                        </div>
                                        {item.divisi === 'Purchasing' ?
                                            <div className="flex gap-2">
                                                {jenis === 'KB' ? (
                                                    <div
                                                        className="border text-blue-500 border-blue-500 btn btn-sm hover:bg-blue-500 hover:text-white"
                                                        onClick={() => {
                                                            setSelectedReferensi(item.referensi)
                                                            openModalPoKontrabon();
                                                        }}
                                                    >
                                                        <FileText size={18}/>
                                                        Detail
                                                    </div>
                                                ) : (
                                                    <>
                                                        <a 
                                                            href={`https://app.sknmedical.co.id/skn/purchasing/${link}.php?no=${item.referensi}`}
                                                            className="border text-blue-500 border-blue-500 btn btn-sm hover:bg-blue-500 hover:text-white"
                                                        >
                                                            <FileText size={18}/>
                                                            Detail
                                                        </a>
                                                        {docData.some(doc => doc.id_cash === item.id_cash) && (
                                                            <div 
                                                                className="border text-blue-500 border-blue-500 btn btn-sm hover:bg-blue-500 hover:text-white"
                                                                onClick={() => {
                                                                    setSelectedIdCash(item.id_cash);
                                                                    openModalDoc();
                                                                }}
                                                            >
                                                                <FileText size={18}/>
                                                                Doc
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>    
                                        : (
                                            <div className="flex gap-2">
                                                {docData.some(doc => doc.id_cash === item.id_cash) && (
                                                    <div 
                                                        className="border text-blue-500 border-blue-500 btn btn-sm hover:bg-blue-500 hover:text-white"
                                                        onClick={() => {
                                                            setSelectedIdCash(item.id_cash);
                                                            openModalDoc();
                                                        }}
                                                    >
                                                        <FileText size={18}/>
                                                        Doc
                                                    </div>
                                                )}
                                            </div>    
                                        )}
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
                        <div className="flex justify-between">
                            <button 
                                className="btn btn-sm text-xs border-gray-400 mb-2"
                                onClick={() => openModalSaldo()}
                            >
                                <CircleDollarSign size={16}/> Lihat Saldo
                            </button>
                            <button 
                                className="btn btn-sm text-xs border-gray-400 mb-2"
                                onClick={() => openChangePinModal()}
                            >
                                <SquareAsterisk size={16}/> Change PIN
                            </button>    
                        </div>
                        <button
                            className="w-full bg-blue-500 p-3 text-white rounded-xl font-semibold hover:bg-blue-600"
                            onClick={handleClickSave}
                        >
                            Save
                        </button>
                    </div>
                )}
                <ChangePinModal isOpen={isChangePinModalOpen} onClose={closeChangePinModal} />
                <ModalDoc 
                    isOpen={isModalDocOpen} 
                    onClose={closeModalDoc} 
                    idCash={selectedIdCash}
                />
                <ModalPoKontrabon 
                    isOpen={isModalPoKontrabon} 
                    onClose={closeModalPoKontrabon} 
                    noKontrabon={selectedReferensi} 
                />
                <ModalSaldo isOpen={isModalSaldoOpen} onClose={closeModalSaldo} />
            </div>
        )
    )
}

export default Home;