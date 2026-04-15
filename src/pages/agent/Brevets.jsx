import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/Datatable";

import {
  getBrevets,
  deleteBrevet,
} from "../../features/brevets/brevetStorage";

export default function Brevets() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const load = () => {
    setData(getBrevets());
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (row) => {
    deleteBrevet(row.id);
    load();
  };

  return (
    <DataTable
      title="List des brevets"
      data={data}
      columns={[
  { key: "num_brevet", label: "N° Brevet" },
  { key: "titre", label: "Titre" },
  { key: "num_depo", label: "N° Dépôt" },
  { key: "date_depo", label: "Date dépôt" },
  { key: "date_sortie", label: "Date sortie" },
  { key: "titulaire", label: "Titulaire" },
  { key: "nom_inventeur", label: "Inventeur" },
  { key: "nom_deposant", label: "Déposant" },
  { key: "status", label: "Statut" },

  // ✅ NOUVELLE COLONNE DOCUMENTS
  {
    key: "documents",
    label: "Documents",
    render: (value) =>
      value && value.length > 0
        ? value.join(", ")
        : "Aucun",
  },
]}
      onAdd={() => navigate("/agent/brevets/add")}
      onEdit={(row) => navigate(`/agent/brevets/edit/${row.id}`)}
      onView={(row) => navigate(`/agent/brevets/view/${row.id}`)}
      onDelete={handleDelete}
    />
  );
}