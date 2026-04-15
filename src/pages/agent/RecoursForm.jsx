import { useEffect, useState } from "react";

export default function RecoursForm({ onSubmit, editData, onCancel }) {
  const emptyForm = {
    id: null,
    titre_brevet: "",
    date_depot: "",
    motif: "",
    description: "",
    statut: "EN_COURS",
    date_traitement: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(editData || emptyForm);
  }, [editData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, id: form.id || Date.now() });
    if (!editData) setForm(emptyForm);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    if (onCancel) onCancel();
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Modifier recours" : "Ajouter recours"}</h3>

      <input
        name="titre_brevet"
        placeholder="Titre du brevet"
        value={form.titre_brevet}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date_depot"
        placeholder="Date de dépôt"
        value={form.date_depot}
        onChange={handleChange}
      />

      <input
        name="motif"
        placeholder="Motif"
        value={form.motif}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows="3"
      />

      <select name="statut" value={form.statut} onChange={handleChange}>
        <option value="EN_COURS">EN_COURS</option>
        <option value="TRAITE">TRAITE</option>
        <option value="REFUSE">REFUSE</option>
      </select>

      <input
        type="date"
        name="date_traitement"
        placeholder="Date de traitement"
        value={form.date_traitement}
        onChange={handleChange}
      />

      <button type="submit">{editData ? "Modifier" : "Ajouter"}</button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}