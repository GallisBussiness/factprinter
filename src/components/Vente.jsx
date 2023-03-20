import { useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getVente } from "../services/venteservice";
import { VentePrint } from "./VentePrint";
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from "react-to-print";
import { LoadingOverlay } from "@mantine/core";

function Vente() {
  const { id } = useParams();
  const qk = ["get_Vente", id];
  const componentRef = useRef();

  const { data: vente, isLoading } = useQuery(qk, () => getVente(id));

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <div className="flex items-center justify-center my-20">
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

      {vente && <VentePrint vente={vente} ref={componentRef} />}
    </>
  );
}

export default Vente;
