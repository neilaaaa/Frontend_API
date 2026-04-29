import { useState, useEffect } from "react";
import "./Demandes.css";
import { getDemandeBrevets, addDemandeBrevet, updateDemandeBrevet, deleteDemandeBrevet } from "../../features/demande/apiDemande";
/* ─── MUI Icons ────────────────────────────────────────────────────────── */
import SearchIcon   from "@mui/icons-material/Search";
import EditIcon     from "@mui/icons-material/Edit";
import PrintIcon    from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon   from "@mui/icons-material/Delete";
import {api} from "/src/contexts/AuthContext.jsx";

/* ─── Storage ──────────────────────────────────────────────────────────── */


/* ─── Empty form ───────────────────────────────────────────────────────── */
const EMPTY = {
  nature_brevet: false, nature_pct: false, nature_certificat: false,
  deposant_nom: "", deposant_prenom: "", deposant_denomination: "",
  deposant_adresse: "", deposant_nationalite: "",
  inventeur_nom: "", inventeur_prenom: "", inventeur_adresse: "",
  titre: "",
  num_depot: "", priorite_date: "", priorite_pays: "", priorite_nature: "",
  mandataire_nom: "", mandataire_prenom: "", mandataire_adresse: "", mandataire_date_pouvoir: "",
  brevet_principal_num: "", brevet_principal_date: "",
  autres_informations: "",
  piece_copie_int: false, piece_memoire_nat: false, piece_memoire_fr: false,
  piece_memoire_fr_dup: false, piece_dessins_orig: false, piece_dessins_dup: false,
  piece_abrege: false, piece_pouvoir: false, piece_priorite: false,
  piece_cession: false, piece_titre: false,
};

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const g   = (obj, key) => (obj && obj[key] != null ? String(obj[key]) : "");
const br  = (v) => (v ? String(v).replace(/\n/g, "<br/>") : "");
const chk = (v) => (v === true || v === "true" ? "&#9745;" : "&#9744;");

