import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../features/admin/userApi";
import StatCard from "../../components/dashboard/StatCard";
import "../../components/dashboard/dashboard.css";

const IconUsers = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconRoles = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" /><path d="M9 12l2 2 4-4" /></svg>;
const IconAccess = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IconSecurity = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>;

const roles = [
  {
    name: "Agent",
    text: "Cree et suit les demandes, brevets, documents et paiements.",
  },
  {
    name: "Responsable",
    text: "Verifie les demandes et change leur statut.",
  },
  {
    name: "Directeur",
    text: "Consulte les informations principales du systeme.",
  },
];

const quickActions = [
  { label: "Ajouter un utilisateur", section: "dt-form", active: true },
  { label: "Modifier un role", section: "dt-list" },
  { label: "Consulter la liste", section: "dt-list" },
];

function getRole(user) {
  if (user?.is_staff || user?.is_superuser) return "Admin";
  return user?.groups?.[0] || "Sans role";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        const data = await getUsers();
        if (active) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      }
    };

    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const stats = {
      total: users.length,
      roles: 4,
      sansRole: 0,
      disabled: 0,
    };

    users.forEach((user) => {
      if (getRole(user) === "Sans role") stats.sansRole += 1;
      if (user?.is_active === false) stats.disabled += 1;
    });

    return stats;
  }, [users]);

  const focusCards = [
    {
      value: String(summary.total),
      label: "Utilisateurs",
      text: "Comptes disponibles dans le systeme.",
      icon: IconUsers,
    },
    {
      value: String(summary.roles),
      label: "Roles",
      text: "Roles configures pour l'administration.",
      icon: IconRoles,
    },
    {
      value: summary.sansRole > 0 ? String(summary.sansRole) : "OK",
      label: "Acces",
      text: summary.sansRole > 0
        ? "Des utilisateurs doivent recevoir un role."
        : "Chaque utilisateur a un role attribue.",
      icon: IconAccess,
    },
    {
      value: summary.disabled > 0 ? String(summary.disabled) : "OK",
      label: "Securite",
      text: summary.disabled > 0
        ? "Des comptes sont desactives."
        : "Aucun compte desactive detecte.",
      icon: IconSecurity,
    },
  ];

  const latestUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => new Date(b?.date_ajout || 0).getTime() - new Date(a?.date_ajout || 0).getTime())
        .slice(0, 3)
        .map((user) => ({
          username: user.username,
          role: getRole(user),
        })),
    [users]
  );

  const goToUsers = (section) => {
    navigate(`/admin/users#${section}`);
  };

  return (
    <div className="dash-page dash-page-admin">
      <div className="dash-topbar dash-topbar-admin">
        <h2 className="dash-page-title">Tableau de bord Admin</h2>
        <button
          className="filter-btn active admin-manage-btn"
          type="button"
          onClick={() => goToUsers("dt-form")}
        >
          Gerer les utilisateurs
        </button>
      </div>

      <div className="stats-grid">
        {focusCards.map((card) => (
          <StatCard
            key={card.label}
            value={card.value}
            label={card.label}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="charts-row admin-panels-grid">
        <section className="dash-card admin-roles-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Roles du systeme</span>
          </div>

          <table className="mini-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Utilisation</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.name}>
                  <td>{role.name}</td>
                  <td>{role.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dash-card admin-actions-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Actions rapides</span>
          </div>

          <div className="table-filters admin-quick-actions">
            {quickActions.map((action) => (
              <button
                className={`filter-btn${action.active ? " active" : ""}`}
                key={action.label}
                type="button"
                onClick={() => goToUsers(action.section)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="admin-summary-card">
            <div className="admin-summary-head">Resume rapide</div>
            <div className="admin-summary-row">
              <span>Utilisateurs sans role</span>
              <strong>{summary.sansRole}</strong>
            </div>
            <div className="admin-summary-row">
              <span>Comptes desactives</span>
              <strong>{summary.disabled}</strong>
            </div>
            <div className="admin-summary-list">
              {latestUsers.length === 0 ? (
                <span className="admin-summary-empty">Aucun utilisateur recent.</span>
              ) : (
                latestUsers.map((user) => (
                  <div className="admin-summary-user" key={user.username}>
                    <span>{user.username}</span>
                    <small>{user.role}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
