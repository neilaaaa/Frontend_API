import StatCard from "../../components/dashboard/StatCard";
import BarChartCard from "../../components/dashboard/BarChartCard";
import DonutChartCard from "../../components/dashboard/DonutChartCard";
import RecentTable from "../../components/dashboard/RecentTable";
import "../../components/dashboard/dashboard.css";

// ICONS
const IconRevenu  = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconBrevet  = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconDoc     = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconRecours = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

export default function Dashboard() {
  return (
    <div className="dash-page">

      {/* STATS */}
      <div className="stats-grid">
        <StatCard icon={IconRevenu}  value="$513" label="Total Revenus"   trend="12%" trendUp color="green" />
        <StatCard icon={IconBrevet}  value="321"  label="Total Brevets"   trend="8%"  trendUp color="orange" />
        <StatCard icon={IconDoc}     value="564"  label="Total Documents" trend="13%" trendUp color="blue" />
        <StatCard icon={IconRecours} value="254"  label="Total Recours"   trend="4%"  trendUp={false} color="purple" />
      </div>

      {/* CHARTS */}
      <div className="charts-row">
        <BarChartCard
          title="Croissance des brevets"
          labels={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
          datasets={[
            { label: "Brevets",  data: [30,45,28,60,52,38,48], backgroundColor: "#ede7f6", borderRadius: 6 },
            { label: "Recours",  data: [20,35,18,45,40,28,35], backgroundColor: "#7c3aed", borderRadius: 6 },
          ]}
        />
        <DonutChartCard
          title="Statut des recours"
          labels={["EN_COURS", "TRAITE", "REFUSE"]}
          data={[40, 47, 13]}
          colors={["#7c3aed", "#2196f3", "#ef5350"]}
        />
      </div>

      {/* TABLES */}
      <div className="tables-row">
        <RecentTable
          title="Derniers brevets"
          columns={[
            { key: "id",     label: "N° Brevet" },
            { key: "titre",  label: "Titre" },
            { key: "date",   label: "Date" },
            { key: "statut", label: "Statut" },
          ]}
          rows={[
            { id: "#BR-001", titre: "Procédé fab.", date: "01 Jan 2024", statut: "EN_COURS" },
            { id: "#BR-002", titre: "Système IA",   date: "03 Jan 2024", statut: "TRAITE" },
            { id: "#BR-003", titre: "Capteur bio",  date: "05 Jan 2024", statut: "REFUSE" },
            { id: "#BR-004", titre: "Algo crypto",  date: "07 Jan 2024", statut: "EN_COURS" },
          ]}
          badgeKey="statut"
          badgeMap={{ EN_COURS: "b-pending", TRAITE: "b-delivered", REFUSE: "b-refused" }}
        />
        <RecentTable
          title="Derniers paiements"
          columns={[
            { key: "date",   label: "Date" },
            { key: "brevet", label: "Brevet" },
            { key: "montant",label: "Montant" },
            { key: "statut", label: "Statut" },
          ]}
          rows={[
            { date: "01 Fév 2024", brevet: "BR-001", montant: "$1 500", statut: "Payé" },
            { date: "03 Fév 2024", brevet: "BR-002", montant: "$2 300", statut: "Non payé" },
            { date: "05 Fév 2024", brevet: "BR-003", montant: "$800",   statut: "Payé" },
            { date: "07 Fév 2024", brevet: "BR-004", montant: "$3 100", statut: "Non payé" },
          ]}
          badgeKey="statut"
          badgeMap={{ "Payé": "b-delivered", "Non payé": "b-pending" }}
        />
      </div>

    </div>
  );
}