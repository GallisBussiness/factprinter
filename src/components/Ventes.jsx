import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { GiMoneyStack } from "react-icons/gi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ModalContainer from "react-modal-promise";
import { InputText } from "primereact/inputtext";
import { BsEye, BsFillPenFill, BsPencilSquare } from "react-icons/bs";
import CreateVenteModal from "./modals/CreateVenteModal";
import UpdateVenteModal from "./modals/UpdateVenteModal";
import UpdateVentePaymentModal from "./modals/UpdateVentePaymentModal";
import "./datatable.css";
import {
  createVente,
  getVentes,
  removeVente,
  updateVente,
} from "../services/venteservice";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "./modals/ConfirmDelete";
import { MdDelete } from "react-icons/md";
import { ActionIcon, Button, LoadingOverlay } from "@mantine/core";

function Ventes() {
  const [selectedVentes, setSelectedVentes] = useState(null);
  const qc = useQueryClient();
  const toast = useRef();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const qk = ["get_Ventes"];

  const { data: Ventes, isLoading } = useQuery(qk, () => getVentes());

  const { mutate: create, isLoadingC } = useMutation(
    (data) => createVente(data),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Creation Facture",
          detail: "Création réussie !!",
        });
        qc.invalidateQueries(qk);
        navigate(`/dashboard/ventes/${_._id}`);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Create facture",
          detail: "Creation échouée !!",
        });
      },
    }
  );

  const { mutate: update, isLoadingU } = useMutation(
    (data) => updateVente(data._id, data.data),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Mise à jour Facture",
          detail: "Mis à jour réussie !!",
        });
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Mis à jour Facture",
          detail: "Mis à jour échouée !!",
        });
      },
    }
  );

  const { mutate: deleteV, isLoading: isLoadingD } = useMutation(
    (id) => removeVente(id),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Suppréssion Facture",
          detail: "Suppréssion réussie !!",
        });
        qc.invalidateQueries(qk);
      },
      onError: (_) => {
        toast.current.show({
          severity: "error",
          summary: "Suppréssion Facture",
          detail: "Suppréssion échouée !!",
        });
      },
    }
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="bg-green-500 hover:bg-green-700"
          onClick={() => handleCreateVente()}
          leftIcon={<AiOutlinePlus />}
        >
          Nouveau
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-700"
          onClick={() => handleDelete()}
          disabled={!selectedVentes || !selectedVentes.length}
          leftIcon={<MdDelete />}
        >
          {" "}
          Supprimer
        </Button>
      </div>
    );
  };

  const handleUpdateVente = (d) => {
    UpdateVenteModal({ vente: d }).then((d) => {
      const { _id, ...rest } = d;
      update({ _id, data: rest });
    });
  };

  const handleViewVente = (row) => navigate(`/dashboard/ventes/${row._id}`);
  const handleCreateVente = () => {
    CreateVenteModal().then(create);
  };

  const handleDelete = async () => {
    const resconfirm = await ConfirmDelete();
    if (resconfirm) {
      for (let i = 0; i < selectedVentes?.length; i++) {
        deleteV(selectedVentes[i]?._id);
      }
    }
  };

  const handlePayment = (d) => {
    UpdateVentePaymentModal({ vente: d }).then((d) => {
      const { _id, ...rest } = d;
      update({ _id, data: rest });
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h5 className="m-0">Liste des Factures</h5>
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

  const formatDate = (v) => {
    const parts = v.split("-");
    return parts.reverse().join("-");
  };

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.date);
  };

  const clientTemplate = (row) => `${row?.client?.prenom} ${row?.client?.nom}`;

  const payeTemplate = (row) => {
    let classs =
      row.total > row?.avance
        ? "bg-amber-500 text-white font-bold px-4 py-2 rounded-md text-center"
        : "bg-green-500 text-white font-bold px-4 py-2 rounded-md text-center";
    if (row?.avance < 0) {
      classs =
        "bg-red-500 text-white font-bold px-4 py-2 rounded-md text-center";
    }
    return (
      <>
        <div className={classs}>{row?.avance}</div>
      </>
    );
  };

  const totalTemplate = (row) => (
    <>
      <div className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md text-center">
        {row.total}
      </div>
    </>
  );

  const restantTemplate = (row) => {
    let classs =
      row?.restant > 0
        ? "bg-amber-500 text-white font-bold px-4 py-2 rounded-md text-center"
        : "bg-green-500 text-white font-bold px-4 py-2 rounded-md text-center";
    if (row?.restant < 0) {
      classs =
        "bg-red-500 text-white font-bold px-4 py-2 rounded-md text-center";
    }
    return (
      <>
        <div className={classs}>{row?.restant}</div>
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <ActionIcon
          color="green"
          size="lg"
          onClick={() => handleUpdateVente(rowData)}
        >
          <BsPencilSquare size={26} />
        </ActionIcon>
        <ActionIcon
          color="blue"
          size="lg"
          onClick={() => handleViewVente(rowData)}
        >
          <BsEye size={26} />
        </ActionIcon>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <>
      <LoadingOverlay
        visible={isLoadingC || isLoadingU || isLoadingD}
        overlayBlur={2}
      />
      <div className="flex flex-wrap mt-6 -mx-3">
        <div className="w-full px-3 mb-6 lg:mb-0 lg:flex-none">
          <div className="relative flex flex-col h-40 min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap -mx-3">
                <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
                  <div className="flex items-center justify-center h-full">
                    <h5 className="font-bold text-3xl">Gestion des Factures</h5>
                    <img
                      className="relative z-20 w-32 pt-6 h-32 animate-bounce"
                      src="/img/facture.svg"
                      alt="facture"
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
            value={Ventes}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            rowHover
            selection={selectedVentes}
            onSelectionChange={(e) => setSelectedVentes(e.value)}
            filters={filters}
            filterDisplay="menu"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={["date", "client.prenom", "client.nom"]}
            emptyMessage="Aucune Facture trouvée"
            currentPageReportTemplate="Voir {first} de {last} à {totalRecords} Factures"
            size="small"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3em" }}
            ></Column>
            <Column
              field="date"
              header="Date"
              body={dateBodyTemplate}
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="client.nom"
              header="Client"
              body={clientTemplate}
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="total"
              header="Total"
              body={totalTemplate}
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="avance"
              header="Payé"
              body={payeTemplate}
              sortable
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="restant"
              header="Restant"
              body={restantTemplate}
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

export default Ventes;
