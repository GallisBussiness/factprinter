import { formatISO} from "date-fns"
import { Calendar } from "primereact/calendar"
import { useRef, useState } from "react"
import { useMutation } from "react-query"
import { getVentesByDate } from "../services/venteservice"
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AiFillPrinter } from "react-icons/ai"
import ReactToPrint from 'react-to-print';
import {RaportPrint} from './ReportPrint'

function Stats() {
    const [curDate,setCurDate] = useState(formatISO(new Date(),{ representation: 'date' }))
    const componentRef = useRef();
    const {data: Ventes,mutate: getVentes,isLoading } = useMutation((data) => getVentesByDate(data));

    const getVentesForDate = (v) => {
    const f = formatISO(v,{ representation: 'date' })
    setCurDate(f);
    getVentes({date: f});
    }
  return (
    <>
      <div className="flex flex-wrap mt-3 -mx-3">
  <div className="w-full px-3 mb-6 lg:mb-0 lg:flex-none">
    <div className="relative flex flex-col h-auto min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="flex-auto p-4">
        <div className="flex items-center justify-center flex-wrap -mx-3">
          <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
            <div className="flex items-center justify-center h-full">
              <h5 className="font-bold text-3xl">Rapports Ventes</h5>
              <img className="relative z-20 w-32 pt-6 h-32" src="/img/repports.png" alt="Repports" />
            </div>
          </div>
          <ReactToPrint
        trigger={() => <button className="inline-block px-6 py-2 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" >IMPRIMER<AiFillPrinter className="h-6 w-6 text-white inline"/></button>}
        content={() => componentRef.current}
      />
        </div>
      </div>
    </div>
  </div>
</div>
        <div>
            <div className="flex flex-col md:flex-row h-screen">
                <div className="w-full md:w-4/12 border-l-slate-900 mx-10">
                <Calendar value={curDate} onChange={(e) => getVentesForDate(e.value)} inline  className="w-full"/>
                </div>
               <div className="w-full md:w-8/12">
               <div className="p-1">
          <div className="flex flex-col items-center justify-center mx-0 mt-8">
            {Ventes?.length > 0 ? <RaportPrint ref={componentRef}  Ventes={Ventes}/> : <div>
               <img src="/img/empty.png" className="w-96 h-96 object-cover" alt="empty" />
              </div>}
          </div>
        </div>
               </div>
            </div>

        </div>
        <Dialog visible={isLoading} style={{ width: '20vw', opacity: 0.8 }} modal showHeader={false}>
          <div className="flex items-center justify-center">
            <ProgressSpinner/>
          </div>
        </Dialog>
    </>
  )
}

export default Stats