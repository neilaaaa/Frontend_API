
import React, { useMemo, useEffect, useState } from "react";
import PaymentIcon from "@mui/icons-material/Payment";
import DataTable3, { Badge } from "../../components/DataTable3";
import {
  getPaiement,
} from "../../features/paiement/apiPaiement.js"

const STATUT_COLOR = { "Payé": "green", "Non payé": "red" };
const STATUT_LABEL = { payer: "Payé", non_payer: "Non payé" };

const COLUMNS = [
 {key: "brevet",
  label: "Brevet",
  render: (r) =>{
   const val = r.brevet
  if (!val) return "pas de brevet"
  return `${val.titre} — N°${val.num_brevet}`
 },},
  { key: "date_paiement", label: "Date paiement",  sortable: true  },
  { key: "montant_total",       label: "Montant total",  sortable: true,  
    render: (r) => <strong>{Number(r.montant_total).toLocaleString("fr-FR")} DA</strong>},
  { key: "statut", label: "Statut", 
    render: (r) => <Badge label={STATUT_LABEL[r.statut] ?? r.statut} color={STATUT_COLOR[r.statut]} />,},
];

export default function DirPaiements() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

 useEffect(() => {
    getPaiement()
      .then((rows) => {
        console.log("paiements reçus:", rows) 
        console.log(data[0])
        setData(rows)})
      .catch((err) => {
        console.error("Erreur chargement paiements :", err);
        setError("Impossible de charger les paiements.");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalMontant = data.reduce((s, r) => s + Number(r.montant_total), 0);
    const montantPaye  = data.filter((r) => r.statut === "payer").reduce((s, r) => s + Number(r.montant_total), 0);
    const montantNon   = data.filter((r) => r.statut === "non_payer").reduce((s, r) => s + Number(r.montant_total), 0);

    return[
    { label: "Montant total",    value: `${totalMontant.toLocaleString("fr-FR")} DA` },
    { label: "Total payé",       value: `${montantPaye.toLocaleString("fr-FR")} DA`,  color: "green" },
    { label: "Total non payé",   value: `${montantNon.toLocaleString("fr-FR")} DA`,   color: "red"   },
    ];
  }, [data])

  if (loading) return <p style={{ padding: 24 }}>Chargement des paiements…</p>;
  if (error)   return <p style={{ padding: 24, color: "red" }}>{error}</p>;


  return (
    <DataTable3
      icon={<PaymentIcon />}
      title="Paiements"
      stats={stats}
      columns={COLUMNS}
      data={data}
      searchKeys={["date_paiement", "statut"]}
      statusKey="statut"
      statusList={["Tous", "payer", "non payer"]}
      pdfTitle="Liste des Paiements — Directeur"
      pdfColumns={["Titre brevet", "Date paiement", "Montant total", "Statut"]}
      pdfRow={(r) => [
        r.id_brevet?.titre ?? "—",
        r.date_paiement,
        `${Number(r.montant_total).toLocaleString("fr-FR")} DA`,
        STATUT_LABEL[r.statut] ?? r.statut,
      ]}
      fileName="paiements"
    />
  );
}