import React, { useEffect, useState } from "react";
import GavelIcon from "@mui/icons-material/Gavel";
import DataTable3, { Badge } from "../../components/DataTable3";
import { getRecours } from "../../features/recours/apiRecours.js";

const STATUT_COLOR = { EN_COURS: "yellow", TRAITE: "green", REFUSE: "red" };
const STATUT_LABEL = { EN_COURS: "En attente", TRAITE: "Traité", REFUSE: "Refusé" };

const COLUMNS = [
  {
    key: "brevet",
    label: "Brevet",
    render: (r) => {
      const val = r.brevet;
      if (!val) return "Pas de brevet";
      return val.titre;
    },
  },
  { key: "date_depot", label: "Date dépôt", sortable: true },
  { key: "motif", label: "Motif", sortable: true },
  {
    key: "description",
    label: "Description",
    sortable: false,
    render: (r) => (
      <span className="text-muted-xs" title={r.description}>
        {r.description?.length > 45 ? `${r.description.slice(0, 45)}…` : r.description}
      </span>
    ),
  },
  {
    key: "date_traitement",
    label: "Date traitement",
    sortable: true,
    render: (r) => (r.date_traitement ? r.date_traitement : <span className="dt3-muted">—</span>),
  },
  {
    key: "statut",
    label: "Statut",
    sortable: false,
    render: (r) => <Badge label={STATUT_LABEL[r.statut] ?? r.statut} color={STATUT_COLOR[r.statut]} />,
  },
];

export default function DirRecour() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecours()
      .then((rows) => setData(rows))
      .catch((err) => {
        console.error("Erreur chargement recours :", err);
        setError("Impossible de charger les recours.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-state">Chargement des recours...</p>;
  if (error) return <p className="page-state error">{error}</p>;

  return (
    <DataTable3
      icon={<GavelIcon />}
      title="Gestion des recours"
      stats={[]}
      columns={COLUMNS}
      data={data}
      searchKeys={["motif", "description", "date_depot"]}
      statusKey="statut"
      statusList={["Tous", "EN_COURS", "TRAITE", "REFUSE"]}
      pdfTitle="Registre des Recours — Directeur"
      pdfColumns={["Brevet", "Date dépôt", "Motif", "Description", "Date traitement", "Statut"]}
      pdfRow={(r) => [
        r.brevet?.titre ?? "—",
        r.date_depot,
        r.motif,
        r.description?.slice(0, 50) ?? "—",
        r.date_traitement ?? "—",
        STATUT_LABEL[r.statut] ?? r.statut,
      ]}
      fileName="recours"
    />
  );
}
