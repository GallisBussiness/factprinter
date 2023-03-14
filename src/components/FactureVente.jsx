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
import { BsFillPenFill } from "react-icons/bs";
import CreateFactureVenteModal from "./modals/CreateFactureVenteModal";
import UpdateFactureVenteModal from "./modals/UpdateFactureVenteModal";
import UpdateFactureVentePaymentModal from "./modals/UpdateFactureVentePaymentModal";
import "./datatable.css";
import {
  createFactureVente,
  removeFactureVente,
  updateFactureVente,
  getFactureVenteByClient,
} from "../services/facture-vente-service";
import ConfirmDelete from "./modals/ConfirmDelete";
import { MdDelete } from "react-icons/md";
import { Button } from "@mantine/core";

const calculRestant = (tab) => {
  let r = tab.reduce((acc, cur) => acc + cur.restant, 0);
  return r;
};

function FactureVente({ idClient }) {
  const qkf = ["get_dette_by_client", idClient];
  const [restant, setRestant] = useState(0);
  const { data: factures, isLoading } = useQuery(
    qkf,
    () => getFactureVenteByClient(idClient),
    {
      onSuccess: (_) => {
        let r = calculRestant(_);
        setRestant(r);
      },
    }
  );
  const [selectedFactureVentes, setSelectedFactureVentes] = useState(null);
  const qc = useQueryClient();
  const toast = useRef();
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

  const { mutate: create } = useMutation((data) => createFactureVente(data), {
    onSuccess: (_) => {
      toast.current.show({
        severity: "success",
        summary: "Creation Facture",
        detail: "Création réussie !!",
      });
      qc.invalidateQueries(qkf);
    },
    onError: (_) => {
      toast.current.show({
        severity: "error",
        summary: "Create facture",
        detail: "Creation échouée !!",
      });
    },
  });

  const { mutate: update } = useMutation(
    (data) => updateFactureVente(data._id, data.data),
    {
      onSuccess: (_) => {
        toast.current.show({
          severity: "success",
          summary: "Mise à jour Facture",
          detail: "Mis à jour réussie !!",
        });
        qc.invalidateQueries(qkf);
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

  const { mutate: deleteV } = useMutation((id) => removeFactureVente(id), {
    onSuccess: (_) => {
      toast.current.show({
        severity: "success",
        summary: "Suppréssion Facture",
        detail: "Suppréssion réussie !!",
      });
      qc.invalidateQueries(qkf);
    },
    onError: (_) => {
      toast.current.show({
        severity: "error",
        summary: "Suppréssion Facture",
        detail: "Suppréssion échouée !!",
      });
    },
  });

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          className="bg-green-500 hover:bg-green-700"
          onClick={() => handleCreateFactureVente()}
          leftIcon={<AiOutlinePlus />}
        >
          Nouveau
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-700"
          onClick={() => handleDelete()}
          disabled={!selectedFactureVentes || !selectedFactureVentes.length}
          leftIcon={<MdDelete />}
        >
          {" "}
          Supprimer
        </Button>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        <div className="text-lg font-bold text-black mx-10 p-2 border">
          {" "}
          Restant Total : {restant}
        </div>
      </>
    );
  };

  const handleUpdateFactureVente = (d) => {
    UpdateFactureVenteModal({ factureVente: d, client: idClient }).then((d) => {
      const { _id, ...rest } = d;
      update({ _id, data: rest });
    });
  };

  const handleCreateFactureVente = () => {
    CreateFactureVenteModal({ client: idClient }).then(create);
  };

  const handleDelete = async () => {
    const resconfirm = await ConfirmDelete();
    if (resconfirm) {
      for (let i = 0; i < selectedFactureVentes?.length; i++) {
        deleteV(selectedFactureVentes[i]?._id);
      }
    }
  };

  const handlePayment = (d) => {
    UpdateFactureVentePaymentModal({ factureVente: d, client: idClient }).then(
      (d) => {
        const { _id, ...rest } = d;
        update({ _id, data: rest });
      }
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center">
        <h5 className="m-0">Liste des Payements</h5>
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

  const fournisseurTemplate = (row) => `${row.client.prenom} ${row.client.nom}`;

  const payeTemplate = (row) => {
    let classs =
      row.total > row.avance
        ? "bg-amber-500 text-white font-bold px-4 py-2 rounded-md text-center"
        : "bg-green-500 text-white font-bold px-4 py-2 rounded-md text-center";
    if (row.avance < 0) {
      classs =
        "bg-red-500 text-white font-bold px-4 py-2 rounded-md text-center";
    }
    return (
      <>
        <div className={classs}>{row.avance}</div>
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
      row.restant > 0
        ? "bg-amber-500 text-white font-bold px-4 py-2 rounded-md text-center"
        : "bg-green-500 text-white font-bold px-4 py-2 rounded-md text-center";
    if (row.restant < 0) {
      classs =
        "bg-red-500 text-white font-bold px-4 py-2 rounded-md text-center";
    }
    return (
      <>
        <div className={classs}>{row.restant}</div>
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center space-x-1">
        <button
          type="button"
          onClick={() => handleUpdateFactureVente(rowData)}
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-amber-700 to-amber-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
        >
          <BsFillPenFill className="text-white inline" />
        </button>
        <button
          type="button"
          onClick={() => handlePayment(rowData)}
          className="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-green-700 to-green-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:scale-102 active:opacity-85 hover:shadow-soft-xs"
        >
          <GiMoneyStack className="text-white inline" />
        </button>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <>
      <div className="datatable-doc mt-4 w-4/5 mx-auto">
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataTable
            value={factures}
            paginator
            className="p-datatable-customers"
            header={header}
            rows={10}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            dataKey="_id"
            rowHover
            selection={selectedFactureVentes}
            onSelectionChange={(e) => setSelectedFactureVentes(e.value)}
            filters={filters}
            filterDisplay="menu"
            loading={isLoading}
            responsiveLayout="scroll"
            globalFilterFields={["date", "client.nom"]}
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
              style={{ minWidth: "14rem" }}
            />
            <Column
              field="client.nom"
              header="Client"
              body={fournisseurTemplate}
              sortable
              style={{ minWidth: "14rem" }}
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

export default FactureVente;
