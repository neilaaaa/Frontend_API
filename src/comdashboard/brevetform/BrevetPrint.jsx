import { useLocation } from "react-router-dom";
import "./BrevetPrint.css";
export default function BrevetPrint() {
  const { state } = useLocation();

  if (!state) return <p>Aucune donnée</p>;

  return (
    <div className="a4">

      {/* HEADER */}
      <div className="header">
        <div className="logo">INPI</div>

        <div className="center">
          N° {state.numero} /DG
        </div>

        <div className="right">
          <p>Classement : 0.003.5/20</p>
          <p>Référence : E-063</p>
          <p>Page : 1</p>
        </div>
      </div>

      {/* TITRE */}
      <div className="title-box">
        Nature de la demande de protection *
      </div>

      {/* CHECKBOX */}
      <div className="checkbox-row">
        <label>
          <input type="checkbox" checked={state.type === "brevet"} readOnly />
          Brevet d'invention
        </label>

        <label>
          <input type="checkbox" checked={state.type === "extension"} readOnly />
          Extension PCT
        </label>

        <label>
          <input type="checkbox" checked={state.type === "certificat"} readOnly />
          Certificat d’addition
        </label>
      </div>

      {/* DEPOSANT */}
      <div className="box">
        <div className="label">[71] DEPOSANT</div>
        <div className="content">{state.deposant}</div>
      </div>

      {/* INVENTEUR */}
      <div className="box">
        <div className="label">[72] INVENTEUR</div>
        <div className="content">{state.inventeur}</div>
      </div>

      {/* TITRE INVENTION */}
      <div className="box">
        <div className="label">[54] TITRE DE L'INVENTION</div>
        <div className="content">{state.titre}</div>
      </div>

      {/* TABLEAU */}
      <div className="table">
        <div className="row header-row">
          <div>N° dépôt</div>
          <div>Date</div>
          <div>Pays</div>
        </div>

        <div className="row">
          <div>{state.numero}</div>
          <div>{state.date}</div>
          <div>{state.pays}</div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <button onClick={() => window.print()}>
          🖨️ Imprimer
        </button>
      </div>

    </div>
  );
}