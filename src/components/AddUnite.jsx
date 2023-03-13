import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button';
import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MdDelete } from 'react-icons/md';


const schema = yup.object({
    nom: yup.object().required(),
    pa: yup.number(),
    pv: yup.number(),
  }).required();

function AddUnite({unites,setUnites}) {
  return (
    <>
    
    </>
  )
}

export default AddUnite