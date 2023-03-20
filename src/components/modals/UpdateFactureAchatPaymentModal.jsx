import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { InputNumber } from "primereact/inputnumber";

const schema = yup
  .object({
    avance: yup.number().required(),
    fournisseur: yup.string().required(),
  })
  .required();

function UpdateFactureAchatPaymentModal({
  isOpen,
  onResolve,
  onReject,
  factureAchat,
  fournisseur,
}) {
  const defaultValues = { avance: 0, fournisseur };
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
    const { avance } = data;
    const tv = +avance + factureAchat?.avance;
    const restant = factureAchat?.total - tv;
    onResolve({ _id: factureAchat?._id, avance: tv, restant });
  };

  return (
    <>
      <Dialog
        header="PAYMENT FACTURE FOURNISSEUR"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-full md:w-1/2"
      >
        <form className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
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
          <button
            type="submit"
            className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer
              bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in
               tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85
                hover:shadow-soft-xs mr-2"
          >
            AJOUTER PAYEMENT
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

export default create(UpdateFactureAchatPaymentModal);
