export default function StatCard({ value, label, trend, trendUp, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-accent-bar" />
      <div className="stat-info">
        {icon && <span className="stat-icon">{icon}</span>}
        <div className="stat-val">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && (
          <span className={`stat-trend ${trendUp ? "up" : "down"}`}>
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      <span className="stat-deco" />
    </div>
  );
}