/* ─── Build & open print HTML ──────────────────────────────────────────── */
function buildAndOpen(demande, mode) {
  const f = demande;
  console.log("DEMANDE:", demande);
  
  const nBrevet     = chk(f.nature_brevet);
  const nPct        = chk(f.nature_pct);
  const nCertificat = chk(f.nature_certificat);

  const deposant = f.deposant?.[0] || {};
  const depNom   = g(deposant, "nom_dep");
  const depPren  = g(deposant, "prenom_dep");
  const depDenom = g(deposant, "denomination");
  const depAdr   = br(deposant.adresse_dep);
  const depNat   = g(deposant, "nationalite");

  const invBlock = (f.inventeur || [])
    .map(inv => {
      const nom = g(inv, "nom_inv");
      const prenom = g(inv, "prenom_inv");
      const adr = br(inv.adress);
      return [nom, prenom].filter(Boolean).join(" ") + (adr ? "<br/>" + adr : "");
    })
    .join("<br/><br/>");

  const titre      = g(f, "titre");
  const mandataire = br(f.mandataire);
  const mandDate   = g(f, "mandataire_date_pouvoir");
  const bretNum    = g(f.brevet||{}, "num_brevet");
  const bretDate   = g(f.brevet||{}, "brevet_principal_date");
  const autresInfo = br(f.autres_informations);

  const pCI  = chk(f.piece_copie_int);
  const pMN  = chk(f.piece_memoire_nat);
  const pMF  = chk(f.piece_memoire_fr);
  const pMFD = chk(f.piece_memoire_fr_dup);
  const pDO  = chk(f.piece_dessins_orig);
  const pDD  = chk(f.piece_dessins_dup);
  const pAB  = chk(f.piece_abrege);
  const pPO  = chk(f.piece_pouvoir);
  const pPR  = chk(f.piece_priorite);
  const pCS  = chk(f.piece_cession);
  const pTI  = chk(f.piece_titre);

  const dep1  = [depNom, depPren].filter(Boolean).join(" ");
  const dep2  = depDenom ? "<br/>" + depDenom : "";
  const dep3  = depAdr   ? "<br/>" + depAdr   : "";
  const mand1 = mandataire ;
  const mand2 = ""

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Demande INAPI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Times New Roman",Times,serif;font-size:10pt;color:#000;background:#fff}
.toolbar{background:#1d4ed8;color:#fff;padding:10px 20px;display:flex;gap:12px;align-items:center;font-family:Arial,sans-serif}
.toolbar button{background:#fff;color:#1d4ed8;border:none;padding:7px 16px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px}
@media print{.toolbar{display:none}}
.page{width:21cm;min-height:29.7cm;padding:1.4cm 1.7cm;position:relative;margin:0 auto}
@media print{body{margin:0}.page{margin:0;page-break-after:always}.page:last-child{page-break-after:auto}}
.hdr{width:100%;border-collapse:collapse;margin-bottom:4px}
.hdr td{padding:2px 4px;vertical-align:top}
.hl{width:33%;text-align:left}.hm{width:34%;text-align:center;vertical-align:middle}.hr{width:33%;text-align:right}
.arabic{font-family:Arial,sans-serif;font-size:8.5pt;direction:rtl;line-height:1.5}
.inst{font-size:7.5pt;font-weight:bold;line-height:1.4}
.logo{display:inline-block; border:3px solid #000;padding:1px 40px;font-size:18pt;font-weight:900;font-family:Arial,sans-serif;letter-spacing:-1px}
.img{width:50px;height:50px;object-fit:contain}
.ref{position:absolute;top:1.4cm;right:1.7cm;font-size:7.5pt;text-align:right;line-height:1.5}
.nat{border:2.5px solid #000;margin:8px 0 7px}
.nat-t{text-align:center;font-size:13pt;font-weight:bold;padding:5px 8px;border-bottom:1.5px solid #000}
.nat-r{width:100%;border-collapse:collapse}.nat-r td{padding:5px 14px;font-size:9pt;width:33%}
.ck{font-size:13pt;margin-left:4px}
.fb{border:1px solid #444;margin-bottom:5px}.ft{font-size:8pt;font-style:italic;padding:3px 7px;color:#333;background:#fafafa}
.fv{padding:5px 10px 8px;font-size:10pt;min-height:35px;line-height:1.5}
.ff{border-top:1px dashed #aaa;font-size:8pt;font-style:italic;padding:3px 8px;color:#555}
.pb{border:1px solid #444;margin-bottom:5px}.pt{width:100%;border-collapse:collapse;font-size:9pt}
.pt th{border:1px solid #444;padding:4px 6px;background:#f0f0f0;font-weight:bold;text-align:center}
.pt td{border:1px solid #bbb;padding:0;height:24px}
.bot{display:flex;border:1px solid #444;margin-top:6px}.botl{flex:1}
.dt{width:100%;border-collapse:collapse;font-size:9.5pt}
.dt th{border:1px solid #444;padding:4px 6px;background:#f0f0f0;font-weight:bold;text-align:center}
.dt td{border:1px solid #bbb;height:28px}
.di{border:1px solid #444;border-top:none;padding:5px 8px;font-size:8.5pt;font-style:italic;height:28px}
.vis{width:130px;border-left:1px solid #444;display:flex;flex-direction:column;align-items:center;padding-top:8px}
.visl{font-size:9pt;font-weight:bold}
.p2h{display:flex;align-items:center;gap:16px;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:10px}
.p2logo{width:52px;height:52px;border:3px double #000;display:flex;align-items:center;justify-content:center;font-size:24pt;font-weight:900;font-family:Arial,sans-serif}
.p2n{flex:1;font-size:13pt;font-weight:bold;text-align:center}
.p2m{font-size:9pt;text-align:right;line-height:1.7}
.cert{border:1px solid #444;padding:7px 10px;font-size:9.5pt;margin-bottom:7px;min-height:30px}
.ul{border-bottom:1px solid #000;display:inline-block;min-width:90px;padding:0 4px}
.mw{display:flex;border:1px solid #444;margin-bottom:7px}
.ml{flex:1;border-right:1px solid #444;min-height:55px}
.mr{width:140px;padding:8px;font-size:9pt;line-height:1.6}
.rt{width:100%;border-collapse:collapse;border:1px solid #444;margin-bottom:7px}
.rt td{border:1px solid #aaa;padding:8px 10px;font-size:9pt;vertical-align:top;min-height:50px}
.ab{border:1px solid #444;margin-bottom:7px}.al{font-size:9.5pt;font-weight:bold;padding:4px 8px;border-bottom:1px solid #ccc}
.av{padding:5px 10px 8px;min-height:50px;font-size:10pt;line-height:1.5}
.brd{border:2px solid #000;padding:8px 12px;margin-bottom:8px}
.brt{text-align:center;font-weight:bold;font-size:10pt;text-decoration:underline;margin-bottom:8px}
.brc{display:grid;grid-template-columns:1fr 1fr;gap:4px 20px}
.brc>div>p{font-size:8.5pt;margin-bottom:5px;line-height:1.4}
.ftx{font-size:7.5pt;line-height:1.5;margin-bottom:5px;text-align:justify}
.coo{font-size:8pt;line-height:1.6;text-align:center;margin:8px 0}
.lit{font-size:8pt;text-align:center;font-style:italic;margin:4px 0}
.nop{text-align:center;font-weight:bold;font-size:10pt;letter-spacing:2px;margin:7px 0}
.ast{font-size:7.5pt;font-style:italic}
</style>
</head>
<body>
<div class="toolbar">
  <span style="font-size:14px;font-weight:700">📄 Formulaire INAPI — R2-FO-03</span>
  <button onclick="window.print()">🖨&nbsp; Imprimer / Enregistrer PDF</button>
</div>
<div class="page">
  <table class="hdr"><tr>
    <td class="hl"><div class="arabic">المعهد الوطني الجزائري للملكية الصناعية</div><div class="inst">INSTITUT NATIONAL ALGÉRIEN</div><div class="inst">DE LA PROPRIÉTÉ INDUSTRIELLE</div></td>
    <td class="hm"><div class="logo"><img class="img" src="/logoinapii.png" alt="INAPI Logo"/></div></td>
    <td class="hr"><div class="arabic">الجمهورية الجزائرية الديمقراطية الشعبية</div><div class="inst">RÉPUBLIQUE ALGÉRIENNE</div><div class="inst">DÉMOCRATIQUE ET POPULAIRE</div></td>
  </tr></table>
  <div class="nat">
    <div class="nat-t">Nature de la demande de protection *</div>
    <table class="nat-r"><tr>
      <td>Brevet d'invention <span class="ck">${nBrevet}</span></td>
      <td style="text-align:center">Extension de la demande<br/>internationale selon le PCT <span class="ck">${nPct}</span></td>
      <td style="text-align:right">Certificat d'addition <span class="ck">${nCertificat}</span></td>
    </tr></table>
  </div>
  <div class="fb"><div class="ft">[71] - DÉPOSANT(S) : <em>Nom, Prénom [dénomination], et Adresse complète</em></div><div class="fv" style="min-height:58px">${dep1}${dep2}${dep3}</div><div class="ff">Nationalité du ou des déposants : ${depNat}</div></div>
  <div class="fb"><div class="ft">[72] - INVENTEUR(S) : <em>Nom, Prénom, Adresse</em></div><div class="fv" style="min-height:58px">${invBlock }</div></div>
  <div class="fb"><div class="ft">[54] - TITRE DE L'INVENTION :</div><div class="fv" style="min-height:42px">${titre}</div></div>
  <div class="pb"><div class="ft">[30] – REVENDICATION DE PRIORITÉ (S)</div>
    <table class="pt"><thead><tr><th>[31] - N°(s) de dépôt</th><th>[32] - date(s)</th><th>[33] - pays d'origine</th><th>Nature de la demande</th></tr></thead>
    <tbody><tr><td>&nbsp;</td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td></tr><tr><td>&nbsp;</td><td></td><td></td><td></td></tr></tbody></table>
  </div>
  <div class="bot"><div class="botl">
    <table class="dt"><thead><tr><th>Numéro de dépôt</th><th>Date de dépôt</th><th>Heure</th></tr></thead>
    <tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>
    <div class="di">N° de la demande internationale et date internationale de dépôt</div>
  </div><div class="vis"><div class="visl">Visa</div></div></div>
</div>
<div class="page">
  <div class="p2h"><div class="p2logo">S</div><div class="p2n">N° ________ /DG</div><div class="p2m">Classement : 0.003.5/20<br/>Référence &nbsp;: E-063<br/>Page &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 3 de 3</div></div>
  <div class="cert">Demande de certificat d'addition rattachée au brevet principal n°&nbsp;<span class="ul">${bretNum || "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}</span>&nbsp;&nbsp; du &nbsp;<span class="ul">${bretDate || "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}</span></div>
  <div class="mw"><div class="ml"><div class="ft">[74] - MANDATAIRE : <em>Nom, Prénom, Adresse</em></div><div class="fv">${mand1}${mand2}</div></div><div class="mr">Date du pouvoir :<br/>${mandDate}</div></div>
  <table class="rt"><tr><td style="width:30%">Le préposé à la réception</td><td style="width:35%">Fait à :&nbsp;&nbsp;&nbsp;&nbsp; le :</td><td style="width:35%;font-style:italic;font-size:8.5pt;line-height:1.6">Signature et cachet<br/><small>Qualité du signataire<br/>pour les personnes morales</small></td></tr></table>
  <div class="ab"><div class="al">Autres informations</div><div class="av">${autresInfo}</div></div>
  <div class="brd">
    <div class="brt">BORDEREAU DES PIÈCES DÉPOSÉES *</div>
    <div class="brc">
      <div>
        <p>${pCI} Copie de la demande internationale</p><p>${pMN} Mémoire descriptif en langue nationale</p>
        <p>${pMF} Mémoire descriptif original en langue française &nbsp; Planche(s)</p>
        <p>${pMFD} Mémoire descriptif duplicata en langue française &nbsp; Planche(s)</p>
        <p>${pDO} Dessin(s) original (aux) &nbsp; Planche(s)</p><p>${pDD} Dessin(s) duplicata (aux) &nbsp; Planche(s)</p>
      </div>
      <div>
        <p>${pAB} Abrégé descriptif</p><p>${pPO} Pouvoir</p><p>${pPR} Document de priorité</p>
        <p>${pCS} Cession de priorité</p><p>${pTI} Titre ou justification du paiement de taxes</p>
      </div>
    </div>
  </div>
  <p class="ftx">Les demandes doivent être remises ou adressées par pli postal recommandé avec demande d'avis de réception, à l'Institut National Algérien de la Propriété Industrielle (INAPI) dont les coordonnées sont indiquées ci-dessous.</p>
  <p class="ftx">Le paiement des taxes exigibles peut être effectué soit directement auprès de la caisse de l'INAPI soit par virement bancaire au compte : BEA 12 Avenue AMIROUCHE, Alger : n° 00200012120326641801</p>
  <div class="coo"><strong>Coordonnées de l'INAPI :</strong><br/>Adresse : 42, rue Larbi BEN MHIDI, 5ème étage, B.P. 403 Alger Gare<br/>Tél : (021) 73 55 74 &nbsp; Fax : (021) 73 96 44 et (021) 73 55 81<br/>E-mail : brevet@inapi.dz, info@inapi.dz — Web : www.inapi.dz</div>
  <div class="lit">Le présent formulaire doit être lithographié</div>
  <div class="nop">A NE PAS PLIER</div>
  <div class="ast">* Cocher les cases correspondantes</div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
  console.log("Inventeurs:", f.inventeur);
  console.log( f);

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);

  if (mode === "download") {
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `demande_INAPI.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    window.open(url, "_blank");
  }
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AgentDemandes() {
  const [demandes, setDemandes]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState({ ...EMPTY });
  const [search, setSearch]       = useState("");

  const load = async () =>{
    try{
      const res = await getDemandeBrevets();
      setDemandes(res.results ?? res);
    } catch{
      console.log("Erreur de chergement des demandes")
    }
  }
  useEffect(() => {
    load();
  }, []);

  const setField = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd  = () => { setEditId(null); setForm({ ...EMPTY }); setShowModal(true); };
  const openEdit = (d) => { setEditId(d.id_demande); setForm({ ...EMPTY, 
    nature_brevet: d.nature === "Brevet d'invention",
    nature_pct: d.nature === "Extension PCT",
    nature_certificat: d.nature === "Certificat d'addition",
    titre: d.titre || "",
    num_depot: d.num_depo || "",
    priorite_date: d.date_depo || "",
    priorite_pays: d.pays_origine || "",
    brevet_principal_num: d.numdemande_CA || "",
    brevet_principal_date: d.date_CA || "",
    mandataire_nom: d.mandataire || "",
    mandataire_date_pouvoir: d.date_pouvoir || "",
    autres_informations: d.autre_info || "",
    prepose_reception: d.prepose_reception || "",
    lieu_reception: d.lieu_reception || "",
    date_reception: d.date_reception || "",

    deposant_nom:           d.deposant?.[0]?.nom_dep || "",
    deposant_prenom:        d.deposant?.[0]?.prenom_dep || "",
    deposant_denomination:  d.deposant?.[0]?.denomination || "",
    deposant_adresse:       d.deposant?.[0]?.adresse_dep || "",
    deposant_nationalite:   d.deposant?.[0]?.nationalite || "",
  }); setShowModal(true); };

  const handleSave = async () => {
    console.log("handle save")
    console.log("form:", form)
    const natureLbl = form.nature_brevet ? "Brevet d'invention"
      : form.nature_pct ? "Extension PCT"
      : form.nature_certificat ? "Certificat d'addition" : "—";
     console.log("brevet", natureLbl)

      const payload = {
     titre:             form.titre || "—",
     nature:            natureLbl,
     num_depo:          Number(form.priorite_num_depot) || 0,
     date_depo:         form.priorite_date || null,
     pays_origine:      form.priorite_pays || "",
     numdemande_CA:     Number(form.brevet_principal_num) || 0,
     date_CA:           form.brevet_principal_date || null,
     mandataire:        [form.mandataire_nom, form.mandataire_prenom].filter(Boolean).join(" "),
     date_pouvoir:      form.mandataire_date_pouvoir || null,
     autre_info:        form.autres_informations || "",
     statut:            "non_valider",
  };
   console.log("payload:", payload)

    try{
      console.log("6 - dans le try")
    if (editId !== null) {
      console.log("7 - mode édition")
      await updateDemandeBrevet(editId, payload);
      console.log("editID: ", editId)

      const demandeActuelle = demandes.find(d=> d.id_demande ==editId)
      const deposantExistant = demandeActuelle?.deposant?.[0]

      if (deposantExistant){
       await api.patch(`deposants/${deposantExistant.id_dep}/`, {
       nom_dep:      form.deposant_nom,
       prenom_dep:   form.deposant_prenom,
       denomination: form.deposant_denomination,
       adresse_dep:  form.deposant_adresse,
       nationalite:  form.deposant_nationalite,
    })
  } else {
    // ← pas de déposant → on en crée un
    await api.post("deposants/", {
      nom_dep:      form.deposant_nom,
      prenom_dep:   form.deposant_prenom,
      denomination: form.deposant_denomination,
      adresse_dep:  form.deposant_adresse,
      nationalite:  form.deposant_nationalite,
      id_demande:   editId
    })
    }} else {
       console.log("7 - mode ajout")
      const nouvelleDemande =await addDemandeBrevet(payload)
      console.log("demande cree:", nouvelleDemande)
      
      await api.post("deposants/",{
        nom_dep: form.deposant_nom,
        prenom_dep: form.deposant_prenom,
        denomination: form.deposant_denomination,
        adresse_dep: form.deposant_adresse,
        nationalite: form.deposant_nationalite,
        id_demande: nouvelleDemande.id_demande, // Associer le déposant à la demande créée 
      })
      console.log("deposant cree")
    } await load()
     setShowModal(false)
    } catch (err){
      console.log("ERREUR: ",err)
      console.log("ERREUR response: ", err.response?.data)
    }
  }

  const handleDelete = async (id) => {
   if (!window.confirm ("Etes-vous sûr de vouloir supprimer cette demande ?")) return
   try{
    await deleteDemandeBrevet(id)
    await load()
   } catch{
    console.log("Erreur de suppression")
   }
  };

  const filtered = demandes.filter((d) =>{
    const deposantStr = Array.isArray(d.deposant)
    ? d.deposant.map(dep => `${dep.nom_dep} ${dep.prenom_dep}`).join(" ")
    : ""
    return [deposantStr, d.titre, d.nature]
      .some((v) => (v || "").toLowerCase().includes(search.toLowerCase()))
});

  const badgeCls = (s) =>
    s === "ACCEPTER" ? "badge green" : s === "REFUSER" ? "badge red" : "badge orange";

  return (
    <>
      {/* ── TABLE ──────────────────────────────────────────────────── */}
      <div className="dem-page">
        <div className="dem-header">
          <div>
            <h2 className="dem-title">Demandes de Protection</h2>
          </div>
          <button className="dem-add-btn" onClick={openAdd}>+ Ajouter une demande</button>
        </div>

        <div className="dem-card">
          <div className="dem-toolbar">

            {/* ── Search avec icône MUI ── */}
<div className="dem-search-wrap">
  <span style={{
    position: "absolute",
    left: 11,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    color: "#F88F22",
  }}>
    <SearchIcon sx={{ fontSize: 18 }} />
  </span>
  <input
    className="dem-search"
    placeholder="Rechercher par déposant, titre, nature…"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

            <span className="dem-count">{filtered.length} demande(s)</span>
          </div>

          <div className="dem-table-wrap">
            <table className="dem-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Déposant</th>
                  <th>Titre</th>
                  <th>Nature</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="dem-empty">Aucune demande enregistrée</td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d.id_demande}>
                      <td>{d.date_CA}</td>
                      <td>{Array.isArray(d.deposant) ? d.deposant.map(dep => `${dep.nom_dep} ${dep.prenom_dep}`).join(", ") :  "—"}</td>
                      <td className="dem-titre-cell">{d.titre}</td>
                      <td>{d.nature}</td>
                      <td><span className={badgeCls(d.statut)}>{d.statut}</span></td>
                      <td className="dem-actions">
                        <button className="act-btn edit"  title="Modifier"    onClick={() => openEdit(d)}>
                          <EditIcon sx={{ fontSize: 17 }} />
                        </button>
                        <button className="act-btn print" title="Imprimer"    onClick={() => buildAndOpen(d, "print")}>
                          <PrintIcon sx={{ fontSize: 17 }} />
                        </button>
                        <button className="act-btn dl"    title="Télécharger" onClick={() => buildAndOpen(d, "download")}>
                          <DownloadIcon sx={{ fontSize: 17 }} />
                        </button>
                        <button className="act-btn del"   title="Supprimer"   onClick={() => handleDelete(d.id)}>
                          <DeleteIcon sx={{ fontSize: 17 }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL ──────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="dem-overlay"
          onClick={(e) => e.target.classList.contains("dem-overlay") && setShowModal(false)}
        >
          <div className="dem-modal">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-header-icon">📋</div>
                <div>
                  <h3>{editId ? "Modifier la demande" : "Nouvelle demande de protection"}</h3>
                  <p>Formulaire officiel INAPI — R2-FO-03</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <Sec num="01" label="Nature de la demande *">
                <div className="check-row">
                  <CL name="nature_brevet"     checked={!!form.nature_brevet}     onChange={setField} label="Brevet d'invention" />
                  <CL name="nature_pct"        checked={!!form.nature_pct}        onChange={setField} label="Extension PCT" />
                  <CL name="nature_certificat" checked={!!form.nature_certificat} onChange={setField} label="Certificat d'addition" />
                </div>
              </Sec>

              <Sec num="71" label="[71] — DÉPOSANT(S)">
                <div className="modal-grid">
                  <F label="Nom"              name="deposant_nom"          value={form.deposant_nom}          onChange={setField} />
                  <F label="Prénom"           name="deposant_prenom"       value={form.deposant_prenom}       onChange={setField} />
                  <F label="Dénomination"     name="deposant_denomination" value={form.deposant_denomination} onChange={setField} full />
                  <F label="Adresse complète" name="deposant_adresse"      value={form.deposant_adresse}      onChange={setField} full area />
                  <F label="Nationalité"      name="deposant_nationalite"  value={form.deposant_nationalite}  onChange={setField} />
                </div>
              </Sec>

              <Sec num="72" label="[72] — INVENTEUR(S)">
                <div className="modal-grid">
                  <F label="Nom"     name="inventeur_nom"     value={form.inventeur_nom}     onChange={setField} />
                  <F label="Prénom"  name="inventeur_prenom"  value={form.inventeur_prenom}  onChange={setField} />
                  <F label="Adresse" name="inventeur_adresse" value={form.inventeur_adresse} onChange={setField} full area />
                </div>
              </Sec>

              <Sec num="54" label="[54] — TITRE DE L'INVENTION">
                <div className="modal-grid">
                  <F label="Titre complet" name="titre" value={form.titre} onChange={setField} full area />
                </div>
              </Sec>

              <Sec num="30" label="[30] — REVENDICATION DE PRIORITÉ">
               <div className="modal-grid">
                <F label="Date de dépôt"  name="priorite_date" value={form.priorite_date} onChange={setField} type="date" />
                <F label="Numero de dépôt" name="Numero de dépôt"  value={form.Numero_de_dépôt}  onChange={setField} />
                <F label="Pays d'origine" name="priorite_pays"  value={form.priorite_pays}  onChange={setField} />
               </div>
              </Sec>

              <Sec num="+" label="Certificat d'addition — Brevet principal">
                <div className="modal-grid">
                  <F label="N° du brevet principal" name="brevet_principal_num"  value={form.brevet_principal_num}  onChange={setField} />
                  <F label="Date"                   name="brevet_principal_date" value={form.brevet_principal_date} onChange={setField} type="date" />
                </div>
              </Sec>

              <Sec num="74" label="[74] — MANDATAIRE">
                <div className="modal-grid">
                  <F label="Nom"             name="mandataire_nom"          value={form.mandataire_nom}          onChange={setField} />
                  <F label="Prénom"          name="mandataire_prenom"       value={form.mandataire_prenom}       onChange={setField} />
                  <F label="Adresse"         name="mandataire_adresse"      value={form.mandataire_adresse}      onChange={setField} full area />
                  <F label="Date du pouvoir" name="mandataire_date_pouvoir" value={form.mandataire_date_pouvoir} onChange={setField} type="date" />
                </div>
              </Sec>

              <Sec num="ℹ" label="Autres informations">
                <div className="modal-grid">
                  <F label="Informations complémentaires" name="autres_informations" value={form.autres_informations} onChange={setField} full area rows={3} />
                </div>
              </Sec>

              <Sec num="📎" label="Bordereau des pièces déposées *">
                <div className="pieces-grid">
                  {[
                    ["piece_copie_int",      "Copie de la demande internationale"],
                    ["piece_memoire_nat",    "Mémoire descriptif en langue nationale"],
                    ["piece_memoire_fr",     "Mémoire descriptif original (français)"],
                    ["piece_memoire_fr_dup", "Mémoire descriptif duplicata (français)"],
                    ["piece_dessins_orig",   "Dessin(s) original(aux)"],
                    ["piece_dessins_dup",    "Dessin(s) duplicata(aux)"],
                    ["piece_abrege",         "Abrégé descriptif"],
                    ["piece_pouvoir",        "Pouvoir"],
                    ["piece_priorite",       "Document de priorité"],
                    ["piece_cession",        "Cession de priorité"],
                    ["piece_titre",          "Titre / justification paiement taxes"],
                  ].map(([n, lbl]) => (
                    <label key={n} className="piece-item">
                      <input type="checkbox" name={n} checked={!!form[n]} onChange={setField} />
                      <span>{lbl}</span>
                    </label>
                  ))}
                </div>
              </Sec>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-save"   onClick={handleSave}>
                {editId ? "💾  Enregistrer les modifications" : "✅  Enregistrer la demande"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function Sec({ num, label, children }) {
  return (
    <div className="modal-section">
      <div className="section-title">
        <span className="section-num">{num}</span>{label}
      </div>
      {children}
    </div>
  );
}

function F({ label, name, value, onChange, type = "text", full, area, rows = 2 }) {
  return (
    <div className={`fg${full ? " full" : ""}`}>
      <label>{label}</label>
      {area
        ? <textarea name={name} value={value} onChange={onChange} rows={rows} />
        : <input type={type} name={name} value={value} onChange={onChange} />
      }
    </div>
  );
}

function CL({ name, checked, onChange, label }) {
  return (
    <label className="chk-label">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

//bon j'ai l'imprimé de demande brevets qui s'affiche que le deposant titre de l'invention et le mandataire, sachant que je veut d'autres champs comme inventeur mais ca ne veut pas s'afficher et la tabe 