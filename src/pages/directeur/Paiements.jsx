import React, { useEffect, useState } from "react";
import PaymentIcon from "@mui/icons-material/Payment";
import DataTable3, { Badge } from "../../components/DataTable3";
import { getPaiement } from "../../features/paiement/apiPaiement.js";

const STATUT_COLOR = { payer: "green", non_payer: "red" };
const STATUT_LABEL = { payer: "Payé", non_payer: "Non payé" };

const COLUMNS = [
  {
    key: "brevet",
    label: "Brevet",
    render: (r) => {
      const val = r.brevet;
      if (!val) return "Pas de brevet";
      return `${val.titre} — N°${val.num_brevet}`;
    },
  },
  { key: "date_paiement", label: "Date paiement", sortable: true },
  {
    key: "montant_total",
    label: "Montant total",
    sortable: true,
    render: (r) => <strong>{Number(r.montant_total).toLocaleString("fr-FR")} DA</strong>,
  },
  {
    key: "statut",
    label: "Statut",
    render: (r) => <Badge label={STATUT_LABEL[r.statut] ?? r.statut} color={STATUT_COLOR[r.statut]} />,
  },
];

export default function DirPaiements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPaiement()
      .then((rows) => {
        setData(rows);
      })
      .catch((err) => {
        console.error("Erreur chargement paiements :", err);
        setError("Impossible de charger les paiements.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-state">Chargement des paiements...</p>;
  if (error) return <p className="page-state error">{error}</p>;

  return (
    <DataTable3
      icon={<PaymentIcon />}
      title="Paiements"
      stats={[]}
      columns={COLUMNS}
      data={data}
      searchKeys={["date_paiement", "statut"]}
      statusKey="statut"
      statusList={["Tous", "payer", "non_payer"]}
      pdfTitle="Liste des Paiements — Directeur"
      pdfColumns={["Brevet", "Date paiement", "Montant total", "Statut"]}
      pdfRow={(r) => [
        r.brevet?.titre ?? "—",
        r.date_paiement,
        `${Number(r.montant_total).toLocaleString("fr-FR")} DA`,
        STATUT_LABEL[r.statut] ?? r.statut,
      ]}
      fileName="paiements"
    />
  );
}
