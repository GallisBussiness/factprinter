import { forwardRef } from "react";

export const RaportPrint = forwardRef(({Ventes},ref) => {
  const calculTotal = (arr) => arr.reduce((acc,cur) => acc + cur.total,0);
  const calculBenefice = (arr) =>  {
    const tv = arr?.reduce((acc,cur) => acc + cur.ventes.reduce((ac,cu) => ac + ((cu.produit.pv * cu.qte) - (cu.produit.pa * cu.qte)),0),0);
    return tv;
  }
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
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody>
                {Ventes?.map((v,i)=> (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="text-sm text-center sm:table-cell border-l border-r border-slate-600 uppercase underline">
                    {v.date}
                  </td>
                  <td className=" text-sm text-center sm:table-cell border-l border-r border-slate-600 uppercase underline">
                    {v.client.prenom}
                  </td>
                  <td className=" text-xs text-center md:pl-0 border-l border-r border-slate-600 uppercase">
                    <div className="font-bold text-slate-700">{v.client.nom}</div>
                  </td>
                  <td className="text-xs  text-center border-l border-r border-slate-600">
                    {v.total}
                  </td>
                </tr> 
                ))}
               
              </tbody>
              <tfoot>
              
                <tr>
                  <th scope="row" className="pt-2 pl-6 pr-3 text-sm font-bold text-right text-slate-700 sm:table-cell md:pl-0 border border-slate-600 underline">
                    BENEFICE 
                  </th>
                  <th scope="row"  className="pt-2 pl-3 pr-4 text-lg font-bold text-center text-slate-700 sm:pr-6 md:pr-2  border border-slate-600 italic">
                    {calculBenefice(Ventes)} 
                  </th>
                  <th scope="row" className="pt-2 pl-6 pr-3 text-sm font-bold text-right text-slate-700 sm:table-cell md:pl-0 border border-slate-600 underline">
                    TOTAL VENDU
                  </th>
                  <th scope="row" className="pt-2 pl-3 pr-4 text-lg font-bold text-center text-slate-700 sm:pr-6 md:pr-2  border border-slate-600 italic">
                    {calculTotal(Ventes)} 
                  </th>
                </tr>
              </tfoot>
            </table>
        </div>
    );
 });