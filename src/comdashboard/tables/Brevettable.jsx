import React from 'react';
import { Link } from 'react-router-dom';
import './Brevettable.css';

export default function Brevettable() {
  return (
    <div className="container">
      <h2>Brevet Records</h2>

      <Link to="/brevet/create" className="btn btn-add">
        Ajouter Brevet
      </Link>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Num Brevet</th>
              <th>Titre</th>
              <th>Num Dépo</th>
              <th>Date depo</th>
              <th>Date Sortie</th>
              <th>Titulaire</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>4</td>
              <td>Chimique invention</td>
              <td>52146</td>
              <td>15/03/2025</td>
              <td>14/02/2026</td>
              <td>Ryma</td>
              <td>Accepter</td>
              <td>
                <Link to="/brevet/view/4" className="btn btn-info">View</Link>
                <Link to="/brevet/edit/4" className="btn btn-primary">Edit</Link>
                <button className="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}