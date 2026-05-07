import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addBrevet.css";
import { addBrevet } from "/src/features/brevets/brevetApi.js";

export default function AddBrevet() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    num_brevet: "",
    titre: "",
    num_depo: "",
    date_depo: "",
    date_sortie: "",
    titulaire: "",
    inventeur: "",
    deposant: "",
    statut: "EN_ATTENTE",
    documents: [],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).map((f) => f.name);
    setForm({ ...form, documents: [...form.documents, ...files] });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      console.log("test try", form)
      await addBrevet({
        num_brevet: Number(form.num_brevet),
        titre: form.titre,
        num_depo: Number(form.num_depo),
        date_depo: form.date_depo,
        date_sortie: form.date_sortie,
        titulaire: form.titulaire,
        statut: form.statut,
      });
      navigate("/agent/brevets");
    } catch (err) {
      console.error("erreur 400:", err.response?.data)
      console.log(err)
      setError("Erreur lors de l'ajout du brevet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter Brevet</h2>
      {error && <p className="page-state error">{error}</p>}

      <div className="brevet-grid">
        <div className="brevet-section-label">Identification</div>

        <div className="form-group">
          <label>Numero brevet</label>
          <input name="num_brevet" placeholder="Ex : BR-2024-001" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Titre de l'invention</label>
          <input name="titre" placeholder="Titre complet" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Numero de depot</label>
          <input name="num_depo" placeholder="Ex : DEP-2024-001" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Titulaire</label>
          <input name="titulaire" placeholder="Nom du titulaire" onChange={handleChange} />
        </div>

        <div className="brevet-section-label">Dates</div>

        <div className="form-group">
          <label>Date de depot</label>
          <input type="date" name="date_depo" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date sortie</label>
          <input type="date" name="date_sortie" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Inventeur</label>
          <input name="inventeur" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Deposant</label>
          <input name="deposant" onChange={handleChange} />
        </div>

        <div className="brevet-section-label">Statut &amp; Documents</div>

        <div className="form-group">
          <label>Statut</label>
          <select name="statut" onChange={handleChange}>
            <option value="EN_ATTENTE">EN ATTENTE</option>
            <option value="ACCEPTER">ACCEPTER</option>
            <option value="REFUSER">REFUSER</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Documents</label>
          <div className="docs-box">
            <input type="file" multiple onChange={handleFiles} />
            {form.documents.map((doc, i) => (
              <div key={i} className="doc-item">{doc}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-save" onClick={handleSubmit} disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>

        <button
          className="btn-cancel"
          onClick={() => navigate("/agent/brevets")}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
