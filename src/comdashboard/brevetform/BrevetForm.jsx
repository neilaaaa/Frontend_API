import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrevetForm.css";
export default function BrevetForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    numero: "",
    deposant: "",
    inventeur: "",
    titre: "",
    date: "",
    pays: "",
    type: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/print", { state: form });
  };

  return (
    <div className="form-container">
      <h2>Formulaire Brevet</h2>

      <form onSubmit={handleSubmit}>
        <input name="numero" placeholder="Numéro" onChange={handleChange} />
        <input name="deposant" placeholder="Déposant" onChange={handleChange} />
        <input name="inventeur" placeholder="Inventeur" onChange={handleChange} />
        <input name="titre" placeholder="Titre invention" onChange={handleChange} />
        <input type="date" name="date" onChange={handleChange} />
        <input name="pays" placeholder="Pays" onChange={handleChange} />

        <h4>Type de demande</h4>

        <label>
          <input type="radio" name="type" value="brevet" onChange={handleChange} />
          Brevet d'invention
        </label>

        <label>
          <input type="radio" name="type" value="extension" onChange={handleChange} />
          Extension PCT
        </label>

        <label>
          <input type="radio" name="type" value="certificat" onChange={handleChange} />
          Certificat
        </label>

        <button type="submit">Aperçu / Imprimer</button>
      </form>
    </div>
  );
}