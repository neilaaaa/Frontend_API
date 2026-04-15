export default function StatCard({ icon, value, label, trend, trendUp, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ic-${color}`}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-val">{value}</div>
        <div className="stat-label">{label}</div>
        
      </div>
    </div>
  );
}