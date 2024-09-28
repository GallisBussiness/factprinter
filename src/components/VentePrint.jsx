import { Divider, Table, Text } from "@mantine/core";
import { forwardRef } from "react";

const Nformat = new Intl.NumberFormat('fr-FR');

export const VentePrint = forwardRef(({ vente }, ref) => {
  const formatDate = (v) => {
    const parts = v.split("-");
    return parts.reverse().join("-");
  };
  return (
    <div
      ref={ref}
      className="w-10/12 mx-auto font-print my-5"
      style={{ height: "842px" }}
    >
      <section className="py-1 bg-white h-full">
        <div className="max-w-5xl mx-auto h-full">
          <article className="h-full">
            <div className=" h-full">
              <div className="flex flex-col items-center justify-center space-y-1 border border-black print:w-full rounded-2xl p-2">
                <Text fw="bold" size={40} color="blue">
                  NDIAYE ABDOURAHMANE
                </Text>
                <Text fw="revert" size={20}>
                  Wakeur Serigne Darou Assane NDIAYE
                </Text>
                <Text fw="revert" size={18}>
                  Commerçant Vente de Produits Cosmétiques, Habillements, Radio
                  et Divers
                </Text>
                <Text size={14}>
                  Marché Boucotte - Ziguinchor
                </Text>
                <Text fw='bold'  size={14}>
                  Tél : 77 572 73 70 - 77 917 43 30
                  84
                </Text>
              </div>

              <div className="flex items-center justify-between my-5 mx-10">
                {vente?.date && (
                  <Text size={15} fw="bold">
                    {" "}
                    Ziguinchor, le : {formatDate(vente?.date)}
                  </Text>
                )}
                <div className="flex space-x-1">
                  <Text size={25} fw="bold">
                    FACTURE{" "}
                  </Text>
                  <Text size={25} fw="bold" color="red">
                    {" "}
                    N° {vente.numero}
                  </Text>
                </div>
              </div>
              <div className="flex items-center justify-between mx-20">
                <Text size={15} fw="bold">
                  {vente?.client?.prenom} {vente?.client?.nom},
                </Text>
                <Text size={15} fw="bold">
                  Tel: {vente?.client?.tel},
                </Text>
                <Text size={15}>
                  Doit :
                </Text>
              </div>
              <div className="w-full flex flex-col justify-between">
                <div className="my-5 mx-10 flex flex-col h-full">
                  <Table
                    withColumnBorders
                    verticalSpacing="xs"
                    fontSize="xs"
                    className="border border-solid border-black"
                  >
                    <thead className="font-bold border border-solid border-black">
                      <tr>
                        <th>QTE</th>
                        <th>Unite</th>
                        <th>DESIGNATION</th>
                        <th>PU</th>
                        <th>MONTANT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vente?.ventes?.map((v, i) => (
                        <tr key={i}>
                          <td className="font-bold border border-solid border-black text-center w-12">
                            {v.qte}
                          </td>
                          <td className="font-bold border border-solid border-black">
                            {v.produit.unite.nom}
                          </td>
                          <td className="font-bold border border-solid border-black">
                            {v.produit.nom}
                          </td>
                          <td className="font-bold border border-solid border-black">
                            {Nformat.format(v.pv)}
                          </td>
                          <td className="font-bold border border-solid border-black">
                            {Nformat.format(v.pv * v.qte)} FCFA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="mx-10 text-end">
                  <Text fw="bold" size={14}>
                    MONTANT TOTAL
                  </Text>
                  <Divider />
                  <Text fw="bold" size={18}>
                    {Nformat.format(vente?.total)} FCFA
                  </Text>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
});
