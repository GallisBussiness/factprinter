import { Dialog } from "primereact/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { create } from "react-modal-promise";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "@mantine/core";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createProduit, getProduits } from "../../services/produitservice";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";

const schema = yup
  .object({
    produit: yup.object().required(),
    qte: yup.number().required(),
  })
  .required();

function CreateSortieStockModal({ isOpen, onResolve, onReject }) {
  const [produits, setProduits] = useState([]);
  const qc = useQueryClient();
  const toast = useRef();
  const defaultValues = {
    qte: 1,
    produit: "",
  };
  const {
    control,
    handleSubmit,
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
        label: `${c?.unite?.nom} - ${c?.nom} `,
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

  const onCreate = (data) => {
    const { produit } = data;
    onResolve({ ...data, produit: produit.value._id });
  };

  return (
    <>
      <Dialog
        header="Sortie de Stock"
        visible={isOpen}
        onHide={() => onReject(false)}
        className="w-1/2"
      >
        <form className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
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
          <div className="pt-5">
            <Button type="submit" className="bg-sky-500 hover:bg-sky-600">
              ENREGISTRER
            </Button>
          </div>
        </form>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}

export default create(CreateSortieStockModal);
