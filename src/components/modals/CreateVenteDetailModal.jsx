import { Dialog } from 'primereact/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { create } from 'react-modal-promise'
import { Calendar } from 'primereact/calendar';
import { formatISO } from 'date-fns';
import { InputNumber } from 'primereact/inputnumber';

const schema = yup.object({
    date: yup.string()
    .required(),
    montant: yup.number().required()
  }).required();



function CreateVenteDetailModal({ isOpen, onResolve, onReject }) {

  const defaultValues = {date: formatISO(new Date(),{ representation: 'date' }), montant: 0};
    const {control, handleSubmit,formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      defaultValues
    });

    const getFormErrorMessage = (name) => {
      return errors[name] && <small className="p-error">{errors[name].message}</small>
  };

  const onCreate = data => {
       const {montant} = data;
       const avi = +montant;
       const fd = {...data,montant: avi}
      onResolve(fd);
    };


  return (
    <>
          <Dialog header="Vendre Détail" visible={isOpen} onHide={() => onReject(false)} className="w-2/3">
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
    <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="date" className="form-label">Date De la Vente </label>
            <Controller control={control} name="date" render={({field}) => (
            <Calendar id="date" value={field.value} onChange={(e) => field.onChange(formatISO(e.value,{ representation: 'date' }))} dateFormat="dd/mm/yy"  placeholder="Date De La Vente"/>
             )}/>
              {getFormErrorMessage('date')} 
            </div>
            <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="montant" className="form-label">Montant de la Vente</label>
              <Controller control={control} name="montant" render={({field}) => (
                  <InputNumber inputId="montant" value={field.value} onValueChange={(e) => field.onChange(e.value)} className="py-1 h-12"  />
              )} />
              {getFormErrorMessage('montant')} 
            </div>
            <div className="flex items-center justify-between mx-10 my-5">
                <div>
                      <button  type="submit" className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer
              bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in
               tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85
                hover:shadow-soft-xs mr-2"> CREER</button>
            <button onClick={() => onReject(false)} className="inline-block px-6 py-3 font-bold text-center
             text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl
              from-red-700 to-red-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md
               bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"> ANNULER</button>
                </div>
            </div>
        
          </form>
  </Dialog>
    </>
  )
}

export default create(CreateVenteDetailModal)