import React, { useState } from 'react';
import './CreatBrevet.css';

export default function CreatBrevet() {
  // State pour le formulaire
  const [formData, setFormData] = useState({
    numBrevet: '',
    titre: '',
    numDepo: '',
    dateSortie: '',
    titulaire: '',
    status: 'en attente',
    documents: []
  });

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion des fichiers multiples
  const handleFileChange = (e) => {
    setFormData({ ...formData, documents: Array.from(e.target.files) });
  };

  // Gestion de la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Brevet créé ! Vérifie la console pour les données.');
    // Ici tu peux envoyer les données à ton API Django
  };

  return (
    <div className="container-form">
      <h1>Créer un Brevet</h1>
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
<label>Date de depo</label>
        <input
          type="date"
          name="dateSortie"
          value={formData.dateSortie}
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

        <label>Documents (plusieurs fichiers)</label>
        <input
          type="file"
          name="documents"
          onChange={handleFileChange}
          multiple
        />

        <button type="submit">Créer Brevet</button>
      </form>

      {/* Affichage des documents sélectionnés */}
      {formData.documents.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <strong>Fichiers sélectionnés :</strong>
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