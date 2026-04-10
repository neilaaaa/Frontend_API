import React from 'react';
import './ViewBrevet.css';

export default function ViewBrevet({ data }) {
  // data = objet contenant le brevet
  return (
    <div className="container-view">
      <h1>Détails du Brevet</h1>

      <div className="detail">
        <span>Numéro du brevet : </span> {data.numBrevet}
      </div>
      <div className="detail">
        <span>Titre : </span> {data.titre}
      </div>
      <div className="detail">
        <span>Numéro de dépôt : </span> {data.numDepo}
      </div>
      <div className="detail">
        <span>Date de sortie : </span> {data.dateSortie}
      </div>
      <div className="detail">
        <span>Titulaire : </span> {data.titulaire}
      </div>
      <div className="detail">
        <span>Status : </span> {data.status}
      </div>

      {data.documents && data.documents.length > 0 && (
        <div className="detail">
          <span>Documents : </span>
          <ul>
            {data.documents.map((doc, index) => (
              <li key={index}>{doc.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}