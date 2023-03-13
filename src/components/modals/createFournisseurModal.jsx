import { Dialog } from 'primereact/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { create } from 'react-modal-promise'
import { InputMask } from 'primereact/inputmask';

const schema = yup.object({
    prenom: yup.string()
    .required(),
    nom: yup.string()
    .required(),
   tel: yup.string().required(),
  }).required();

function CreateFournisseurModal({ isOpen, onResolve, onReject }) {

  
  const defaultValues = {nom: '', prenom: '',tel: ''};
  const {control, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema),
    defaultValues
  });

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
};

const onCreate = data => {
    onResolve(data);
  };

  return (
    <>
       <Dialog header="Creer un fournisseur" visible={isOpen} onHide={() => onReject(false)} className="w-1/2">
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
    <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="prenom" className="form-label">Prenom</label>
            <Controller control={control} name="prenom" render={({field}) => (
            <input type="text" {...field} className="focus:shadow-soft-primary-outline text-sm leading-5.6 
            ease-soft block w-full appearance-none rounded-lg border border-solid border-blue-300
             bg-white bg-clip-padding px-3 py-2 font-normal text-blue-700 outline-none transition-all
              placeholder:text-blue-500 focus:border-blue-300 focus:outline-none" id="prenom" placeholder="Entrer le prenom" />
             )}/>
              {getFormErrorMessage('prenom')} 
            </div>
            <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="nom" className="form-label">Nom</label>
            <Controller control={control} name="nom" render={({field}) => (
            <input type="text" {...field} className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-blue-300 bg-white bg-clip-padding px-3 py-2 font-normal text-blue-700 outline-none transition-all placeholder:text-blue-500 focus:border-blue-300 focus:outline-none" id="nom" placeholder="Entrer le nom" autoFocus />
             )}/>
              {getFormErrorMessage('nom')} 
            </div>
            <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="tel" className="form-label">Numéro de Téléphone </label>
            <Controller control={control} name="tel" render={({field}) => (
            <InputMask id="tel" mask="(+221) 99-999-99-99" value={field.value} onChange={(e) => field.onChange(e.value)}></InputMask>
             )}/>
              {getFormErrorMessage('tel')} 
            </div>
            <button  type="submit" className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer
              bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in
               tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85
                hover:shadow-soft-xs mr-2"> CREER</button>
            <button onClick={() => onReject(false)} className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl
              from-red-700 to-red-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md
               bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"> ANNULER</button>
          </form>
  </Dialog>
    </>
  )
}

export default create(CreateFournisseurModal)