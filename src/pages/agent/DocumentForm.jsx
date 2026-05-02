import { useEffect, useState, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./documents.css";

const TYPES_DOCUMENT = ["PDF", "Word", "Image", "Texte", "Autre"];

export default function DocumentForm({
  onSubmit,
  editData,
  onCancel,
  brevetPreselect,
  brevets = [],
}) {
  const fileRef = useRef();

  const emptyForm = {
    id_brevet: "",
    nom_document: "",
    type_document: "",
    description: "",
    date_ajout: "",
    fichier: null,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editData) {
      setForm({
        id_brevet: editData.id_brevet || editData.brevet_lie || "",
        nom_document: editData.nom_document || "",
        type_document: editData.type_document || "",
        description: editData.description || "",
        date_ajout: editData.date_ajout || "",
        fichier: editData.fichier || null,
      });
    } else {
      setForm({
        ...emptyForm,
        id_brevet: brevetPreselect || "",
      });
    }
  }, [editData, brevetPreselect]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...(editData || {}),
      ...form,
    });

    if (!editData) {
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();

    if (onCancel) {
      onCancel();
    }
  };

  const fileName =
    form.fichier instanceof File
      ? form.fichier.name
      : typeof form.fichier === "string" && form.fichier !== ""
      ? form.fichier
      : null;

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Modifier document" : "Ajouter document"}</h3>

      <label className="field-label">Brevet lié</label>
      <select
        name="id_brevet"
        value={form.id_brevet}
        onChange={handleChange}
        required
        disabled={!!editData}
      >
        <option value="">Sélectionner un brevet</option>

        {brevets.map((b) => (
          <option key={b.id_brevet} value={b.id_brevet}>
            {b.titre || b.nom_brevet || `Brevet ${b.id_brevet}`}
          </option>
        ))}
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
      <select
        name="type_document"
        value={form.type_document}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionner un type</option>

        {TYPES_DOCUMENT.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label className="field-label">Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description du document"
        rows="3"
      />

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
        style={{ display: "none" }}
        onChange={handleFile}
      />

      {!fileName ? (
        <label htmlFor="file-upload" className="file-select-btn">
          <AttachFileIcon style={{ fontSize: 16 }} />
          Sélectionner un fichier
        </label>
      ) : (
        <div className="file-selected-row">
          <AttachFileIcon style={{ fontSize: 15, color: "#EA6113" }} />

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

      <button type="submit">
        {editData ? "Enregistrer" : "Ajouter"}
      </button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}