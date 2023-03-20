import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createClient, getClients } from "../../services/clientservice";
import createClientModal from "./createClientModal";
import AddVentes from "../AddVentes";
import Select from "react-select";
import { formatISO } from "date-fns";
import { InputNumber } from "primereact/inputnumber";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { Button, LoadingOverlay } from "@mantine/core";

const schema = yup
  .object({
    date: yup.string().required(),
    client: yup.object().required(),
    ventes: yup.array().required(),
    avance: yup.number(),
  })
  .required();

function CreateventeModal({ isOpen, onResolve, onReject }) {
  const [clients, setClients] = useState([]);
  const qkc = ["get_Clients"];
  const qc = useQueryClient();
  const toast = useRef();
  useQuery(qkc, () => getClients(), {
    onSuccess: (_) => {
      const newcl = _.map((c) => ({
        value: c,
        label: `${c.prenom} - ${c.nom} - ${c.tel}`,
      }));
      setClients(newcl);
    },
  });

  const { mutate: create, isLoading } = useMutation(
    (data) => createClient(data),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Creation Client",
          detail: "Création réussie !!",
        });
        qc.invalidateQueries(qkc);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Create Client",
          detail: "Creation échouée !!",
        });
      },
    }
  );

  const defaultValues = {
    date: formatISO(new Date(), { representation: "date" }),
    client: "",
    ventes: [],
    avance: 0,
  };
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const handleCreateClient = () => {
    createClientModal().then(create);
  };

  const onCreate = (data) => {
    const { client, ventes, avance } = data;
    const avi = +avance;
    const total = ventes.reduce((acc, cur) => acc + +cur.qte * +cur.pv, 0);
    const venteDto = ventes.map((v) => ({
      qte: v.qte,
      produit: v.produit.value._id,
      pv: v.pv,
    }));
    const fd = {
      ...data,
      client: client.value._id,
      total,
      ventes: venteDto,
      avance: avi,
      restant: total - avi,
    };
    onResolve(fd);
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Dialog
        header="Creer une Facture"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-2/3"
      >
        <AddVentes ventes={getValues().ventes} setVente={setValue} />
        <form className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
          <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="date" className="form-label">
              Date De la Facture{" "}
            </label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Calendar
                  id="date"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      formatISO(e.value, { representation: "date" })
                    )
                  }
                  dateFormat="dd/mm/yy"
                  placeholder="Date De La Facture"
                />
              )}
            />
            {getFormErrorMessage("date")}
          </div>
          <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="client" className="form-label">
              Client
            </label>
            <Controller
              control={control}
              name="client"
              render={({ field }) => (
                <Select
                  {...field}
                  noOptionsMessage={({ inputValue }) => (
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      onClick={() => handleCreateClient()}
                    >
                      crerr {inputValue}
                    </Button>
                  )}
                  options={clients}
                />
              )}
            />
            {getFormErrorMessage("client")}
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="avance" className="form-label">
              Payement Client
            </label>
            <Controller
              control={control}
              name="avance"
              render={({ field }) => (
                <InputNumber
                  inputId="avance"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className="py-1 h-12"
                />
              )}
            />
            {getFormErrorMessage("avance")}
          </div>
          <div className="flex items-center justify-between mx-10 my-5">
            <div>
              <button
                type="submit"
                className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer
              bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in
               tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85
                hover:shadow-soft-xs mr-2"
              >
                {" "}
                CREER
              </button>
              <button
                onClick={() => onReject(false)}
                className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl
              from-red-700 to-red-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md
               bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
              >
                {" "}
                ANNULER
              </button>
            </div>
          </div>
        </form>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}

export default create(CreateventeModal);
