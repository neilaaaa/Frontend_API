import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DataTable from "../../components/Datatable";
import { getDemandeBrevets, deleteDemandeBrevet, validerDemandeBrevet, refuserDemandeBrevet } from "../../features/demande/apiDemande.js";
import "./Demandes.css";

import SearchIcon      from "@mui/icons-material/Search";
import EditIcon        from "@mui/icons-material/Edit";
import PrintIcon    from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon   from "@mui/icons-material/Delete";
import VisibilityIcon  from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon      from "@mui/icons-material/Cancel";
import RefreshIcon     from "@mui/icons-material/Refresh";

const KEY_RESP  = "resp_demandes";
const KEY_AGENT = "agent_demandes";
const loadResp  = () => JSON.parse(localStorage.getItem(KEY_RESP)  || "[]");
const loadAgent = () => JSON.parse(localStorage.getItem(KEY_AGENT) || "[]");
const saveResp  = (l) => localStorage.setItem(KEY_RESP,  JSON.stringify(l));
const saveAgent = (l) => localStorage.setItem(KEY_AGENT, JSON.stringify(l));

const EMPTY = {
  nature_brevet:false, nature_pct:false, nature_certificat:false,
  deposant_nom:"", deposant_prenom:"", deposant_denomination:"",
  deposant_adresse:"", deposant_nationalite:"",
  inventeur_nom:"", inventeur_prenom:"", inventeur_adresse:"",
  titre:"",
  mandataire_nom:"", mandataire_prenom:"", mandataire_adresse:"", mandataire_date_pouvoir:"",
  brevet_principal_num:"", brevet_principal_date:"",
  autres_informations:"",
  piece_copie_int:false, piece_memoire_nat:false, piece_memoire_fr:false,
  piece_memoire_fr_dup:false, piece_dessins_orig:false, piece_dessins_dup:false,
  piece_abrege:false, piece_pouvoir:false, piece_priorite:false,
  piece_cession:false, piece_titre:false,
};

const g   = (o,k) => (o&&o[k]!=null?String(o[k]):"");
const br  = (v)   => (v?String(v).replace(/\n/g,"<br/>"):"");
const chk = (v)   => (v===true||v==="true"?"&#9745;":"&#9744;");

