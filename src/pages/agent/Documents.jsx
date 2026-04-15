import { useEffect, useState } from "react";
import Datatable2 from "../../components/Datatable2";
import DocumentForm from "./DocumentForm";
import "./documents.css";

export default function AgentDocuments() {
  const [data, setData] = useState([]);
  const [editDoc, setEditDoc] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);

  useEffect(() => {
    setData([
      {
        id: 1,
        nom_document: "Mémoire descriptif",
        type_document: "Mémoire descriptif",
        brevet_lie: "Brevet FR-2024-001",
        categorie: "brevet",
        description: "Description technique complète du brevet",
        fichier: "memoire_001.pdf",
        date_ajout: "2024-01-15",
      },
      {
        id: 2,
        nom_document: "Reçu paiement",
        type_document: "Reçu paiement",
        brevet_lie: "Brevet FR-2024-001",
        categorie: "paiement",
        description: "Reçu du paiement des taxes",
        fichier: "recu_001.pdf",
        date_ajout: "2024-01-20",
      },
      {
        id: 3,
        nom_document: "Formulaire demande",
        type_document: "Demande brevet",
        brevet_lie: "Brevet FR-2024-002",
        categorie: "demande",
        description: "Formulaire officiel de demande de brevet",
        fichier: "demande_002.pdf",
        date_ajout: "2024-02-10",
      },
      {
        id: 4,
        nom_document: "Recours administratif",
        type_document: "Recours",
        brevet_lie: "Brevet FR-2024-002",
        categorie: "recours",
        description: "Document de recours suite au refus",
        fichier: "recours_002.pdf",
        date_ajout: "2024-03-01",
      },
    ]);
  }, []);

  const handleSubmit = (doc) => {
    if (editDoc) {
      setData((prev) => prev.map((d) => (d.id === editDoc.id ? doc : d)));
      setEditDoc(null);
    } else {
      // doc peut être un seul objet ou plusieurs (ajout multiple)
      if (Array.isArray(doc)) {
        setData((prev) => [...prev, ...doc]);
      } else {
        setData((prev) => [...prev, doc]);
      }
    }
  };

  return (
    <>
      <Datatable2
        title="Gestion des documents"
        exportName="documents"
        data={data}
        columns={[
          { key: "nom_document", label: "Nom document" },
          { key: "type_document", label: "Type" },
          { key: "brevet_lie", label: "Brevet lié" },
          { key: "categorie", label: "Catégorie" },
          { key: "date_ajout", label: "Date ajout" },
        ]}
        form={
          <DocumentForm
            key={editDoc ? editDoc.id : "new"}
            editData={editDoc}
            onSubmit={handleSubmit}
            onCancel={() => setEditDoc(null)}
          />
        }
        onEdit={(row) => setEditDoc(row)}
        onDelete={(row) => setData((prev) => prev.filter((d) => d.id !== row.id))}
        onView={(row) => setViewDoc(row)}
      />

      {viewDoc && (
        <ViewDocumentModal
          doc={viewDoc}
          allDocuments={data}        
          onClose={() => setViewDoc(null)}
        />
      )}
    </>
  );
}

function ViewDocumentModal({ doc, allDocuments, onClose }) {
  const docsLies = allDocuments.filter((d) => d.brevet_lie === doc.brevet_lie);

  const handleDownload = (fichier) => {
  if (fichier instanceof File) {
    // Vrai fichier uploadé → téléchargement réel
    const url = URL.createObjectURL(fichier);
    const a = document.createElement("a");
    a.href = url;
    a.download = fichier.name;
    a.click();
    URL.revokeObjectURL(url);
  } else if (typeof fichier === "string" && fichier !== "") {
    // Juste un nom string → affiche un message
    alert(`Le fichier "${fichier}" n'est pas disponible en local.\nDans la version finale, il sera chargé depuis le serveur.`);
  } else {
    alert("Aucun fichier disponible.");
  }
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Documents liés — {doc.brevet_lie}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <table className="modal-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Date</th>
                <th>Télécharger</th>
              </tr>
            </thead>
            <tbody>
              {docsLies.map((d) => (
                <tr key={d.id}>
                  <td>{d.nom_document}</td>
                  <td>{d.type_document}</td>
                  <td>
                    <span className={`cat-badge cat-${d.categorie}`}>
                      {d.categorie}
                    </span>
                  </td>
                  <td>{d.description}</td>
                  <td>{d.date_ajout}</td>
                  <td>
                    {d.fichier ? (
                      <button
                        className="dl-btn"
                        onClick={() => handleDownload(d.fichier)}
                        title={`Télécharger ${d.fichier instanceof File ? d.fichier.name : d.fichier}`}
                      >
                        ⬇ {d.fichier instanceof File ? d.fichier.name : d.fichier}
                      </button>
                    ) : (
                      <span className="no-file">Aucun fichier</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="dt-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}