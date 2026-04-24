import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addBrevet.css"
import {addBrevet} from "/src/features/brevets/brevetApi.js";

export default function AddBrevet() {
  const navigate = useNavigate();
  const [loading, setLoading]= useState(false)
  const [error, setError]=useState("")

  const [form, setForm] = useState({
    num_brevet: "",
    titre: "",
    num_depo: "",
    date_depo: "",
    date_sortie: "",
    titulaire: "",
    Inventeur: "",
    Deposant: "",
    status: "EN_ATTENTE",
    documents: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).map(f => f.name);
    setForm({ ...form, documents: [...form.documents, ...files] });
  };

    const handleSubmit = async () => {
      setError("")
      setLoading(true)
      try{
        await addBrevet({
          ...form, // ...form "déplie" tout le contenu
          num_brevet: Number(form.num_brevet),
          num_depot: Number(form.num_depo),
        })
        navigate("/agent/brevets")
      } catch(err){
        console.log(err)
        setError("Erreur lors de l'ajout du brevet.")
      }finally{
        setLoading(false)
      }
    }; 

  return (
    <div className="form-container">
      <h2>Ajouter Brevet</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="form-grid">

        <div className="form-group">
          <label>Num brevet</label>
          <input name="num_brevet" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Titre</label>
          <input name="titre" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Num dépôt</label>
          <input name="num_depo" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Titulaire</label>
          <input name="titulaire" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date dépôt</label>
          <input type="date" name="date_depo" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date sortie</label>
          <input type="date" name="date_sortie" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Inventeur</label>
          <input name="Inventeurs" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Déposant</label>
          <input name="Deposants" onChange={handleChange} />
        </div>

        <div className="form-group full-width">
          <label>Status</label>
          <select name="status" onChange={handleChange}>
            <option value="EN_ATTENTE">EN_ATTENTE</option>
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
        <button className="btn-save" onClick={handleSubmit} disabled={loading} >
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