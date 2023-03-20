import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { InputNumber } from "primereact/inputnumber";
import Select from "react-select";
import { useQuery } from "react-query";
import { getUnites } from "../../services/uniteservice";
import { useState } from "react";

const schema = yup
  .object({
    nom: yup.string().required(),
    unite: yup.object().required(),
    pv: yup.string().required(),
  })
  .required();

function UpdateProduitModal({ isOpen, onResolve, onReject, produit }) {
  const [Unites, setUnites] = useState([]);
  const qkc = ["get_Unites"];

  useQuery(qkc, () => getUnites(), {
    onSuccess: (_) => {
      const newcl = _.map((c) => ({ value: c, label: c.nom }));
      setUnites(newcl);
    },
  });

  const defaultValues = { nom: produit?.nom, pv: produit?.pv };
  const {
    control,
    handleSubmit,
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

  const onCreate = (data) => {
    const { unite, pv } = data;
    onResolve({ _id: produit?._id, ...data, unite: unite.value._id, pv: +pv });
  };

  return (
    <>
      <Dialog
        header="Mettre à jour un produit"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-full md:w-1/2"
      >
        <form className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
          <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="nom" className="form-label">
              Nom
            </label>
            <Controller
              control={control}
              name="nom"
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-blue-300 bg-white bg-clip-padding px-3 py-2 font-normal text-blue-700 outline-none transition-all placeholder:text-blue-500 focus:border-blue-300 focus:outline-none"
                  id="nom"
                  placeholder="Entrer le nom"
                  autoFocus
                />
              )}
            />
            {getFormErrorMessage("nom")}
          </div>
          <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="unite" className="form-label">
              Unite
            </label>
            <Controller
              control={control}
              name="unite"
              render={({ field }) => <Select {...field} options={Unites} />}
            />
            {getFormErrorMessage("unite")}
          </div>
          <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="pv" className="form-label">
              Prix de vente
            </label>
            <Controller
              control={control}
              name="pv"
              render={({ field }) => (
                <InputNumber
                  inputId="pv"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                />
              )}
            />
            {getFormErrorMessage("pv")}
          </div>
          <button
            type="submit"
            className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer
              bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in
               tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85
                hover:shadow-soft-xs mr-2"
          >
            {" "}
            MODIFIER
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
        </form>
      </Dialog>
    </>
  );
}

export default create(UpdateProduitModal);
