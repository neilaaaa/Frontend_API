import React, { useEffect, useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import DataTable3, { Badge } from "../../components/DataTable3";
import { getTousBrevets } from "../../features/brevets/brevetApi";

const STATUT_COLOR = { ACCEPTER: "green", REFUSER: "red", EN_ATTENTE: "yellow" };
const STATUT_LABEL = { ACCEPTER: "Accepté", REFUSER: "Refusé", EN_ATTENTE: "En attente" };

const COLUMNS = [
  {
    key: "num_brevet",
    label: "N° Brevet",
    sortable: true,
    render: (r) => <span className="dt3-ref">BR-{String(r.num_brevet).padStart(3, "0")}</span>,
  },
  {
    key: "titre",
    label: "Titre",
    sortable: true,
    render: (r) => <span title={r.titre}>{r.titre.length > 45 ? `${r.titre.slice(0, 45)}…` : r.titre}</span>,
  },
  { key: "date_depo", label: "Date dépôt", sortable: true },
  {
    key: "date_sortie",
    label: "Date sortie",
    sortable: true,
    render: (r) => (r.date_sortie ? r.date_sortie : <span className="dt3-muted">—</span>),
  },
  { key: "titulaire", label: "Titulaire", sortable: true },
  {
    key: "statut",
    label: "Statut",
    sortable: false,
    render: (r) => <Badge label={STATUT_LABEL[r.statut] || r.statut} color={STATUT_COLOR[r.statut]} />,
  },
];

export default function DirBrevets() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTousBrevets();
      setData(response.results || response);
    } catch (err) {
      console.error("erreur:", err);
      console.error("response:", err.response?.data);
      setError("Erreur chargement des brevets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="page-state">Chargement des brevets...</p>;
  if (error) return <p className="page-state error">{error}</p>;

  return (
    <DataTable3
      icon={<DescriptionIcon />}
      title="Brevets"
      stats={[]}
      columns={COLUMNS}
      data={data}
      searchKeys={["num_brevet", "titre", "titulaire"]}
      statusKey="statut"
      statusList={["Tous", "ACCEPTER", "REFUSER", "EN_ATTENTE"]}
      pdfTitle="Registre des Brevets"
      pdfColumns={["N° Brevet", "Titre", "Date dépôt", "Date sortie", "Titulaire", "Statut"]}
      pdfRow={(r) => [
        `BR-${String(r.num_brevet).padStart(3, "0")}`,
        r.titre.slice(0, 48),
        r.date_depo,
        r.date_sortie ?? "—",
        r.titulaire,
        STATUT_LABEL[r.statut] || r.statut,
      ]}
      fileName="brevets"
    />
  );
}
