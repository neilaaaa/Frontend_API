import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

import DashboardIcon     from "@mui/icons-material/Dashboard";
import DescriptionIcon   from "@mui/icons-material/Description";
import RequestPageIcon   from "@mui/icons-material/RequestPage";
import PaymentIcon       from "@mui/icons-material/Payment";
import GavelIcon         from "@mui/icons-material/Gavel";
import PeopleIcon        from "@mui/icons-material/People";
import AssignmentIcon    from "@mui/icons-material/Assignment";
import LogoutIcon        from "@mui/icons-material/Logout";

// MENUS CORRIGÉS
const MENUS = {
  admin: [
    { to: "/admin", icon: <DashboardIcon />, label: "Tableau de bord" },
    { to: "/admin/users", icon: <PeopleIcon />, label: "Utilisateurs" },
  ],

  agent: [
    { to: "/agent", icon: <DashboardIcon />, label: "Tableau de bord" },
    { to: "/agent/documents", icon: <DescriptionIcon />, label: "Documents" },
    { to: "/agent/brevets", icon: <DescriptionIcon />, label: "Mes Brevets" },
    { to: "/agent/demandes", icon: <RequestPageIcon />, label: "Mes Demandes" },
    { to: "/agent/paiements", icon: <PaymentIcon />, label: "Paiements" },
    { to: "/agent/recours", icon: <GavelIcon />, label: "Recours" },
  ],

  responsable: [
    { to: "/responsable", icon: <DashboardIcon />, label: "Tableau de bord" },
    { to: "/responsable/brevets", icon: <DescriptionIcon />, label: "Brevets" },
    { to: "/responsable/demandes", icon: <AssignmentIcon />, label: "Demandes équipe" },
    { to: "/responsable/paiements", icon: <PaymentIcon />, label: "Paiements" },
    { to: "/responsable/recours", icon: <GavelIcon />, label: "Recours" },
    { to: "/responsable/documents", icon: <DescriptionIcon />, label: "Documents" },
  ],

  // ✅ DIRECTEUR AVEC DEMANDES + PAIEMENTS
  directeur: [
    { to: "/directeur", icon: <DashboardIcon />, label: "Tableau de bord" },
    { to: "/directeur/brevets", icon: <DescriptionIcon />, label: "Brevets" },
    { to: "/directeur/demandes", icon: <RequestPageIcon />, label: "Demandes" },
    { to: "/directeur/paiements", icon: <PaymentIcon />, label: "Paiements" },
    { to: "/directeur/documents", icon: <DescriptionIcon />, label: "Documents" },
    { to: "/directeur/recours", icon: <GavelIcon />, label: "Recours" },
  ],
};

export default function Sidebar({ collapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user ? (MENUS[user.role] || []) : [];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebarLogo">
        <img src="/src/assets/sonatrach.png" alt="Sonatrach" />
      </div>

      <div className="sidebarMenu">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `sidebarItem ${isActive ? "active" : ""}`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* ✅ Déconnexion en bas */}
      <div className="sidebarBottom">
        <div
          className="sidebarItem"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogoutIcon />
          {!collapsed && <span>Déconnexion</span>}
        </div>
      </div>
    </div>
  );
}