import { useEffect, useState } from "react";
import Datatable2 from "../../components/Datatable2";
import RecoursForm from "./RecoursForm";

export default function Recours() {
  const [data, setData] = useState([]);
  const [editRecours, setEditRecours] = useState(null);

  useEffect(() => {
    const exempleData = [
      {
        id: 1,
        titre_brevet: "Brevet FR-2024-001",
        date_depot: "2024-01-15",
        motif: "Innovation process",
        description: "Procédé de fabrication avancé",
        statut: "EN_COURS",
        date_traitement: "",
      },
      {
        id: 2,
        titre_brevet: "Brevet FR-2024-002",
        date_depot: "2024-02-20",
        motif: "Invention mécanique",
        description: "Système de transmission innovant",
        statut: "TRAITE",
        date_traitement: "2024-03-10",
      },
    ];
    setData(exempleData);
  }, []);

  const handleSubmit = (recours) => {
    if (editRecours) {
      setData((prev) => prev.map((r) => (r.id === editRecours.id ? recours : r)));
      setEditRecours(null);
    } else {
      setData((prev) => [...prev, recours]);
    }
  };

  const handleEdit = (row) => setEditRecours(row);
  const handleDelete = (row) => setData((prev) => prev.filter((r) => r.id !== row.id));

  return (
    <Datatable2
      title="Gestion des recours"
      exportName="brevets"
      data={data}
      columns={[
        { key: "titre_brevet", label: "Titre brevet" },
        { key: "date_depot", label: "Date dépôt" },
        { key: "motif", label: "Motif" },
        { key: "description", label: "Description" },
        { key: "statut", label: "Statut" },
        { key: "date_traitement", label: "Date traitement" },
      ]}
      form={
        <RecoursForm
          key={editRecours ? editRecours.id : "new"}
          editData={editRecours}
          onSubmit={handleSubmit}
          onCancel={() => setEditRecours(null)}
        />
      }
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}