function buildAndOpen(demande, mode) {
  const f = demande.data || {};
  const nB=chk(f.nature_brevet), nP=chk(f.nature_pct), nC=chk(f.nature_certificat);
  const dep1=[g(f,"deposant_nom"),g(f,"deposant_prenom")].filter(Boolean).join(" ");
  const dep2=g(f,"deposant_denomination")?"<br/>"+g(f,"deposant_denomination"):"";
  const dep3=br(f.deposant_adresse)?"<br/>"+br(f.deposant_adresse):"";
  const depNat=g(f,"deposant_nationalite");
  const inv1=[g(f,"inventeur_nom"),g(f,"inventeur_prenom")].filter(Boolean).join(" ");
  const inv2=br(f.inventeur_adresse)?"<br/>"+br(f.inventeur_adresse):"";
  const titre=g(f,"titre");
  const mand1=[g(f,"mandataire_nom"),g(f,"mandataire_prenom")].filter(Boolean).join(" ");
  const mand2=br(f.mandataire_adresse)?"<br/>"+br(f.mandataire_adresse):"";
  const mandDate=g(f,"mandataire_date_pouvoir");
  const bretNum=g(f,"brevet_principal_num")||"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const bretDate=g(f,"brevet_principal_date")||"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  const autresInfo=br(f.autres_informations);
  const pCI=chk(f.piece_copie_int),pMN=chk(f.piece_memoire_nat),pMF=chk(f.piece_memoire_fr);
  const pMFD=chk(f.piece_memoire_fr_dup),pDO=chk(f.piece_dessins_orig),pDD=chk(f.piece_dessins_dup);
  const pAB=chk(f.piece_abrege),pPO=chk(f.piece_pouvoir),pPR=chk(f.piece_priorite);
  const pCS=chk(f.piece_cession),pTI=chk(f.piece_titre);

  const css=`*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Times New Roman",Times,serif;font-size:10pt;color:#000;background:#fff}.tb{background:#1d4ed8;color:#fff;padding:10px 20px;display:flex;gap:12px;align-items:center;font-family:Arial,sans-serif}.tb button{background:#fff;color:#1d4ed8;border:none;padding:7px 16px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px}@media print{.tb{display:none}.pg{margin:0;page-break-after:always}.pg:last-child{page-break-after:auto}body{margin:0}}.pg{width:21cm;min-height:29.7cm;padding:1.4cm 1.7cm;position:relative;margin:0 auto}.hdr{width:100%;border-collapse:collapse;margin-bottom:4px}.hdr td{padding:2px 4px;vertical-align:top}.hl{width:33%;text-align:left}.hm{width:34%;text-align:center;vertical-align:middle}.hr{width:33%;text-align:right}.ar{font-family:Arial,sans-serif;font-size:8.5pt;direction:rtl;line-height:1.5}.ins{font-size:7.5pt;font-weight:bold;line-height:1.4}.lg{display:inline-block;border:3px solid #000;padding:2px 10px;font-size:18pt;font-weight:900;font-family:Arial,sans-serif;letter-spacing:-1px}.lgi{font-style:italic;font-weight:400}.rf{position:absolute;top:1.4cm;right:1.7cm;font-size:7.5pt;text-align:right;line-height:1.5}.nt{border:2.5px solid #000;margin:8px 0 7px}.ntt{text-align:center;font-size:13pt;font-weight:bold;padding:5px 8px;border-bottom:1.5px solid #000}.ntr{width:100%;border-collapse:collapse}.ntr td{padding:5px 14px;font-size:9pt;width:33%}.ck{font-size:13pt;margin-left:4px}.fb{border:1px solid #444;margin-bottom:5px}.ft{font-size:8pt;font-style:italic;padding:3px 7px;color:#333;background:#fafafa}.fv{padding:5px 10px 8px;font-size:10pt;min-height:35px;line-height:1.5}.ff{border-top:1px dashed #aaa;font-size:8pt;font-style:italic;padding:3px 8px;color:#555}.pb{border:1px solid #444;margin-bottom:5px}.pt{width:100%;border-collapse:collapse;font-size:9pt}.pt th{border:1px solid #444;padding:4px 6px;background:#f0f0f0;font-weight:bold;text-align:center}.pt td{border:1px solid #bbb;padding:0;height:24px}.bt{display:flex;border:1px solid #444;margin-top:6px}.bl{flex:1}.dt{width:100%;border-collapse:collapse;font-size:9.5pt}.dt th{border:1px solid #444;padding:4px 6px;background:#f0f0f0;font-weight:bold;text-align:center}.dt td{border:1px solid #bbb;height:28px}.di{border:1px solid #444;border-top:none;padding:5px 8px;font-size:8.5pt;font-style:italic;height:28px}.vs{width:130px;border-left:1px solid #444;display:flex;flex-direction:column;align-items:center;padding-top:8px}.vsl{font-size:9pt;font-weight:bold}.p2h{display:flex;align-items:center;gap:16px;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:10px}.p2l{width:52px;height:52px;border:3px double #000;display:flex;align-items:center;justify-content:center;font-size:24pt;font-weight:900;font-family:Arial,sans-serif}.p2n{flex:1;font-size:13pt;font-weight:bold;text-align:center}.p2m{font-size:9pt;text-align:right;line-height:1.7}.ct{border:1px solid #444;padding:7px 10px;font-size:9.5pt;margin-bottom:7px;min-height:30px}.ul{border-bottom:1px solid #000;display:inline-block;min-width:90px;padding:0 4px}.mw{display:flex;border:1px solid #444;margin-bottom:7px}.ml{flex:1;border-right:1px solid #444;min-height:55px}.mr{width:140px;padding:8px;font-size:9pt;line-height:1.6}.rt{width:100%;border-collapse:collapse;border:1px solid #444;margin-bottom:7px}.rt td{border:1px solid #aaa;padding:8px 10px;font-size:9pt;vertical-align:top}.ab{border:1px solid #444;margin-bottom:7px}.al{font-size:9.5pt;font-weight:bold;padding:4px 8px;border-bottom:1px solid #ccc}.av{padding:5px 10px 8px;min-height:50px;font-size:10pt;line-height:1.5}.brd{border:2px solid #000;padding:8px 12px;margin-bottom:8px}.brt{text-align:center;font-weight:bold;font-size:10pt;text-decoration:underline;margin-bottom:8px}.brc{display:grid;grid-template-columns:1fr 1fr;gap:4px 20px}.brc>div>p{font-size:8.5pt;margin-bottom:5px;line-height:1.4}.ftx{font-size:7.5pt;line-height:1.5;margin-bottom:5px;text-align:justify}.coo{font-size:8pt;line-height:1.6;text-align:center;margin:8px 0}.nop{text-align:center;font-weight:bold;font-size:10pt;letter-spacing:2px;margin:7px 0}.ast{font-size:7.5pt;font-style:italic}`;

  const html=`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Demande INAPI</title><style>${css}</style></head><body>
<div class="tb"><span style="font-size:14px;font-weight:700">📄 Formulaire INAPI — R2-FO-03</span><button onclick="window.print()">🖨&nbsp; Imprimer / Enregistrer PDF</button></div>
<div class="pg"><div class="rf">R2-FO-03<br/>E1</div>
<table class="hdr"><tr><td class="hl"><div class="ar">المعهد الوطني الجزائري للملكية الصناعية</div><div class="ins">INSTITUT NATIONAL ALGÉRIEN</div><div class="ins">DE LA PROPRIÉTÉ INDUSTRIELLE</div></td><td class="hm"><div class="lg"><span class="lgi">in</span>&thinsp;pi</div></td><td class="hr"><div class="ar">الجمهورية الجزائرية الديمقراطية الشعبية</div><div class="ins">RÉPUBLIQUE ALGÉRIENNE</div><div class="ins">DÉMOCRATIQUE ET POPULAIRE</div></td></tr></table>
<div class="nt"><div class="ntt">Nature de la demande de protection *</div><table class="ntr"><tr><td>Brevet d'invention <span class="ck">${nB}</span></td><td style="text-align:center">Extension PCT <span class="ck">${nP}</span></td><td style="text-align:right">Certificat d'addition <span class="ck">${nC}</span></td></tr></table></div>
<div class="fb"><div class="ft">[71] - DÉPOSANT(S)</div><div class="fv" style="min-height:58px">${dep1}${dep2}${dep3}</div><div class="ff">Nationalité : ${depNat}</div></div>
<div class="fb"><div class="ft">[72] - INVENTEUR(S)</div><div class="fv" style="min-height:58px">${inv1}${inv2}</div></div>
<div class="fb"><div class="ft">[54] - TITRE DE L'INVENTION</div><div class="fv" style="min-height:42px">${titre}</div></div>
<div class="pb"><div class="ft">[30] – REVENDICATION DE PRIORITÉ</div><table class="pt"><thead><tr><th>[31] N° dépôt</th><th>[32] Date</th><th>[33] Pays</th><th>Nature</th></tr></thead><tbody><tr><td>&nbsp;</td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td></tr></tbody></table></div>
<div class="bt"><div class="bl"><table class="dt"><thead><tr><th>Numéro de dépôt</th><th>Date de dépôt</th><th>Heure</th></tr></thead><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><div class="di">N° demande internationale</div></div><div class="vs"><div class="vsl">Visa</div></div></div>
</div>
<div class="pg">
<div class="p2h"><div class="p2l">S</div><div class="p2n">N° ________ /DG</div><div class="p2m">Classement : 0.003.5/20<br/>Référence : E-063<br/>Page : 3 de 3</div></div>
<div class="ct">Certificat d'addition — brevet n°&nbsp;<span class="ul">${bretNum}</span>&nbsp; du &nbsp;<span class="ul">${bretDate}</span></div>
<div class="mw"><div class="ml"><div class="ft">[74] - MANDATAIRE</div><div class="fv">${mand1}${mand2}</div></div><div class="mr">Date du pouvoir :<br/>${mandDate}</div></div>
<table class="rt"><tr><td style="width:30%">Le préposé à la réception</td><td style="width:35%">Fait à : le :</td><td style="width:35%;font-style:italic;font-size:8.5pt">Signature et cachet</td></tr></table>
<div class="ab"><div class="al">Autres informations</div><div class="av">${autresInfo}</div></div>
<div class="brd"><div class="brt">BORDEREAU DES PIÈCES DÉPOSÉES *</div><div class="brc"><div><p>${pCI} Copie demande internationale</p><p>${pMN} Mémoire national</p><p>${pMF} Mémoire français original</p><p>${pMFD} Mémoire français duplicata</p><p>${pDO} Dessins originaux</p><p>${pDD} Dessins duplicata</p></div><div><p>${pAB} Abrégé</p><p>${pPO} Pouvoir</p><p>${pPR} Document priorité</p><p>${pCS} Cession priorité</p><p>${pTI} Titre/paiement taxes</p></div></div></div>
<div class="nop">A NE PAS PLIER</div><div class="ast">* Cocher les cases correspondantes</div>
</div></body></html>`;

  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  if(mode==="download"){
    const a=document.createElement("a");a.href=url;a.download="demande_INAPI.html";
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  } else { window.open(url,"_blank"); }
}

