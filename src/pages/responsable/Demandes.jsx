import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/Datatable";
import {
  getDemandeBrevets,
  deleteDemandeBrevet,
  updateDemandeBrevet,
} from "../../features/demande/apiDemande";
import { buildAndOpen } from "./demandeUtils";
import "./Demandes.css";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function RespDemandes() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mesData, setMesData] = useState([]);
  const [agentsData, setAgentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwnDemande = (demande) => {
    const currentUserId = user?.id != null ? String(user.id) : "";
    const currentUserEmail = (user?.email || "").toLowerCase();

    const creatorId =
      demande?.createur_id != null
        ? String(demande.createur_id)
        : demande?.createur?.id != null
          ? String(demande.createur.id)
          : "";

    const creatorIdentity = (
      demande?.createur_username ||
      demande?.createur?.username ||
      demande?.createur?.email ||
      ""
    ).toLowerCase();

    console.log({
      currentUserId,
      currentUserEmail,
      creatorId,
      creatorIdentity,
});

    return (
      (creatorId && currentUserId && creatorId === currentUserId) ||
      (creatorIdentity &&
        currentUserEmail &&
        creatorIdentity === currentUserEmail)
    );
  };

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDemandeBrevets();
      const all = res.results || res;
      console.log("USER:", user);
console.log("ALL DATA:", all);
     setMesData(
  all.filter(d => String(d.createur_id) === String(user.id))
);
     setAgentsData(
  all.filter(
    d =>
      String(d.createur_id) !== String(user.id) &&
      d.createur_groupe === "agent"
  )
);
      console.log(all)
      console.log("USER ID :", user.id);
      console.log("ALL :", all);
    } catch {
      setError("Erreur chargement des demandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      load(); 
  }, []);

  const handleDelete = async (row) => {
    try {
      await deleteDemandeBrevet(row.id_demande);
      load();
    } catch {
      setError("Erreur suppression.");
    }
  };

  const handleValider = async (row) => {
    try {
      await validerDemande(row.id_demande, { statut: "valider" });
      load();
    } catch {
      setError("Erreur validation.");
    }
  };

  const handleRefuser = async (row) => {
    try {
      await refuserDemande(row.id_demande, { statut: "refuser" });
      load();
    } catch {
      setError("Erreur refus.");
    }
  };

  const colonnesBase = [
    { key: "date_depo", label: "Date dépôt" },
    { key: "nature", label: "Nature" },
    { key: "titre", label: "Titre" },
    {
      key: "deposant",
      label: "Déposant(s)",
      render: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.map((item) => `${item.nom_dep} ${item.prenom_dep}`).join(", ")
          : "—",
      pdfFormat: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.map((item) => `${item.nom_dep} ${item.prenom_dep}`).join(", ")
          : "—",
    },
    {
      key: "inventeur",
      label: "Inventeur(s)",
      render: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.map((item) => `${item.nom_inv} ${item.prenom_inv}`).join(", ")
          : "—",
      pdfFormat: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.map((item) => `${item.nom_inv} ${item.prenom_inv}`).join(", ")
          : "—",
    },
    { key: "statut", label: "Statut" },
  ];

  const colonneFormulaire = {
    key: "_actions_formulaire",
    label: "Formulaire",
    pdfExclude: true,
    render: (_, row) => (
      <div className="dem-actions">
        <button
          type="button"
          className="act-btn print"
          title="Imprimer"
          onClick={() => buildAndOpen(row, "print")}
        >
          <PrintIcon sx={{ fontSize: 16 }} />
        </button>
        <button
          type="button"
          className="act-btn dl"
          title="Télécharger"
          onClick={() => buildAndOpen(row, "download")}
        >
          <DownloadIcon sx={{ fontSize: 16 }} />
        </button>
      </div>
    ),
  };

  const colonneDecision = {
    key: "_actions_decision",
    label: "Décision",
    pdfExclude: true,
    render: (_, row) => (
      <div className="dem-actions">
        <button
          type="button"
          title="Valider"
          disabled={row.statut === "valider"}
          className={`act-btn valider${row.statut === "valider" ? " is-disabled" : ""}`}
          onClick={() => handleValider(row)}
        >
          <CheckCircleIcon sx={{ fontSize: 16 }} />
        </button>
        <button
          type="button"
          title="Refuser"
          disabled={row.statut === "refuser"}
          className={`act-btn refuser${row.statut === "refuser" ? " is-disabled" : ""}`}
          onClick={() => handleRefuser(row)}
        >
          <CancelIcon sx={{ fontSize: 16 }} />
        </button>
      </div>
    ),
  };

  if (loading) return <p className="page-state">Chargement...</p>;
  if (error) return <p className="page-state error">{error}</p>;

  return (
    <div className="dem-page">
      <DataTable
        title="Mes Demandes de Protection"
        data={mesData}
        columns={[...colonnesBase, colonneFormulaire]}
        onAdd={() => navigate("/responsable/demandes/add")}
        onEdit={(row) => navigate(`/responsable/demandes/edit/${row.id_demande}`)}
        onView={(row) => navigate(`/responsable/demandes/view/${row.id_demande}`)}
        onDelete={handleDelete}
      />

      <DataTable
        title="Demandes des Agents"
        data={agentsData}
        columns={[
          { key: "createur_username", label: "Agent", render: (value) => value || "—" },
          ...colonnesBase,
          colonneFormulaire,
          colonneDecision,
        ]}
        onView={(row) => navigate(`/responsable/demandes/view/${row.id_demande}`)}
      />
    </div>
  );
}
