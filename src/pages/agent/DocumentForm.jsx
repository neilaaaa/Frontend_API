import { useEffect, useState, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./documents.css";
import { getTousBrevets } from "../../features/brevets/brevetApi";

export default function DocumentForm({
  onSubmit,
  editData,
  onCancel,
  brevetPreselect,
}) {
  const fileRef = useRef();

  const [form, setForm] = useState({
    id_brevet: "", nom_document: "", type_document: "", autre_type:"",
    description: "", date_ajout: "",  date_sortie_officielle:"", fichier: null,
  });
  const [brevets, setBrevets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrevets = async ()=>{
      try{
        const res =await getTousBrevets()
        console.log("total brevets:", res.length)
        setBrevets(res)

        if (editData) {
        setForm({
        id_brevet:    editData.id_brevet,
        nom_document:  editData.nom_document  || "",
        type_document: editData.type_document || "",
        autre_type: editData.autre_type || "",
        description:   editData.description   || "",
        date_ajout:    editData.date_ajout    || "",
        date_sortie_officielle: editData.date_sortie_officielle    || "",
        fichier:       editData.fichier       || null,
      });
    } else {
      setForm({ id_brevet: brevetPreselect || "", nom_document: "", type_document: "", description: "", date_ajout: "", fichier: null });
    }}catch {
        console.error("Erreur chargement brevets");
      }
    };
    fetchBrevets();
     }, [editData])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,
        fichier: file,
      });
    }
  };

  const handleRemoveFile = () => {
    setForm({
      ...form,
      fichier: null,
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const resetForm = () => {
    setForm(emptyForm);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const formData = new FormData()
    formData.append("nom_document",  form.nom_document)
    formData.append("type_document", form.type_document)
    formData.append("autre_type", form.type_document === "autre" ? form.autre_type || "": "")
    formData.append("description",   form.description)
    formData.append("id_brevet",     form.id_brevet)
    formData.append("date_sortie_officielle", form.date_sortie_officielle)
    formData.append("date_ajout", form.date_ajout)
    if (form.fichier instanceof File) {
      formData.append("fichier", form.fichier) 
    }
    console.log("formData autre_type:", form.autre_type)
     console.log("formData type_document:", form.type_document)
    await onSubmit(formData)  

    if (!editData) {
      setForm(emptyForm)
      if (fileRef.current) fileRef.current.value = ""
    }
  } catch {
    setError("Erreur lors de l'enregistrement.")
  } finally {
    setLoading(false)
  }
}

  const handleCancel = () => {
    setForm(emptyForm);
    if (fileRef.current) fileRef.current.value = "";
    if (onCancel) onCancel();
  };

  const fileName = form.fichier instanceof File
    ? form.fichier.name
    : null;

  const existingFile =
    editData?.fichier && typeof editData.fichier === "string"
      ? editData.fichier.split("/").pop()
      : null;

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Modifier document" : "Ajouter document"}</h3>

      {error && <p className="form-error-inline">{error}</p>}

      <label className="field-label">Brevet lié</label>
      <select name="id_brevet" value={form.id_brevet} onChange={handleChange} >
        <option value="">Sélectionner un brevet</option>
        {brevets.map((b) => <option key={b.id_brevet} value={b.id_brevet}>{b.titre}-N°{b.num_brevet}</option>)}
      </select>

      <label className="field-label">Nom document</label>
      <input
        name="nom_document"
        value={form.nom_document}
        onChange={handleChange}
        placeholder="Nom du document"
        required
      />

      <label className="field-label">Type de document</label>
      <select name="type_document" value={form.type_document} onChange={handleChange} required>
       <option value="">Choisir un type</option>
       <option value="brevet">Brevet</option>
       <option value="paiement">Bon de paiement</option>
       <option value="Memoire Descriptif">Memoire Descriptif</option>
       <option value="autre">Autre</option>
      </select>
      {form.type_document === "autre" && (
        <input name="autre_type" value={form.autre_type|| ""} onChange={handleChange} placeholder="Preciser le type..." type="text"/>
      )}

      <label className="field-label">Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description du document" rows="3" />

      {form.type_document === "brevet" && (
        <>
        <label className="field-label">Date Officiel sortie brevet</label>
        <input type="date" name=" date_sortie_officielle" value={form.date_sortie_officielle} onChange={handleChange} required />
      </>
      )}

      <label className="field-label">Date ajout</label>
      <input
        type="date"
        name="date_ajout"
        value={form.date_ajout}
        onChange={handleChange}
        required
      />

      <label className="field-label">Fichier</label>
      <input
        ref={fileRef}
        type="file"
        id="file-upload"
        accept="*/*"
        className="file-input-hidden"
        onChange={handleFile}
      />

      {!fileName ? (
    
        existingFile && (
          <p className="form-note">
              Fichier actuel : <strong>{existingFile}</strong>
            </p>
        )

      ) : (
        <div className="file-selected-row">
          <AttachFileIcon className="inline-icon-accent small" />

          <span className="file-selected-name">{fileName}</span>

          <label
            htmlFor="file-upload"
            className="file-change-btn"
            title="Changer le fichier"
          >
            <ChangeCircleOutlinedIcon style={{ fontSize: 16 }} />
            Changer
          </label>

          <button
            type="button"
            className="file-remove-btn"
            onClick={handleRemoveFile}
            title="Supprimer le fichier"
          >
            <DeleteOutlineIcon style={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      <button type="submit" disabled={loading}>{loading ? "Enregistrement..." : editData ? "Enregistrer": "Ajouter"}</button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}
