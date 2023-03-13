
import { Table } from "@mantine/core";
import { forwardRef } from "react";


export const VentePrint = forwardRef(({vente},ref) => { 
const formatDate = (v) => {
  const parts = v.split('-');
  return parts.reverse().join('-')
}
 return (
 <div ref={ref} className="w-10/12 mx-auto font-print h-screen">
         <section className="py-1 bg-white">
  <div className="max-w-5xl mx-auto bg-white">
    <article className="overflow-hidden">
      <div className="bg-[white] rounded-b-md">
        
        <div className="p-1">
          <div className="flex items-center space-x-10">
           <div className="flex flex-col items-center justify-center space-y-1 border border-black w-2/6 print:w-3/6 rounded-md p-2">
                <h2 className="font-bold text-sm text-black"> SOCK ET FRERE</h2>
                <h2 className="font-bold text-xs text-black"> COMMERCANT IMPORT-EXPORT</h2>
                <h2 className="font-bold text-xs text-black"> vente produit cosmétique et maquillage</h2>
                <h2 className="font-bold text-xs text-black"> marche boucott ziguinchor cantine 40 </h2>
                <h2 className="font-bold text-xs text-black"> TEL 77 897 24 93 / 77 766 22 80</h2>
           </div>
           <div className="p-2 w-2/6">
          <div className="flex flex-col w-full">
            <div>
              <div className="text-xs font-bold text-black">
                {vente?.date && <p>Le : {formatDate(vente.date)}</p>}
              </div>
            </div>
            <div className="text-black">
          <div className="text-xs">
                <p className="text-xs font-semibold uppercase">Client :</p>
                <p className="text-black">PRENOM : {vente?.client?.prenom}</p>
                <p className="text-black">NOM: {vente?.client?.nom}</p>
                <p className="text-black">TEL: {vente?.client?.tel}</p>
              </div>
       </div>
          </div>
        </div>
          </div>
        </div>
        <div className="w-full min-h-75-screen flex flex-col justify-between">
          <div className="my-5 mx-10 flex flex-col items-center justify-center">
       <Table withColumnBorders verticalSpacing="xs" fontSize="xs">
      <thead>
        <tr>
          <th>QTE</th>
          <th>Unite</th>
          <th>DESIGNATION</th>
          <th>PU</th>
          <th>MONTANT</th>
        </tr>
      </thead>
      <tbody>
            {vente?.ventes?.map((v,i)=> (
                   <tr key={i}>
                   <td>{v.qte}</td>
                   <td>{v.produit.unite.nom}</td>
                   <td>{v.produit.nom}</td>
                   <td>{v.produit.pv}</td>
                   <td>{v.produit.pv * v.qte}</td>
                 </tr>
                ))}
      </tbody>
    </Table>
       </div>
       <div className="flex-auto"></div>
       <div className="my-5 mx-10">
        <Table withColumnBorders>
        <thead>
        <tr>
          <th>AVANCE</th>
          <th>RESTANT</th>
          <th>NET A PAYER</th>
        </tr>
      </thead>
      <tbody>
        <tr>
           <td>{vente?.avance}</td>
            <td>{vente?.restant}</td>
            <td>{vente?.total}</td>
        </tr>
                  
      </tbody>
        </Table>
       </div>
        </div>
       
      </div>
    </article>
  </div>
</section>

 </div>
 );

});