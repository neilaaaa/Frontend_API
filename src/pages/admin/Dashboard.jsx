import { useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import BarChartCard from "../../components/dashboard/BarChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import RecentTable from "../../components/dashboard/RecentTable";
import "../../components/dashboard/dashboard.css";

const IconUsers     = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconAgents    = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>;
const IconActifs    = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconInactifs  = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

const chartData = {
  Jour: {
    labels: ["08h","10h","12h","14h","16h","18h","20h"],
    agents:      [2, 1, 3, 0, 2, 1, 0],
    directeurs:  [0, 1, 0, 1, 0, 0, 1],
  },
  Semaine: {
    labels: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
    agents:      [5, 8, 3, 7, 6, 2, 1],
    directeurs:  [2, 3, 1, 4, 2, 1, 0],
  },
  Mois: {
    labels: ["Jan","Fév","Mar","Avr","Mai","Jun","Jul"],
    agents:      [20, 35, 28, 42, 38, 50, 45],
    directeurs:  [5,  8,  6,  10, 9,  12, 11],
  },
};

const donutData = {
  Jour:    [60, 25, 10, 5],
  Semaine: [55, 28, 12, 5],
  Mois:    [50, 30, 14, 6],
};

const stats = {
  Jour:    { totalUsers: 12,  agents: 7,  actifs: 10, inactifs: 2  },
  Semaine: { totalUsers: 48,  agents: 28, actifs: 40, inactifs: 8  },
  Mois:    { totalUsers: 185, agents: 95, actifs: 160, inactifs: 25 },
};

const recentUsers = [
  { id: "#USR-001", nom: "Alice Martin",   role: "Agent",       email: "alice@mail.com",   statut: "Actif" },
  { id: "#USR-002", nom: "Bob Dupont",     role: "Directeur",   email: "bob@mail.com",     statut: "Actif" },
  { id: "#USR-003", nom: "Clara Leroy",    role: "Responsable", email: "clara@mail.com",   statut: "Inactif" },
  { id: "#USR-004", nom: "David Cohen",    role: "Agent",       email: "david@mail.com",   statut: "Actif" },
  { id: "#USR-005", nom: "Emma Bernard",   role: "Admin",       email: "emma@mail.com",    statut: "Actif" },
];

const connexionsRecentes = [
  { date: "15 Avr 2024", nom: "Alice Martin",   role: "Agent",       action: "Connexion" },
  { date: "15 Avr 2024", nom: "Bob Dupont",     role: "Directeur",   action: "Modification" },
  { date: "14 Avr 2024", nom: "Emma Bernard",   role: "Admin",       action: "Création" },
  { date: "14 Avr 2024", nom: "Clara Leroy",    role: "Responsable", action: "Connexion" },
  { date: "13 Avr 2024", nom: "David Cohen",    role: "Agent",       action: "Suppression" },
];

export default function Dashboard() {
  const [period, setPeriod]           = useState("Semaine");
  const [roleFilter, setRoleFilter]   = useState("Tous");

  const current     = chartData[period];
  const currentStat = stats[period];

  const filteredUsers = roleFilter === "Tous"
    ? recentUsers
    : recentUsers.filter((u) => u.role === roleFilter);

  return (
    <div className="dash-page">

      {/* TOPBAR */}
      <div className="dash-topbar">
        <h2 className="dash-page-title">Dashboard Admin</h2>
        <div className="period-group">
          {["Jour", "Semaine", "Mois"].map((p) => (
            <button
              key={p}
              className={`period-btn ${period === p ? "active" : ""}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard icon={IconUsers}    value={currentStat.totalUsers} label="Total Utilisateurs" trend="10%" trendUp color="purple" />
        <StatCard icon={IconAgents}   value={currentStat.agents}     label="Total Agents"        trend="8%"  trendUp color="blue" />
        <StatCard icon={IconActifs}   value={currentStat.actifs}     label="Utilisateurs Actifs" trend="5%"  trendUp color="green" />
        <StatCard icon={IconInactifs} value={currentStat.inactifs}   label="Inactifs"            trend="2%"  trendUp={false} color="orange" />
      </div>

      {/* CHARTS */}
      <div className="charts-row">
        <BarChartCard
          title="Nouveaux utilisateurs"
          period={period}
          onPeriodChange={setPeriod}
          labels={current.labels}
          datasets={[
  { label: "Agents",     data: current.agents,     backgroundColor: "#ffe0c2", borderRadius: 6 },
  { label: "Directeurs", data: current.directeurs, backgroundColor: "#ff7a18", borderRadius: 6 },
]}
        />
        <DonutChartCard
          title="Répartition des rôles"
          labels={["Agent", "Directeur", "Responsable", "Admin"]}
          data={donutData[period]}
          colors={["#7c3aed", "#2196f3", "#ff7a18", "#ef5350"]}
        />
      </div>

      {/* FILTRE ROLE */}
      <div className="table-filters">
        <span className="filter-label">Filtrer par rôle :</span>
        {["Tous", "Agent", "Directeur", "Responsable", "Admin"].map((r) => (
          <button
            key={r}
            className={`filter-btn ${roleFilter === r ? "active" : ""}`}
            onClick={() => setRoleFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* TABLES */}
      <div className="tables-row">
        <RecentTable
          title={`Utilisateurs récents${roleFilter !== "Tous" ? ` — ${roleFilter}` : ""}`}
          columns={[
            { key: "id",     label: "ID" },
            { key: "nom",    label: "Nom" },
            { key: "role",   label: "Rôle" },
            { key: "email",  label: "Email" },
            { key: "statut", label: "Statut" },
          ]}
          rows={filteredUsers}
          badgeKey="statut"
          badgeMap={{ Actif: "b-delivered", Inactif: "b-refused" }}
        />
        <RecentTable
          title="Activité récente"
          columns={[
            { key: "date",   label: "Date" },
            { key: "nom",    label: "Utilisateur" },
            { key: "role",   label: "Rôle" },
            { key: "action", label: "Action" },
          ]}
          rows={connexionsRecentes}
          badgeKey="action"
          badgeMap={{
            Connexion:    "b-delivered",
            Création:     "b-pending",
            Modification: "b-pending",
            Suppression:  "b-refused",
          }}
        />
      </div>

    </div>
  );
}