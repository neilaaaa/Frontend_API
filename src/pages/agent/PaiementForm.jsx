import { useEffect, useState } from "react";
import { getTousBrevets } from "../../features/brevets/brevetApi";

export default function PaiementForm({ onSubmit, editData, onCancel }) {
  const emptyForm = {
    id_brevet: "",
    date_paiement: "",
    montant_total: "",
    statut: "non_payer",
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
        id_brevet:    editData.id_brevet ?? "",
        date_paiement: editData.date_paiement ?? "",
        montant_total: editData.montant_total ?? "",
        statut      :  editData.statut ?? "non_payer",
      });
    } else {
      setForm(emptyForm);
    }}catch {
        console.error("Erreur chargement brevets");
      }
    };
     fetchBrevets();
   }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
     try {
      const payload = {
        id_brevet: form.id_brevet || null,
        date_paiement: form.date_paiement,
        montant_total: parseFloat(form.montant_total),
        statut:        form.statut,
      };
      await onSubmit(payload);
      if (!editData) setForm(emptyForm);
    } catch {
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
      <h3>{editData ? " Modifier paiement" : "+ Nouveau paiement"}</h3>
      
      {error && (
        <p className="form-error-inline">{error}</p>
      )}

      <div className="field-stack">
        <label className="field-label-soft">Titre du brevet</label>
        <select
          name="id_brevet"
          placeholder="Ex : Brevet"
          value={form.id_brevet}
          onChange={handleChange}
          required
        > 
        <option value=""> Sélectionner un brevet </option>
          {brevets.map((b) => (
            <option key={b.id_brevet} value={b.id_brevet}>
              {b.titre} — N°{b.num_brevet}
            </option>
          ))}
        </select>
      </div>

      <div className="field-stack">
        <label className="field-label-soft">Date de paiement</label>
        <input
          type="date"
          name="date_paiement"
          value={form.date_paiement}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field-stack">
        <label className="field-label-soft">Montant total (DA)</label>
        <input
          type="number"
          name="montant_total"
          placeholder="Ex : 1500"
          value={form.montant_total}
          onChange={handleChange}
          min="0"
          step="1000"
          required
        />
      </div>

      <div className="field-stack">
        <label className="field-label-soft">Statut</label>
        <select name="statut" value={form.statut} onChange={handleChange}>
          <option value="non_payer">Non payé</option>
          <option value="payer">Payé</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>{loading ? "Enregistrement..." : editData ? "Enregistrer": "Ajouter"}</button>

      {editData && (
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          Annuler
        </button>
      )}
    </form>
  );
}
