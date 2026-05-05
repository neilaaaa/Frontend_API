import { useEffect, useState } from "react";
import { getTousBrevets } from "../../features/brevets/brevetApi";

export default function RecoursForm({ onSubmit, editData, onCancel }) {
  const emptyForm = {
    id_brevet: "",
    motif: "",
    description: "",
    statut: "EN_COURS",
    date_traitement: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [brevets, setBrevets] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      const fetchBrevets = async () =>{
        try{
           const res =await getTousBrevets()
          console.log("total brevets:", res.length)
          setBrevets(res)
  
          if (editData) {
          setForm({
          id_brevet:    editData.brevet?.id ?? "",
          motif:  editData.motif ?? "",
          description:  editData.description ?? "",
          statut:  editData.statut ?? "",
          date_traitement: editData.date_traitement ?? "",
        });
        } else {
        setForm(emptyForm);
      } }catch {
          console.error("Erreur chargement de recours");
        }
      };
       fetchBrevets();
     }, [editData]);

     if (editData) {
         console.log("editData complet:", editData)
         console.log("editData.id_brevet:", editData.id_brevet)
      }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      const payload={
        id_brevet: form.id_brevet || null,
        motif:       form.motif,
        description: form.description,
        statut:      form.statut,
         ...(form.date_traitement && { date_traitement: form.date_traitement }),
      }
      await onSubmit(payload);
      if (!editData) setForm(emptyForm);
    } catch (err) {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    if (onCancel) onCancel();
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h3>{editData ? "Modifier recours" : "Ajouter recours"}</h3>

      <label>Brevet</label>
      <select
        name="id_brevet"
        value={form.id_brevet}
        onChange={handleChange}
        required
      >
        <option value=""> Sélectionner un brevet</option>
        {brevets.map((b) => (
          <option key={b.id_brevet} value={b.id_brevet}>
            {b.titre} — N°{b.num_brevet}
          </option>
        ))}
      </select>

      <label> Motif </label>
      <input
        name="motif"
        placeholder="Motif du recours"
        value={form.motif}
        onChange={handleChange}
        required
      />

      <label> Descriptions </label>
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

      <label> Date de traitement </label>
      <input
        type="date"
        name="date_traitement"
        value={form.date_traitement}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : editData ? "Modifier" : "Ajouter"}
      </button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}