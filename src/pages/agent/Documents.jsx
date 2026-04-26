import { useEffect, useState } from "react";
import Datatable2 from "../../components/Datatable2";
import DocumentForm from "./DocumentForm";
import "./documents.css";
import { getDocuments, deleteDocument, addDocument, updateDocument } from "../../features/documents/documentApi";
import { useNavigate } from "react-router-dom";

export default function AgentDocuments() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError]=useState("");
  const [loading, setLoading] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);

  const load = async () =>{
    try{
      setLoading(true);
      setError("");
      const res = await getDocuments();
      setData (res.results || res);  
    } catch{
      setError("Erreur de chargement des documents");
    } finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    load()
  }, [])
 
  const handleSubmit = async (doc) => {
      setError("")
      setLoading(true)
      try{
       if (editDoc) {
       await updateDocument(editDoc.id, doc)
       setEditDoc(null)
       } else {
        if (Array.isArray(doc)){
         for (const t of doc){ await addDocument(t)}; 
        } else {
        await addDocument(doc);
        }
      }
        await load()
     }catch{
      setError("Erreur d'enregitrement");
    } finally{
      setLoading(false);
    }

     }

    const handleDelete = async (row) =>{
      try{
        await deleteDocument(row.id_document)
        await load()
      }catch{
      setError("Erreur de suppression");
    }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <>
      <Datatable2
        title="Gestion des documents"
        exportName="documents"
        data={data}
        columns={[
          { key: "nom_document", label: "Nom document" },
          { key: "id_type", label: "Type",
             render:(value)=> Array.isArray(value)
             ? value.map(i => `${i.nom_type}`).join(", "): "Aucun" , },
          { key: "categorie", label: "Catégorie" },
          { key: "date_ajout", label: "Date ajout" },
        ]}
        form={
          <DocumentForm
            key={editDoc ? editDoc.id_document : "new"}
            editData={editDoc}
            onSubmit={handleSubmit}
            onCancel={() => setEditDoc(null)}
          />
        }
        onEdit={(row) => setEditDoc(row)}
        onDelete= {handleDelete}
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
  const docsLies = allDocuments.filter((d) => d.id_brevet === doc.brevet_brevet);

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