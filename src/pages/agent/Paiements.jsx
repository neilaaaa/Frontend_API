import { useEffect, useState } from "react";
import Datatable2 from "../../components/Datatable2";
import PaiementForm from "./PaiementForm";
import {
  getPaiement,
  addPaiement,
  updatePaiement,
  deletePaiement
} from "../../features/paiement/apiPaiement.js"

export default function AgentPaiements() {
  const [data, setData] = useState([]);
  const [editPaiement, setEditPaiement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPaiement();
      setData(data);
      console.log(data[0])
    } catch {
      setError("Erreur chargement des paiements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (paiement) => {
    try{
      setError("");
      if(editPaiement){
        await updatePaiement(editPaiement.id_paiement, paiement);
        setEditPaiement(null);
      } else{
        await addPaiement(paiement);
      }
      await load()
    } catch (err){
      console.log("ERREUR:", err.respose?.data)
      setError(JSON.stringify(err.response?.data) || "Erreur enregistrement.");
    }
  }

  const handleEdit = (row) => setEditPaiement(row);

 const handleDelete = async (row) => {
    try {
      await deletePaiement(row.id_paiement);
      await load();
    } catch {
      setError("Erreur suppression.");
    }
  };

   if (loading) return <p>Chargement...</p>;

  return (
    <Datatable2
      title="Gestion des paiements"
      exportName="paiements"
      data={data}
      columns={[
        {
            key: "brevet",
            label: "Brevet",
            render: (val) =>
              val ? `${val.titre} — N°${val.num_brevet}` : "—",

            pdfFormat: (val) =>
              typeof val === "object"
                ? `${val?.titre ?? ""} — N°${val?.num_brevet ?? ""}`.trim()
                : val,
          },
        { key: "date_paiement", label: "Date paiement" },
        { key: "montant_total", label: "Montant (DA)",
            render: (val) =>
              val != null
                ? Number(val).toLocaleString("fr-DZ") + " DA"
                : "—",
            pdfFormat: (val) =>
              val != null ? Number(val).toLocaleString("fr-DZ") + " DA" : "—",
        },
        { key: "statut", label: "Statut", 
          pdfFormat: (val) => (val === "payer" ? "Payé" : "Non payé"),
         },
      ]}
      form={
        <PaiementForm
          key={editPaiement ? editPaiement.id_paiement : "new"}
          editData={editPaiement}
          onSubmit={handleSubmit}
          onCancel={() => setEditPaiement(null)}
        />
      }
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}