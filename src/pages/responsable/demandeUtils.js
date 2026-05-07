const g = (obj, key) => (obj && obj[key] != null ? String(obj[key]) : "");
const br = (v) => (v ? String(v).replace(/\n/g, "<br/>") : "");
const chk = (v) => (v === true || v === "true" ? "&#9745;" : "&#9744;");

export function buildAndOpen(demande, mode = "print") {
  const f = demande || {};

  const nBrevet = chk(f.nature === "Brevet d'invention");
  const nPct = chk(f.nature === "Extension PCT");
  const nCertificat = chk(f.nature === "Certificat d'addition");

  const deposant = f.deposant?.[0] || {};
  const depNom = g(deposant, "nom_dep");
  const depPren = g(deposant, "prenom_dep");
  const depDenom = g(deposant, "denomination");
  const depAdr = br(deposant.adresse_dep);
  const depNat = g(deposant, "nationalite");

  const invBlock = Array.isArray(f.inventeur)
    ? f.inventeur.map((i) => `${i.nom_inv} ${i.prenom_inv} (${i.adress_inv || i.adresse_inv || ""})`).join("<br/>")
    : "";

  const titre = g(f, "titre");
  const mandataire = br(f.mandataire);
  const datePouvoir = g(f, "date_pouvoir");
  const autresInfo = br(f.autres_informations || f.autre_info);
  const numDepo = g(f, "num_depo");
  const dateDepo = g(f, "date_depo");
  const paysOrigine = g(f, "pays_origine");
  const nature = g(f, "nature");
  const brevetNum = g(f, "num_brevet");

  const pCI = chk(f.piece_copie_int);
  const pMN = chk(f.piece_memoire_nat);
  const pMF = chk(f.piece_memoire_fr);
  const pMFD = chk(f.piece_memoire_fr_dup);
  const pDO = chk(f.piece_dessins_orig);
  const pDD = chk(f.piece_dessins_dup);
  const pAB = chk(f.piece_abrege);
  const pPO = chk(f.piece_pouvoir);
  const pPR = chk(f.piece_priorite);
  const pCS = chk(f.piece_cession);
  const pTI = chk(f.piece_titre);

  const dep1 = [depNom, depPren].filter(Boolean).join(" ");
  const dep2 = depDenom ? `<br/>${depDenom}` : "";
  const dep3 = depAdr ? `<br/>${depAdr}` : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Demande INAPI</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Times New Roman",Times,serif;font-size:10pt;color:#000;background:#fff}
.toolbar{background:#ea6113;color:#fff;padding:10px 20px;display:flex;gap:12px;align-items:center;font-family:Arial,sans-serif}
.toolbar button{background:#fff;color:#ea6113;border:none;padding:7px 16px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px}
.page{width:21cm;min-height:29.7cm;padding:1.4cm 1.7cm;margin:0 auto}
.block{border:1px solid #444;margin-bottom:14px}
.title{font-size:12px;font-style:italic;padding:4px 8px;background:#fafafa;border-bottom:1px solid #ddd}
.value{padding:8px 10px;line-height:1.5;min-height:44px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.muted{font-size:8.5pt;color:#555}
.nature{border:2px solid #000;margin-bottom:14px}
.nature h2{text-align:center;font-size:18px;padding:6px 8px;border-bottom:1px solid #000}
.nature-row{display:flex;justify-content:space-between;gap:12px;padding:10px 14px}
.footer{margin-top:18px;font-size:8pt;line-height:1.6;text-align:center}
@media print {.toolbar{display:none}.page{padding:1.2cm 1.4cm}}
</style>
</head>
<body>
<div class="toolbar">
  <span style="font-size:14px;font-weight:700">Formulaire INAPI</span>
  <button onclick="window.print()">Imprimer / PDF</button>
</div>
<div class="page">
  <div class="nature">
    <h2>Nature de la demande de protection</h2>
    <div class="nature-row">
      <div>Brevet d'invention ${nBrevet}</div>
      <div>Extension PCT ${nPct}</div>
      <div>Certificat d'addition ${nCertificat}</div>
    </div>
  </div>

  <div class="block">
    <div class="title">[71] Déposant(s)</div>
    <div class="value">${dep1}${dep2}${dep3}</div>
    <div class="value muted">Nationalité : ${depNat || "—"}</div>
  </div>

  <div class="block">
    <div class="title">[72] Inventeur(s)</div>
    <div class="value">${invBlock || "—"}</div>
  </div>

  <div class="block">
    <div class="title">[54] Titre de l'invention</div>
    <div class="value">${titre || "—"}</div>
  </div>

  <div class="grid">
    <div class="block">
      <div class="title">Priorité</div>
      <div class="value">N° dépôt : ${numDepo || "—"}<br/>Date : ${dateDepo || "—"}<br/>Pays : ${paysOrigine || "—"}<br/>Nature : ${nature || "—"}</div>
    </div>
    <div class="block">
      <div class="title">Certificat d'addition</div>
      <div class="value">Brevet principal : ${brevetNum || "—"}<br/>Date : ${dateDepo || "—"}</div>
    </div>
  </div>

  <div class="block">
    <div class="title">[74] Mandataire</div>
    <div class="value">${mandataire || "—"}<br/>Date du pouvoir : ${datePouvoir || "—"}</div>
  </div>

  <div class="block">
    <div class="title">Autres informations</div>
    <div class="value">${autresInfo || "—"}</div>
  </div>

  <div class="block">
    <div class="title">Pièces déposées</div>
    <div class="value">
      ${pCI} Copie demande internationale<br/>
      ${pMN} Mémoire descriptif langue nationale<br/>
      ${pMF} Mémoire descriptif original français<br/>
      ${pMFD} Mémoire descriptif duplicata français<br/>
      ${pDO} Dessin(s) originaux<br/>
      ${pDD} Dessin(s) duplicata<br/>
      ${pAB} Abrégé descriptif<br/>
      ${pPO} Pouvoir<br/>
      ${pPR} Document de priorité<br/>
      ${pCS} Cession de priorité<br/>
      ${pTI} Justification paiement taxes
    </div>
  </div>

  <div class="footer">
    INAPI — Formulaire de demande de protection
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  if (mode === "download") {
    const a = document.createElement("a");
    a.href = url;
    a.download = "demande_INAPI.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => {
      try {
        win.print();
      } catch {}
    };
  }
}
