import React, { useState, useEffect } from 'react';
import './EditBrevet.css';

export default function EditBrevet({ initialData }) {
  // initialData = objet contenant le brevet existant
  const [formData, setFormData] = useState({
    numBrevet: '',
    titre: '',
    numDepo: '',
    dateSortie: '',
    titulaire: '',
    status: 'en attente',
    documents: []
  });

  // Pré-remplir le formulaire avec les données existantes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        documents: initialData.documents || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données mises à jour :', formData);
    alert('Brevet mis à jour !');
    // Ici tu peux envoyer à ton API Django
  };

  return (
    <div className="container-form">
      <h1>Modifier le Brevet</h1>
      <form onSubmit={handleSubmit}>
        <label>Numéro du brevet</label>
        <input
          type="text"
          name="numBrevet"
          value={formData.numBrevet}
          onChange={handleChange}
          required
        />

        <label>Titre</label>
        <input
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          required
        />

        <label>Numéro de dépôt</label>
        <input
          type="text"
          name="numDepo"
          value={formData.numDepo}
          onChange={handleChange}
          required
        />

        <label>Date de sortie</label>
        <input
          type="date"
          name="dateSortie"
          value={formData.dateSortie}
          onChange={handleChange}
          required
        />

        <label>Titulaire</label>
        <input
          type="text"
          name="titulaire"
          value={formData.titulaire}
          onChange={handleChange}
          required
        />

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="en attente">En attente</option>
          <option value="accepter">Accepter</option>
          <option value="refuser">Refuser</option>
        </select>

        <label>Documents (ajouter plusieurs fichiers)</label>
        <input type="file" name="documents" onChange={handleFileChange} multiple />

        <button type="submit">Mettre à jour</button>
      </form>

      {formData.documents.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <strong>Fichiers attachés :</strong>
          <ul>
            {formData.documents.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}