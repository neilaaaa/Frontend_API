import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemandeBrevetById } from "../../features/demande/apiDemande";
import { buildAndOpen } from "./demandeUtils";
import "./Demandes.css";

export default function RespViewDemande() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setData(await getDemandeBrevetById(id));
      } catch {
        setError("Demande introuvable.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <p className="page-state">Chargement...</p>;
  if (error || !data) return <p className="page-state error">{error || "Demande introuvable."}</p>;

  return (
    <div className="dem-page">
      <div className="dem-card demand-form-shell">
        <div className="dem-page-header">
          <h2 className="dem-title">Détails de la demande</h2>
          <p className="dem-sub">Consultation responsable — demande #{data.id_demande}</p>
        </div>

        <Section num="01" label="Nature de la demande"><ViewField label="Nature" value={data.nature} /></Section>
        <Section num="71" label="[71] — Déposant">{Array.isArray(data.deposant) && data.deposant.length > 0 ? data.deposant.map((dep) => <div key={dep.id_dep ?? `${dep.nom_dep}-${dep.prenom_dep}`} className="view-field-stack"><ViewField label="Nom" value={dep.nom_dep} /><ViewField label="Prénom" value={dep.prenom_dep} /><ViewField label="Dénomination" value={dep.denomination} /><ViewField label="Adresse" value={dep.adresse_dep} /><ViewField label="Nationalité" value={dep.nationalite} /></div>) : <ViewField label="Déposant" value="Aucun déposant" />}</Section>
        <Section num="72" label="[72] — Inventeur(s)">{Array.isArray(data.inventeur) && data.inventeur.length > 0 ? data.inventeur.map((inv) => <div key={inv.id_inv ?? `${inv.nom_inv}-${inv.prenom_inv}`} className="view-field-stack"><ViewField label="Nom" value={inv.nom_inv} /><ViewField label="Prénom" value={inv.prenom_inv} /><ViewField label="Adresse" value={inv.adress_inv} /></div>) : <ViewField label="Inventeur" value="Aucun inventeur" />}</Section>
        <Section num="54" label="[54] — Titre de l'invention"><ViewField label="Titre" value={data.titre} /></Section>
        <Section num="30" label="[30] — Revendication de priorité"><ViewField label="N° dépôt" value={data.num_depo} /><ViewField label="Date dépôt" value={data.date_depo} /><ViewField label="Pays d'origine" value={data.pays_origine} /></Section>
        <Section num="74" label="[74] — Mandataire"><ViewField label="Mandataire" value={data.mandataire} /><ViewField label="Date pouvoir" value={data.date_pouvoir} /></Section>
        <Section num="ℹ" label="Autres informations"><ViewField label="Informations" value={data.autre_info} /></Section>

        <div className="modal-footer demand-form-actions">
          <button className="btn-cancel" onClick={() => navigate("/responsable/demandes")}>Retour</button>
          <button className="btn-print" onClick={() => buildAndOpen(data, "print")}>Imprimer</button>
          <button className="btn-dl" onClick={() => buildAndOpen(data, "download")}>Télécharger</button>
          <button className="btn-save" onClick={() => navigate(`/responsable/demandes/edit/${data.id_demande}`)}>Modifier</button>
        </div>
      </div>
    </div>
  );
}

function Section({ num, label, children }) { return <div className="modal-section"><div className="section-title"><span className="section-num">{num}</span>{label}</div>{children}</div>; }
function ViewField({ label, value }) { return <div className="view-field"><div className="view-label">{label}</div><div className="view-value">{value || "—"}</div></div>; }
