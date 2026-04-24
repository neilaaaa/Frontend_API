import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBrevetById} from "../../features/brevets/brevetApi";
import "./viewBrevet.css"

export default function ViewBrevet() {
  const { id } = useParams() 
  const navigate = useNavigate();
  const [data, setData] = useState(null)   // pour stocker le brevet
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
   const fetch = async () =>{
    try{
      const brevet = await getBrevetById(id)
      setData(brevet)
      console.log(brevet)
    } catch{
      setError("brevet Introuvable !")
    } finally{
      setLoading(false);
    }
   }
    fetch()
  }, [id]);

  if(loading) return <p> Loading </p>
  if (error)   return <p style={{ color: "red" }}>{error}</p>
  if (!data) return <p>Brevet Introuvable</p>;

  return (
    <div className="view-container">
  <h2 className="view-title">Détails Brevet</h2>

  <div className="view-card">
    <p><b>Num brevet:</b> {data.num_brevet}</p>
    <p><b>Titre:</b> {data.titre}</p>
    <p><b>Num dépôt:</b> {data.num_depo}</p>
    <p><b>Date dépôt:</b> {data.date_depo}</p>
    <p><b>Date sortie:</b> {data.date_sortie}</p>
    <p><b>Titulaire:</b> {data.titulaire}</p>
    <p><b>Déposant:</b> {data.id_dep?.nom_dep}</p>
    <p><b>Inventeurs:</b> {data.id_inv?.map(inv=>inv.nom_inv).join(", ")}</p>
    <p><b>Status:</b> {data.statut}</p>
  </div>

  <div className="view-docs">
    <h4>📎 Documents :</h4>
    <ul>
      {data.documents?.length > 0 ? (
        data.documents.map((doc, i) => (
          <li key={i} className="view-doc-item">{doc}</li>
        ))
      ) : (
        <p>Aucun document</p>
      )}
    </ul>
  </div>

  <button className="view-btn-back" onClick={() => navigate(-1)}>
    ⬅ Retour
  </button>
</div>
  );
}