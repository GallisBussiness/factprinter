import { forwardRef } from "react";

export const ClientPrint = forwardRef(({factures,client},ref) => {

    const calculDue = (arr) => arr.reduce((acc,cur) => acc + cur.total ,0);

    const calculRest = (arr) => arr.reduce((acc,cur) => acc + cur.restant ,0);
    
    return (
        <div ref={ref} className="w-full font-print">
                <table className="min-w-full border border-separate border-spacing-0">
              <thead>
                <tr> 
                <th scope="col" className="text-center text-sm font-bold sm:table-cell border border-slate-600">
                    Date
                  </th>
                  <th scope="col" className="text-xs text-center font-bold sm:pl-6 md:pl-0 border border-slate-600">
                    Prénom client
                  </th>
                  <th scope="col" className="text-xs text-center  font-bold sm:pl-6 md:pl-0 border border-slate-600">
                    Nom Client
                  </th>
                  <th scope="col" className="text-center text-sm font-bold  sm:pr-6 md:pr-2 border border-slate-600">
                    Payement
                  </th>
                  <th scope="col" className="text-center text-sm font-bold  sm:pr-6 md:pr-2 border border-slate-600">
                    Restant
                  </th>
                </tr>
              </thead>
              <tbody>
                {factures.map((v,i)=> (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="text-sm text-center sm:table-cell border-l border-r border-slate-600 uppercase underline">
                    {v.date}
                  </td>
                  <td className=" text-sm text-center sm:table-cell border-l border-r border-slate-600 uppercase">
                    {client?.prenom}
                  </td>
                  <td className=" text-xs text-center md:pl-0 border-l border-r border-slate-600 uppercase">
                    <div className="font-bold text-slate-700">{client?.nom}</div>
                  </td>
                  <td className="text-xs  text-center border-l border-r border-slate-600">
                    {v.avance}
                  </td>
                  <td className="text-xs  text-center border-l border-r border-slate-600">
                    {v.restant}
                  </td>
                </tr> 
                ))}
               
              </tbody>
              <tfoot>
              
                <tr>
                  <th scope="row" className="pt-2 pl-6 pr-3 text-sm font-bold text-right text-slate-700 sm:table-cell md:pl-0 border border-slate-600 underline">
                    TOTAL DUE
                  </th>
                  <th scope="row"  className="pt-2 pl-3 pr-4 text-lg font-bold text-center text-slate-700 sm:pr-6 md:pr-2  border border-slate-600 italic">
                    {calculDue(factures)} 
                  </th>
                  <th scope="row" className="pt-2 pl-6 pr-3 text-sm font-bold text-right text-slate-700 sm:table-cell md:pl-0 border border-slate-600 underline">
                    TOTAL RESTANT
                  </th>
                  <th scope="row" colSpan={2} className="pt-2 pl-3 pr-4 text-lg font-bold text-center text-slate-700 sm:pr-6 md:pr-2  border border-slate-600 italic">
                    {calculRest(factures)} 
                  </th>
                </tr>
              </tfoot>
            </table>
        </div>
    );
 });