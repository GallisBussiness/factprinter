import { Dialog } from 'primereact/dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { create } from 'react-modal-promise'
import Select from 'react-select'
import { useQuery } from 'react-query';
import { getUnites } from '../../services/uniteservice';
import { InputNumber } from 'primereact/inputnumber';
import { useState } from 'react';

const schema = yup.object({
    nom: yup.string()
    .required(),
    unite: yup.object()
    .required(),
    pa: yup.number(),
    pv: yup.number().required()
  }).required();

function AddProduit() {
  return (
    <>
    <form  className="mb-3" onSubmit={handleSubmit(onCreate)} method="POST">
    <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="nom" className="form-label">Nom du produit</label>
            <Controller control={control} name="nom" render={({field}) => (
            <input type="text" {...field} className="focus:shadow-soft-primary-outline text-sm leading-5.6 
            ease-soft block w-full appearance-none rounded-lg border border-solid border-blue-300
             bg-white bg-clip-padding px-3 py-2 font-normal text-blue-700 outline-none transition-all
              placeholder:text-blue-500 focus:border-blue-300 focus:outline-none" id="prenom" placeholder="Entrer le nom" />
             )}/>
              {getFormErrorMessage('nom')} 
            </div>
            <div className="mb-3 flex flex-col justify-center">
            <label htmlFor="unite" className="form-label">Unite</label>
            <Controller control={control} name="unite" render={({field}) => (
                    <Select
                    {...field}
                    options={Unites}
                  />
            )} />
              {getFormErrorMessage('unite')} 
            </div>
            <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="pa" className="form-label">Prix d'achat</label>
            <Controller control={control} name="pa" render={({field}) => (
            <InputNumber inputId="pa" value={field.value} onValueChange={(e) => field.onChange(e.value)} />
             )}/>
              {getFormErrorMessage('pa')} 
            </div>
            
            <div className="mb-3 flex flex-col space-y-2">
            <label htmlFor="pv" className="form-label">Prix de vente</label>
            <Controller control={control} name="pv" render={({field}) => (
            <InputNumber inputId="pv" value={field.value} onValueChange={(e) => field.onChange(e.value)} />
             )}/>
              {getFormErrorMessage('pv')} 
            </div>
           
          </form>
    </>
  )
}

export default AddProduit