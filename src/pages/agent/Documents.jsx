import { useEffect, useState } from "react";
import Datatable2 from "../../components/Datatable2";
import DocumentForm from "./DocumentForm";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import "./documents.css";
import { getDocuments, deleteDocument, addDocument, updateDocument } from "../../features/documents/documentApi";
import { useNavigate } from "react-router-dom";
import { getBrevets } from "../../features/brevets/brevetApi";

export default function AgentDocuments() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [viewDoc, setViewDoc] = useState(null);
  const [brevet, setBrevet]=useState([])

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDocuments();
      setData(res.results || res);
    } catch {
      setError("Erreur de chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    getBrevets().then(res => {
    console.log("brevets reçus:", res)
    const unique = [...new Map(res.map(b => [b.id_brevet, b])).values()]
    console.log("brevets uniques:", unique)
    setBrevet(unique)
  })
    load()
  }, [])
 
  const handleSubmit = async (doc) => {
      setError("")
      setLoading(true)
      try{
       if (editDoc) {
       await updateDocument(editDoc.id_document, doc)
       setEditDoc(null)
       } else {
        if (Array.isArray(doc)){
         for (const t of doc){ await addDocument(t)}; 
        } else {
        await addDocument(doc);
      }

      await load();
    } catch {
      setError("Erreur d'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await deleteDocument(row.id_document);
      await load();
    } catch {
      setError("Erreur de suppression");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Datatable2
        title="Gestion des documents"
        exportName="documents"
        data={data}
        columns={[
          { key: "nom_document", label: "Nom document" },
          { key: "type_document", label: "Type" },
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
        onDelete={handleDelete}
        onView={(row) => setViewDoc(row)}
      />

      {viewDoc && (
        <ViewDocumentModal
          doc={viewDoc}
          onClose={() => setViewDoc(null)}
        />
      )}
    </>
  );
}

function ViewDocumentModal({ doc, onClose }) {
  const fileName =
    doc.fichier instanceof File
      ? doc.fichier.name
      : typeof doc.fichier === "string" && doc.fichier !== ""
      ? doc.fichier
      : null;

  const handleDownload = () => {
    if (doc.fichier instanceof File) {
      const url = URL.createObjectURL(doc.fichier);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fichier.name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (typeof doc.fichier === "string" && doc.fichier !== "") {
      alert(
        `Le fichier "${doc.fichier}" n'est pas disponible en local.\nDans la version finale, il sera charge depuis le serveur.`
      );
    } else {
      alert("Aucun fichier disponible.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Details du document</h3>
          <button className="modal-close" onClick={onClose}>X</button>
        </div>

        <div className="modal-body">
          <div className="view-doc-grid">
            <div className="view-doc-item">
              <span className="view-doc-label">Brevet lié</span>
              <span className="view-doc-value">
                <select name="id_brevet" value={form.id_brevet || ""} onChange={setField}></select>
                <option value="">Aucun brevet</option>
                    {brevets.map((b) => (
                     <option key={b.id_brevet} value={b.id_brevet}>
                      {b.titre}
                    </option>
                    ))}</span>
            </div>

            <div className="view-doc-item">
              <span className="view-doc-label">Nom document</span>
              <span className="view-doc-value">{doc.nom_document}</span>
            </div>

            <div className="view-doc-item">
              <span className="view-doc-label">Type</span>
              <span className="view-doc-value">{doc.type_document}</span>
            </div>

            <div className="view-doc-item">
              <span className="view-doc-label">Date ajout</span>
              <span className="view-doc-value">{doc.date_ajout}</span>
            </div>

            <div className="view-doc-item full">
              <span className="view-doc-label">Description</span>
              <span className="view-doc-value">{doc.description || "-"}</span>
            </div>

            <div className="view-doc-item full">
              <span className="view-doc-label">Fichier</span>
              {fileName ? (
                <div className="view-file-row">
                  <InsertDriveFileOutlinedIcon
                    style={{ fontSize: 16, color: "#EA6113" }}
                  />
                  <span className="view-file-name">{fileName}</span>
                  <button className="view-dl-btn" onClick={handleDownload}>
                    <DownloadIcon style={{ fontSize: 16 }} />
                    Telecharger
                  </button>
                </div>
              ) : (
                <span className="no-file">Aucun fichier joint</span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="dt-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
