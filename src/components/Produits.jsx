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
import createProduitModal from './modals/createProduitModal'
import updateProduitModal from './modals/updateProduitModal'
import './datatable.css'
import { createProduit, getProduits, updateProduit } from '../services/produitservice'

function Produits({auth}) {

    const [selectedProduits, setSelectedProduits] = useState(null);
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

    const qk = ['get_Produits']

    const {data: Produits, isLoading } = useQuery(qk, () => getProduits());

    const {mutate: create} = useMutation((data) => createProduit(data), {
        onSuccess: (_) => {
        toast.current.show({severity: 'success', summary: 'Creation Produit', detail: 'Création réussie !!'});
         qc.invalidateQueries(qk);
        },
        onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Create Produit', detail: 'Creation échouée !!'});
        }
    })

    const {mutate: update} = useMutation((data) => updateProduit(data._id, data.data), {
        onSuccess: (_) => {
            toast.current.show({severity: 'success', summary: 'Mise à jour Produit', detail: 'Mis à jour réussie !!'});
            qc.invalidateQueries(qk);
           },
           onError: (_) => {
            toast.current.show({severity: 'error', summary: 'Mis à jour Produit', detail: 'Mis à jour échouée !!'});
           }
    })

    const leftToolbarTemplate = () => {
        return (
            <div className="flex items-center justify-center space-x-2">
                <button className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" onClick={() => handleCreateProduit()} >Nouveau <AiOutlinePlus className="h-6 w-6 text-white inline"/></button>
            </div>
        )
    }


    const handleUpdateProduit = (d) => {
        updateProduitModal({produit: d}).then((d => {
            const {_id,...rest} = d;
            update({_id,data: rest});
        }));
    }

    const handleCreateProduit = () => {
        createProduitModal().then(create);
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <h5 className="m-0">Liste des Produits</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
                </span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return <div className="flex items-center justify-center space-x-1">
        <button type="button" onClick={() => handleUpdateProduit(rowData)} className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-700 to-blue-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs" ><BsFillPenFill className="text-white inline"/></button>
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
              <h5 className="font-bold text-3xl">Gestion des Produits</h5>
              <img className="relative z-20 w-32 pt-6 h-32" src="/img/produit.png" alt="Produits" />
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
                <DataTable value={Produits} paginator className="p-datatable-customers" header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="_id" rowHover selection={selectedProduits} onSelectionChange={e => setSelectedProduits(e.value)}
                    filters={filters} filterDisplay="menu" loading={isLoading} responsiveLayout="scroll"
                    globalFilterFields={['nom', 'pv']} emptyMessage="Aucun Produit trouvé"
                    currentPageReportTemplate="Voir {first} de {last} à {totalRecords} Produits" size="small">
                    <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                    <Column field="nom" header="Nom" sortable style={{ minWidth: '14rem' }} />
                    <Column field="pa" header="Prix d'achat" sortable style={{ minWidth: '14rem' }} />
                    <Column field="pv" header="Prix de vente" sortable style={{ minWidth: '14rem' }} />
                    <Column field="unite.nom" header="Unite" sortable style={{ minWidth: '14rem' }} />
                    <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                </DataTable>
            </div>
        </div>
        <Toast ref={toast} />
    <ModalContainer />
    </>
  )
}

export default Produits