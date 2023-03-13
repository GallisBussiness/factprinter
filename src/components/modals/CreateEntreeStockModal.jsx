import { Dialog } from 'primereact/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { create } from 'react-modal-promise'


const schema = yup.object({
    nom: yup.string()
    .required(),
  }).required();



function CreateEntreeStockModal({ isOpen, onResolve, onReject }) {

    const defaultValues = {nom: ''};
    const {control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      defaultValues
    });


  const onCreate = data => {
      onResolve(data);
    };

  return (
    <>
    <Dialog header="Entree de Stock" visible={isOpen} onHide={() => onReject(false)} className="w-1/2">
        
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">

          </form>
  </Dialog>
    </>
  )
}

export default create(CreateEntreeStockModal)