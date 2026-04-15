import { useEffect, useState } from "react";
import "./documents.css";

const TYPES_DOCUMENT = [
  "Mémoire descriptif",
  "Reçu paiement",
  "Demande brevet",
  "Recours",
  "Rapport d'examen",
  "Certificat",
  "Autre",
];

const CATEGORIES = ["brevet", "paiement", "demande", "recours"];

const BREVETS = [
  "Brevet FR-2024-001",
  "Brevet FR-2024-002",
  "Brevet FR-2024-003",
];

export default function DocumentForm({ onSubmit, editData, onCancel, brevetPreselect }) {
  const emptyDoc = () => ({
    uid: Date.now() + Math.random(),
    nom_document: "",
    type_document: "",
    categorie: "",
    description: "",
    fichier: "",
    date_ajout: "",
  });

  const [brevet_lie, setBrevet] = useState("");
  const [documents, setDocuments] = useState([emptyDoc()]);

  useEffect(() => {
    if (editData) {
      setBrevet(editData.brevet_lie);
      setDocuments([
        {
          uid: editData.id,
          nom_document: editData.nom_document,
          type_document: editData.type_document,
          categorie: editData.categorie,
          description: editData.description,
          fichier: editData.fichier,
          date_ajout: editData.date_ajout,
        },
      ]);
    } else {
      setBrevet(brevetPreselect || "");
      setDocuments([emptyDoc()]);
    }
  }, [editData, brevetPreselect]);

  const handleDocChange = (uid, field, value) => {
    setDocuments((prev) =>
      prev.map((d) => (d.uid === uid ? { ...d, [field]: value } : d))
    );
  };

  const addDocument = () => {
    setDocuments((prev) => [...prev, emptyDoc()]);
  };

  const removeDocument = (uid) => {
    if (documents.length === 1) return;
    setDocuments((prev) => prev.filter((d) => d.uid !== uid));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brevet_lie) return;

    documents.forEach((doc, index) => {
      onSubmit({
        id: editData && index === 0 ? editData.id : Date.now() + index,
        brevet_lie,
        nom_document: doc.nom_document,
        type_document: doc.type_document,
        categorie: doc.categorie,
        description: doc.description,
        fichier: doc.fichier,
        date_ajout: doc.date_ajout,
      });
    });

    if (!editData) {
      setBrevet("");
      setDocuments([emptyDoc()]);
    }
  };

  const handleCancel = () => {
    setBrevet("");
    setDocuments([emptyDoc()]);
    if (onCancel) onCancel();
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Modifier document" : "Ajouter documents"}</h3>

      <label className="field-label">Brevet lié</label>
      <select
        value={brevet_lie}
        onChange={(e) => setBrevet(e.target.value)}
        required
        disabled={!!editData}
      >
        <option value="">Sélectionner un brevet</option>
        {BREVETS.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <div className="docs-list">
        {documents.map((doc, index) => (
          <div key={doc.uid} className="doc-card">

            <div className="doc-card-header">
              <span className="doc-card-title">Document {index + 1}</span>
              {documents.length > 1 && (
                <button
                  type="button"
                  className="fichier-remove"
                  onClick={() => removeDocument(doc.uid)}
                >
                  ✕ Supprimer
                </button>
              )}
            </div>

            <input
              placeholder="Nom du document"
              value={doc.nom_document}
              onChange={(e) => handleDocChange(doc.uid, "nom_document", e.target.value)}
              required
            />

            <select
              value={doc.type_document}
              onChange={(e) => handleDocChange(doc.uid, "type_document", e.target.value)}
              required
            >
              <option value="">Type de document</option>
              {TYPES_DOCUMENT.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={doc.categorie}
              onChange={(e) => handleDocChange(doc.uid, "categorie", e.target.value)}
              required
            >
              <option value="">Catégorie</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={doc.description}
              onChange={(e) => handleDocChange(doc.uid, "description", e.target.value)}
              rows="2"
            />

            <input
              type="date"
              value={doc.date_ajout}
              onChange={(e) => handleDocChange(doc.uid, "date_ajout", e.target.value)}
              required
            />

            <input
              type="file"
              onChange={(e) =>
                handleDocChange(doc.uid, "fichier", e.target.files[0] || "")
              }
            />

            {doc.fichier && (
              <span className="fichier-name">
                📎 {doc.fichier instanceof File ? doc.fichier.name : doc.fichier}
              </span>
            )}

          </div>
        ))}
      </div>

      {!editData && (
        <button type="button" className="fichier-add" onClick={addDocument}>
          + Ajouter un autre document
        </button>
      )}

      <button type="submit">
        {editData ? "Modifier" : `Ajouter ${documents.length > 1 ? `(${documents.length} documents)` : ""}`}
      </button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}