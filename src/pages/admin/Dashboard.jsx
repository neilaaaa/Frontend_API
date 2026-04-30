import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../features/admin/userApi";
import "../../components/dashboard/dashboard.css";

const roles = [
  {
    name: "Admin",
    text: "Gere les utilisateurs, les roles et les acces.",
  },
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
    },
    {
      value: String(summary.roles),
      label: "Roles",
      text: "Roles configures pour l'administration.",
    },
    {
      value: summary.sansRole > 0 ? String(summary.sansRole) : "OK",
      label: "Acces",
      text: summary.sansRole > 0
        ? "Des utilisateurs doivent recevoir un role."
        : "Chaque utilisateur a un role attribue.",
    },
    {
      value: summary.disabled > 0 ? String(summary.disabled) : "OK",
      label: "Securite",
      text: summary.disabled > 0
        ? "Des comptes sont desactives."
        : "Aucun compte desactive detecte.",
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
    <div className="dash-page">
      <div className="dash-topbar">
        <h2 className="dash-page-title">Tableau de bord Admin</h2>
        <button className="filter-btn active" type="button" onClick={() => goToUsers("dt-form")}>
          Gerer les utilisateurs
        </button>
      </div>

      <div className="stats-grid">
        {focusCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <span className="stat-accent-bar" />
            <div className="stat-info">
              <div className="stat-val">{card.value}</div>
              <div className="stat-label">{card.label}</div>
              <span className="stat-trend up">{card.text}</span>
            </div>
            <span className="stat-deco" />
          </div>
        ))}
      </div>

      <div className="charts-row">
        <section className="dash-card">
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

        <section className="dash-card">
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
