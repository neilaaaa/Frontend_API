import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBrevetById} from "../../features/brevets/brevetApi";
import { addDocument } from "../../features/documents/documentApi";
import { getDemandeBrevets } from "../../features/demande/apiDemande";
import "./viewBrevet.css"

export default function ViewBrevet() {
  const { id } = useParams() 
  const navigate = useNavigate();
  const [data, setData] = useState(null)   // pour stocker le brevet
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [demande, setDemande] = useState("")


  useEffect(() => {
   const fetch = async () =>{
    try{
      const brevet = await getBrevetById(id)
      setData(brevet)
      console.log("brevet", brevet)
      const demandes = await getDemandeBrevets()
      console.log(demandes[0])
      setDemande(demandes)
    } catch(err){
      console.log("erreur", err)
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
  console.log("data", data);

  return (
    <div className="view-page">
      <div className="view-container">

        <h2 className="view-title">Détails du brevet</h2>

   <div className="view-card">
    <p><b>Num brevet:</b> {data.num_brevet}</p>
    <p><b>Titre:</b> {data.titre}</p>
    <p><b>Num dépôt:</b> {data.num_depo}</p>
    <p><b>Date dépôt:</b> {data.date_depo}</p>
    <p><b>Date sortie:</b> {data.date_sortie}</p>
    <p><b>Titulaire:</b> {data.titulaire}</p>
    <p><b>Déposant:</b> {data.deposant?.map(dep=> dep.nom_dep).join(", ")}</p>
    <p><b>Inventeurs:</b> {data. inventeur?.map(inv=>inv.nom_inv).join(", ")}</p>
    <p><b>Status:</b> {data.statut}</p>
   </div>
   <div className="view-card">
     <p><b>Demande associée:</b> {data?.titre_demande_liee ?? "Aucune demande liée"} </p>
   </div>
    
        {/* Documents */}
        <div className="view-card">
          <p> <b> Documents joints: </b>
          
          <button className="btn" onClick={() => navigate(`/agent/documents?brevet=${data.id_brevet}`)}>
           {data.document_set?.length > 0 ? `${data.document_set.length} document(s)` : "Voir document"}
          </button>
          </p>
        </div>

        <button className="view-btn-back" onClick={() => navigate(-1)}>
          ← Retour
        </button>

      </div>
    </div>
  );
}
