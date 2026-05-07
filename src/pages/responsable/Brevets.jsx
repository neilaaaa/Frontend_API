import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/Datatable";
import { getTousBrevets, deleteBrevet } from "../../features/brevets/brevetApi";

export default function RespBrevets() {
  const navigate = useNavigate();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTousBrevets();
      setData(response.results || response);
    } catch {
      setError("Erreur chargement des brevets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (row) => {
    try {
      await deleteBrevet(row.id_brevet);
      load();
    } catch {
      setError("Erreur suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <DataTable
      title="Gestion des brevets"
      data={data}
      columns={[
        {
  key: "titre_demande_liee",
  label: "Demande liée",
  render: (value) => value ?? "Aucune",
  pdfFormat: (val) => val ?? "Aucune",
},
        { key: "num_brevet",  label: "N° Brevet"   },
        { key: "titre",       label: "Titre"        },
        { key: "date_depo",   label: "Date dépôt"  },
        { key: "date_sortie", label: "Date sortie"  },
        { key: "titulaire",   label: "Titulaire"    },
        {
         key: "inventeur",
         label: "Inventeur",
         render: (value) =>
         value && value.length > 0
         ? value.map(inv => `${inv.nom_inv} ${inv.prenom_inv}`).join(", ")
         : "Aucun",
         pdfFormat: (value) =>
         value && value.length > 0
         ? value.map(inv => `${inv.nom_inv} ${inv.prenom_inv}`).join(", ")
         : "Aucun",
      
        },
        { key: "statut", label: "Statut" },
        {
          key: "document_set",
          label: "Documents",
          render: (value, row) => (
            <button
              className="btn"
              onClick={() =>
                navigate(`/responsable/documents?brevet=${row.id_brevet}`)
              }
            >
              {value?.length > 0
                ? `${value.length} document(s)`
                : "Ajouter document"}
            </button>
          ),
          pdfExclude: true,
        },
      ]}
      onAdd={()     => navigate("/responsable/brevets/add")}
      onEdit={(row) => navigate(`/responsable/brevets/edit/${row.id_brevet}`)}
      onView={(row) => navigate(`/responsable/brevets/view/${row.id_brevet}`)}
      onDelete={handleDelete}
    />
  );
}