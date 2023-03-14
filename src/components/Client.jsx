import { useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getClient } from "../services/clientservice";
// import { getVentesByClient } from "../services/venteservice";
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from "react-to-print";
import FactureVente from "./FactureVente";

function Client() {
  const { id } = useParams();
  const qk = ["get_Client", id];
  const qkf = ["get_facture_by_client", id];
  const componentRef = useRef();

  const { data: client } = useQuery(qk, () => getClient(id));
  // const { data: factures } = useQuery(qkf, () => getVentesByClient(id));

  return (
    <>
      <div className="flex flex-wrap mt-6 -mx-3">
        <div className="w-full px-3 mb-6 lg:mb-0 lg:flex-none">
          <div className="relative flex flex-col h-auto min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex items-center justify-around flex-wrap -mx-3">
                <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
                  <div className="flex items-center justify-center h-full">
                    <h5 className="font-bold text-3xl">
                      {client?.prenom} {client?.nom} {client?.tel}
                    </h5>
                    <img
                      className="relative z-20 w-32 pt-6 h-32"
                      src="/img/client.png"
                      alt="Clients"
                    />
                  </div>
                </div>
                <ReactToPrint
                  trigger={() => (
                    <button className="inline-block px-6 py-2 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs">
                      IMPRIMER
                      <AiFillPrinter className="h-6 w-6 text-white inline" />
                    </button>
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FactureVente idClient={id} />
    </>
  );
}

export default Client;
