import { useEffect, useMemo, useState } from "react";
import Datatable2 from "../../components/Datatable2";
import UserForm from "./UserForm";
import { createUser, deleteUser, getUsers, updateUser } from "../../features/admin/userApi";
import { useAuth } from "../../contexts/AuthContext";

const ROLE_LABELS = {
  admin: "Admin",
  agent: "Agent",
  responsable: "Responsable",
  directeur: "Directeur",
};

function mapUserToRow(user) {
  const primaryGroup = user.groups?.[0]?.toLowerCase();
  const role = user.is_staff || user.is_superuser
    ? "Admin"
    : ROLE_LABELS[primaryGroup] || "Sans role";

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role,
    date_ajout: user.date_ajout,
    is_active: user.is_active,
    groups: user.groups || [],
    is_staff: user.is_staff,
    is_superuser: user.is_superuser,
  };
}

export default function Users() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const users = await getUsers();
      setData(Array.isArray(users) ? users.map(mapUserToRow) : []);
    } catch (err) {
      console.error("Admin users load error:", err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const roleOk = !roleFilter || user.role === roleFilter;
      const statusOk =
        !statusFilter ||
        (statusFilter === "Actif" && user.is_active) ||
        (statusFilter === "Inactif" && !user.is_active);
      return roleOk && statusOk;
    });
  }, [data, roleFilter, statusFilter]);

  const handleSubmit = async (payload) => {
    try {
      setError("");
      if (editUser?.id === user?.id && payload.is_active === false) {
        setError("Vous ne pouvez pas désactiver votre propre compte.");
        return;
      }

      if (editUser) {
        await updateUser(editUser.id, payload);
        setEditUser(null);
      } else {
        await createUser(payload);
      }
      await loadUsers();
    } catch (err) {
      console.error("Admin user submit error:", err);
      setError(err?.response?.data?.detail || "Impossible d'enregistrer l'utilisateur.");
    }
  };

  const handleDelete = async (row) => {
    try {
      setError("");
      if (row.id === user?.id) {
        setError("Vous ne pouvez pas supprimer votre propre compte.");
        return;
      }

      await deleteUser(row.id);
      if (editUser?.id === row.id) {
        setEditUser(null);
      }
      await loadUsers();
    } catch (err) {
      console.error("Admin user delete error:", err);
      setError(err?.response?.data?.detail || "Impossible de supprimer l'utilisateur.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <div className="dash-filter-bar">
        <span className="dash-filter-label">Filtrer par</span>

        <div className="dash-filter-modes">
          <select
            className="dash-filter-input"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les roles</option>
            <option value="Admin">Admin</option>
            <option value="Agent">Agent</option>
            <option value="Responsable">Responsable</option>
            <option value="Directeur">Directeur</option>
            <option value="Sans role">Sans role</option>
          </select>

          <select
            className="dash-filter-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
        </div>

        {(roleFilter || statusFilter) && (
          <button
            type="button"
            className="dash-filter-reset"
            onClick={() => {
              setRoleFilter("");
              setStatusFilter("");
            }}
          >
            Reinitialiser
          </button>
        )}
      </div>

      {error && <p className="page-state error">{error}</p>}

      <Datatable2
        title="Utilisateurs"
        data={filteredData}
        columns={[
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "date_ajout", label: "Date" },
          { key: "is_active", label: "Actif", render: (value) => (value ? "Oui" : "Non") },
        ]}
        form={
          <UserForm
            key={editUser ? editUser.id : "new"}
            editData={editUser}
            onSubmit={handleSubmit}
            onCancel={() => setEditUser(null)}
          />
        }
        onEdit={setEditUser}
        onDelete={handleDelete}
      />
    </>
  );
}
