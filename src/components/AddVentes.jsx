import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdDelete } from "react-icons/md";
import { createProduit, getProduits } from "../services/produitservice";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import createProduitModal from "./modals/createProduitModal";
import { useRef } from "react";
import { Toast } from "primereact/toast";

const schema = yup
  .object({
    produit: yup.object().required(),
    qte: yup.number().required(),
    pv: yup.number().required(),
  })
  .required();

function AddVentes({ ventes = [], setVente }) {
  const [produits, setProduits] = useState([]);
  const [total, setTotal] = useState(
    ventes.reduce((acc, cur) => acc + +cur.qte * +cur.pv, 0)
  );
  const [curVentes, setCurVentes] = useState(ventes);
  const qc = useQueryClient();
  const toast = useRef();
  const defaultValues = {
    qte: 1,
    pv: 0,
    produit: "",
  };
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const qkp = ["get_Produits"];

  useQuery(qkp, () => getProduits(), {
    onSuccess: (_) => {
      const newv = _.map((c) => ({
        value: c,
        label: `${c?.unite?.nom} - ${c?.nom} - ${c?.pv}`,
      }));
      setProduits(newv);
    },
  });

  const { mutate: create } = useMutation((data) => createProduit(data), {
    onSuccess: (_) => {
      toast.current.show({
        severity: "success",
        summary: "Creation Produit",
        detail: "Création réussie !!",
      });
      qc.invalidateQueries(qkp);
    },
    onError: (_) => {
      toast.current.show({
        severity: "error",
        summary: "Create Produit",
        detail: "Creation échouée !!",
      });
    },
  });
  const handleCreateProduct = () => {
    createProduitModal().then(create);
  };
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <button
          type="button"
          onClick={() => deleteVente(rowData)}
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-red-700 to-red-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
        >
          <MdDelete className="text-white inline" />
        </button>
      </div>
    );
  };

  const getTotal = (ventes) =>
    ventes.reduce((acc, cur) => acc + +cur.qte * +cur.pv, 0);

  const deleteVente = (row) => {
    const rest = curVentes.filter(
      (v) => v.produit.value._id !== row.produit.value._id
    );
    setCurVentes(rest);
    setTotal(getTotal([...rest]));
    setFocus("produit");
  };

  const addProduct = (data) => {
    const nwd = { ...data };
    setCurVentes((cur) => [...cur, nwd]);
    setVente("ventes", [...curVentes, nwd]);
    setTotal(getTotal([...curVentes, nwd]));
    setFocus("produit");
  };

  const totalTemplate = (rowData) => {
    const { qte } = rowData;
    return +qte * +rowData.pv;
  };

  return (
    <>
      <form
        className="flex flex-col space-y-1 md: md:flex-row md:space-x-1 md:space-y-0"
        onSubmit={handleSubmit(addProduct)}
        method="POST"
      >
        <div className="flex flex-col space-y-2 w-full">
          <label htmlFor="produit" className="form-label">
            Produit
          </label>
          <Controller
            control={control}
            name="produit"
            render={({ field }) => (
              <Select
                {...field}
                options={produits}
                noOptionsMessage={({ inputValue }) => (
                  <Button onClick={handleCreateProduct}>
                    crerr {inputValue}
                  </Button>
                )}
                autoFocus
              />
            )}
          />
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label htmlFor="qte" className="form-label">
            Quantité
          </label>
          <Controller
            control={control}
            name="qte"
            render={({ field }) => (
              <InputNumber
                inputId="qte"
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                className="py-1 h-12"
              />
            )}
          />
          {getFormErrorMessage("qte")}
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label htmlFor="pv" className="form-label">
            pv
          </label>
          <Controller
            control={control}
            name="pv"
            render={({ field }) => (
              <InputNumber
                inputId="pv"
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                className="py-1 h-12"
              />
            )}
          />
          {getFormErrorMessage("pv")}
        </div>
        <div className="self-center pt-5">
          <Button
            type="submit"
            icon="pi pi-plus"
            className="bg-sky-500"
            style={{ padding: "6px 0" }}
          />
        </div>
      </form>
      <div className="my-5 flex items-center justify-end bg-slate-100 px-10 py-2">
        <h1 className="text-2xl font-semibold"> Total : {total}</h1>
      </div>
      <div className="my-2">
        <DataTable
          value={curVentes}
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          size="small"
          dataKey="produit.value._id"
          rowHover
          responsiveLayout="scroll"
          emptyMessage="Aucun Produit trouvé"
        >
          <Column
            field="produit.value.nom"
            header="Produit"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="qte"
            header="Quantité"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            header="Total"
            sortable
            body={totalTemplate}
            style={{ minWidth: "14rem" }}
          />
          <Column
            headerStyle={{ width: "4rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable>
      </div>
      <Toast ref={toast} />
    </>
  );
}

export default AddVentes;
