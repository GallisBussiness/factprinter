import { FilterMatchMode } from 'primereact/api'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import ModalContainer from 'react-modal-promise'
import { InputText } from 'primereact/inputtext'
import { BsFillPenFill } from 'react-icons/bs'
import './datatable.css'
import ConfirmDelete from './modals/ConfirmDelete'
import { MdDelete } from 'react-icons/md'
import { createVenteDetail, getVenteDetails, removeVenteDetail, updateVenteDetail } from '../services/vente-detail'
import CreateVenteDetailModal from './modals/CreateVenteDetailModal'
import UpdateVenteDetailModal from './modals/UpdateVenteDetailModal'
import { GiMoneyStack } from 'react-icons/gi'
import UpdateVenteDetailPaymentModal from './modals/UpdateVenteDetailPaymentModal'

function VenteDetail() {
    
    const [selectedVenteDetails, setSelectedVenteDetails] = useState(null);
    const qc = useQueryClient()
    const toast = useRef();
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
  
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
    }
  
    const qk = ['get_VenteDetails']
  
    const {data: Ventes, isLoading } = useQuery(qk, () => getVenteDetails());
  
    const {mutate: create} = useMutation((data) => createVenteDetail(data), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Creation Vente Détail', detail: 'Création réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Create Vente Détail', detail: 'Creation échouée !!'});
        }
    })
  
    const {mutate: update} = useMutation((data) => updateVenteDetail(data._id, data.data), {
        onSuccess: (_) => {
            toast.current.show({severity: 'success', summary: 'Mise à jour VenteDetail', detail: 'Mis à jour réussie !!'});
            qc.invalidateQueries(qk);
            
           },
           onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Mis à jour VenteDetail', detail: 'Mis à jour échouée !!'});
           }
    })
  
    const {mutate: deleteV} = useMutation((id) => removeVenteDetail(id), {
      onSuccess: (_) => {
      toast.current.show({severity: 'success', summary: 'Suppréssion VenteDetail', detail: 'Suppréssion réussie !!'});
       qc.invalidateQueries(qk);
      },
      onError: (_) => {
          toast.current.show({severity: 'error', summary: 'Suppréssion VenteDetail', detail: 'Suppréssion échouée !!'});
      }
  })
  
    const leftToolbarTemplate = () => {
        return (
            <div className="flex items-center justify-center space-x-2">
                <button className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" onClick={() => handleCreateVente()} >Nouveau <AiOutlinePlus className="h-6 w-6 text-white inline"/></button>
                <button className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-red-700 to-red-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" onClick={() => handleDelete()} disabled={!selectedVenteDetails || !selectedVenteDetails.length}>Supprimer <MdDelete className="h-6 w-6 text-white inline"/></button>
            </div>
        )
    }
  
  
    const handleUpdateVente = (d) => {
        UpdateVenteDetailModal({vente: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }
  
    const handleCreateVente = () => {
        CreateVenteDetailModal().then(create);
    }
  
    const handleDelete = async () => {
      const resconfirm = await ConfirmDelete();
      if(resconfirm) {
          for(let i = 0; i < selectedVenteDetails?.length; i++) {
           deleteV(selectedVenteDetails[i]?._id);
        }
      }
    }

    const handlePayment = (d) => {
      UpdateVenteDetailPaymentModal({vente: d}).then((d => {
        const {_id,...rest} = d;
        update({_id,data: rest});
    }));
    }
  
  
    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <h5 className="m-0">Liste des VenteDetails</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }
  
    
    const formatDate = (v) => {
      const parts = v.split('-');
      return parts.reverse().join('-')
    }
  
  const dateBodyTemplate = (rowData) => {
      return formatDate(rowData.date);
  }

  
    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
                <button type="button" onClick={() => handlePayment(rowData)} className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-green-700 to-green-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" ><GiMoneyStack className="text-white inline"/></button>
        <button type="button" onClick={() => handleUpdateVente(rowData)} className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-amber-700 to-amber-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" ><BsFillPenFill className="text-white inline"/></button>
        </div>;
        
    }
  
    const header = renderHeader();
  

  return (
    <>
     <div className="flex flex-wrap mt-6 -mx-3">
    <div className="w-full px-3 mb-6 lg:mb-0 lg:flex-none">
      <div className="relative flex flex-col h-40 min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap -mx-3">
            <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
              <div className="flex items-center justify-center h-full">
                <h5 className="font-bold text-3xl">Gestion des VenteDetails</h5>
                <img className="relative z-20 w-32 pt-6 h-32" src="/img/facture.png" alt="VenteDetail" />
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="datatable-doc mt-4 w-4/5 mx-auto">
              <div className="card">
              <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                  <DataTable value={Ventes} paginator className="p-datatable-customers" header={header} rows={10}
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                      dataKey="_id" rowHover selection={selectedVenteDetails} onSelectionChange={e => setSelectedVenteDetails(e.value)}
                      filters={filters} filterDisplay="menu" loading={isLoading} responsiveLayout="scroll"
                      globalFilterFields={['date', 'montant']} emptyMessage="Aucune VenteDetail trouvée"
                      currentPageReportTemplate="Voir {first} de {last} à {totalRecords} VenteDetails" size="small">
                      <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                      <Column field="date" header="Date" body={dateBodyTemplate} sortable style={{ minWidth: '14rem' }} />
                      <Column field="montant" header="Montant" sortable style={{ minWidth: '14rem' }} />
                      <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                  </DataTable>
              </div>
          </div>
          <Toast ref={toast} />
      <ModalContainer />
    </>
   
  );
}

export default VenteDetail