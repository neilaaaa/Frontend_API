import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editBrevet.css";
import { updateBrevet, getBrevetById } from "../../features/brevets/brevetApi";

export default function EditBrevet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrevet = async () => {
      try {
        setLoading(true);
        const data = await getBrevetById(id);
        setForm(data);
      } catch {
        setError("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchBrevet();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await updateBrevet(id, {
        ...form,
        num_brevet: Number(form.num_brevet),
        num_depo: Number(form.num_depo),
      });
      navigate("/agent/brevets");
    } catch {
      setError("Erreur lors de la modification.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!form) return <p>Brevet introuvable</p>;

  return (
    <div className="brevet-page">
      <div className="brevet-card">
        <h2 className="brevet-title">Modifier le brevet</h2>

        <div className="brevet-grid">
          <label> Num brevet </label>
          <input name="num_brevet" value={form.num_brevet ?? ""} onChange={handleChange} />

          <label>Titre</label>
          <input name="titre" value={form.titre ?? ""} onChange={handleChange} />

          <label>Num dÃ©pÃ´t</label>
          <input name="num_depo" value={form.num_depo ?? ""} onChange={handleChange} />

          <label>Date dÃ©pÃ´t</label>
          <input type="date" name="date_depo" value={form.date_depo ?? ""} onChange={handleChange} />

          <label>Date sortie</label>
          <input type="date" name="date_sortie" value={form.date_sortie ?? ""} onChange={handleChange} />

          <label>Titulaire</label>
          <input name="titulaire" value={form.titulaire ?? ""} onChange={handleChange} />

          <label>Inventeur</label>
          <input name="nom_inventeur" value={form.nom_inventeur ?? ""} onChange={handleChange} />

          <label>DÃ©posant</label>
          <input name="nom_deposant" value={form.nom_deposant ?? ""} onChange={handleChange} />

          <div className="form-group">
            <label>Statut</label>
            <select name="statut" value={form.statut} onChange={handleChange}>
              <option value="EN_ATTENTE">EN ATTENTE</option>
              <option value="ACCEPTER">ACCEPTER</option>
              <option value="REFUSER">REFUSER</option>
            </select>
          </div>
        </div>

        <div className="container_btn">
          <button className="btn-save" type="submit" onClick={handleSubmit}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
