import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ModalContainer from "react-modal-promise";
import { InputText } from "primereact/inputtext";
import { BsEye, BsFillPenFill, BsPencilSquare } from "react-icons/bs";
import createClientModal from "./modals/createClientModal";
import updateClientModal from "./modals/updateClientModal";
import "./datatable.css";
import {
  createClient,
  getClients,
  removeClient,
  updateClient,
} from "../services/clientservice";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "./modals/ConfirmDelete";
import { ActionIcon, Button } from "@mantine/core";
import { MdDelete } from "react-icons/md";

function Clients() {
  const [selectedClients, setSelectedClients] = useState(null);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const toast = useRef();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    prenom: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const qk = ["get_Clients"];

  const { data: Clients, isLoading } = useQuery(qk, () => getClients());

  const { mutate: create } = useMutation((data) => createClient(data), {
    onSuccess: (_) => {
      toast.current.show({
        severity: "success",
        summary: "Creation Client",
        detail: "Création réussie !!",
      });
      qc.invalidateQueries(qk);
    },
    onError: (_) => {
      toast.current.show({
        severity: "error",
        summary: "Create Client",
        detail: "Creation échouée !!",
      });
    },
  });

  const { mutate: update } = useMutation(
    (data) => updateClient(data._id, data.data),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Mise à jour Client",
          detail: "Mis à jour réussie !!",
        });
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Mis à jour Client",
          detail: "Mis à jour échouée !!",
        });
      },
    }
  );

  const { mutate: deleteV } = useMutation((id) => removeClient(id), {
    onSuccess: (_) => {
      toast.current.show({
        severity: "success",
        summary: "Suppréssion Client",
        detail: "Suppréssion réussie !!",
      });
      qc.invalidateQueries(qk);
    },
    onError: (_) => {
      toast.current.show({
        severity: "error",
        summary: "Suppréssion Client",
        detail: "Suppréssion échouée !!",
      });
    },
  });

  const handleDelete = async () => {
    const resconfirm = await ConfirmDelete();
    if (resconfirm) {
      for (let i = 0; i < selectedClients?.length; i++) {
        deleteV(selectedClients[i]?._id);
      }
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="bg-green-500 hover:bg-green-700"
          onClick={() => handleCreateClient()}
          leftIcon={<AiOutlinePlus />}
        >
          Nouveau
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-700"
          onClick={() => handleDelete()}
          disabled={!selectedClients || !selectedClients.length}
          leftIcon={<MdDelete />}
        >
          {" "}
          Supprimer
        </Button>
      </div>
    );
  };

  const handleUpdateClient = (d) => {
    updateClientModal({ client: d }).then((d) => {
      const { _id, ...rest } = d;
      update({ _id, data: rest });
    });
  };

  const handleCreateClient = () => {
    createClientModal().then(create);
  };

  const handleViewClient = (row) => navigate(`/dashboard/clients/${row._id}`);
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h5 className="m-0">Liste des Clients</h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Rechercher ..."
          />
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <ActionIcon
          color="green"
          size="lg"
          onClick={() => handleUpdateClient(rowData)}
        >
          <BsPencilSquare size={26} />
        </ActionIcon>
        <ActionIcon
          color="blue"
          size="lg"
          onClick={() => handleViewClient(rowData)}
        >
          <BsEye size={26} />
        </ActionIcon>
      </div>
    );
  };

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
                    <h5 className="font-bold text-3xl">Gestion des Clients</h5>
                    <img
                      className="relative z-20 w-32 pt-6 h-32"
                      src="/img/clients.svg"
                      alt="Clients"
                    />
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
          <DataTable
            value={Clients}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            rowHover
            selection={selectedClients}
            onSelectionChange={(e) => setSelectedClients(e.value)}
            filters={filters}
            filterDisplay="menu"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={["nom", "prenom"]}
            emptyMessage="Aucun Client trouvé"
            currentPageReportTemplate="Voir {first} de {last} à {totalRecords} clients"
            size="small"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
            ></Column>
            <Column
              field="prenom"
              header="Prenom"
              sortable
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="nom"
              header="Nom"
              sortable
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="tel"
              header="Téléphone"
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              headerStyle={{ width: "4rem", textAlign: "center" }}
              bodyStyle={{ textAlign: "center", overflow: "visible" }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
      <Toast ref={toast} />
      <ModalContainer />
    </>
  );
}

export default Clients;