/* ══════════════════════════════════════════════════════════ */
export default function RespDemandes() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mesData,    setMesData]    = useState([]);
  const [agentsData, setAgentsData] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

const load = async () => {
    try {
      setLoading(true); setError("");
      const res = await getDemandeBrevets();
      const all = res.results || res;
      setMesData(all.filter(d => d.createur_id === user.id));
      setAgentsData(all.filter(d => d.createur_id !== user.id));
    } catch {
      setError("Erreur chargement des demandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setField = (e) => {
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]:type==="checkbox"?checked:value}));
  };

  const openAdd  = () => { setEditId(null); setForm({...EMPTY}); setShowModal(true); };
  const openEdit = (d) => { setEditId(d.id); setForm({...EMPTY,...d.data}); setShowModal(true); };

 const handleDelete = async (row) => {
    try { await deleteDemandeBrevet(row.id_demande); load(); }
    catch { setError("Erreur suppression."); }
  };

   const handleValider = async (row) => {
    try { await validerDemandeBrevet(row.id_demande); load(); }
    catch { setError("Erreur validation."); }
  };

   const handleRefuser = async (row) => {
    try { await refuserDemandeBrevet(row.id_demande); load(); }
    catch { setError("Erreur refus."); }
  };

  const colonnesBase = [
    { key: "date_depo", label: "Date dépôt" },
    { key: "nature",    label: "Nature" },
    { key: "titre",     label: "Titre" },
    {
      key: "deposant",
      label: "Déposant",
      render: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.map(d => `${d.nom_dep} ${d.prenom_dep}`).join(", ") : "—",
      pdfFormat: (val) =>
        Array.isArray(val) && val.length > 0
          ? val.map(d => `${d.nom_dep} ${d.prenom_dep}`).join(", ") : "—",
    },
    {
      key: "inventeur",
      label: "Inventeur(s)",
      render: (value) =>
        Array.isArray(value) && value.length > 0
          ? value.map(i => `${i.nom_inv} ${i.prenom_inv}`).join(", ") : "—",
      pdfFormat: (val) =>
        Array.isArray(val) && val.length > 0
          ? val.map(i => `${i.nom_inv} ${i.prenom_inv}`).join(", ") : "—",
    },
    { key: "statut", label: "Statut" },
  ];

  const colonneFormulaire = {
    key: "_actions_formulaire",
    label: "Formulaire",
    pdfExclude: true,
    render: (_, row) => (
      <div style={{ display: "flex", gap: "5px", alignItems:"center", white_space: "nowrap" }}>
        <button
          title="Imprimer"
          style={{ background: "rgb(255, 240, 230)", color: "rgb(234, 97, 19)", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", }}
          onClick={() => buildAndOpen(row, "print")}
        >
          <PrintIcon sx={{ fontSize: 17 }} />
        </button>
        <button
          title="Télécharger"
          style={{ background: "#dcfce7", color: "#15803d", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}
          onClick={() => buildAndOpen(row, "download")}
        >
          <DownloadIcon sx={{ fontSize: 17 }} />
        </button>
      </div>
    ),
  };

  const colonneDecision = {
    key: "_actions_decision",
    label: "Décision",
    pdfExclude: true,
    render: (_, row) => (
      <div style={{ display: "flex", gap: 6 }}>
        <button
          title="Valider"
          disabled={row.statut === "valider"}
          style={{
            background: row.statut === "valider" ? "#19d389" : "#219e4f",
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "5px 9px",
            cursor: row.statut === "valider" ? "default" : "pointer",
          }}
          onClick={() => handleValider(row)}
        >
          <CheckCircleIcon sx={{ fontSize: 17 }} />
        </button>
        <button
          title="Refuser"
          disabled={row.statut === "refuser"}
          style={{
            background: row.statut === "refuser" ? "#fca5a5" : "#dc2626",
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "5px 9px",
            cursor: row.statut === "refuser" ? "default" : "pointer",
          }}
          onClick={() => handleRefuser(row)}
        >
          <CancelIcon sx={{ fontSize: 17 }} />
        </button>
      </div>
    ),
  };

  if (loading) return <p style={{ padding: 20 }}>Chargement…</p>;
  if (error)   return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
   <div style={{ background: "#faf7f2", minHeight: "100vh" }}>

      {/* ── TABLE 1 : Mes demandes ── */}
      <DataTable
        title="Mes Demandes de Protection"
        data={mesData}
        columns={[...colonnesBase, colonneFormulaire]}
        onAdd={()     => navigate("/responsable/demandes/add")}
        onEdit={(row) => navigate(`/responsable/demandes/edit/${row.id_demande}`)}
        onView={(row) => navigate(`/responsable/demandes/view/${row.id_demande}`)}
        onDelete={handleDelete}
      />

      {/* ── TABLE 2 : Demandes des agents ── */}
      <DataTable
        title="Demandes des Agents"
        data={agentsData}
        columns={[
          { key: "createur_username", label: "Agent", render: (val) => val || "—" },
          ...colonnesBase,
          colonneFormulaire,
          colonneDecision,
        ]}
        onView={(row) => navigate(`/responsable/demandes/view/${row.id_demande}`)}
      />

    </div>
  );
}