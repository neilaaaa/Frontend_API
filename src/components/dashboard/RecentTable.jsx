export default function RecentTable({ title, columns, rows, badgeKey, badgeMap }) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">{title}</span>
        <a href="#" className="view-all">Voir tout</a>
      </div>
      <table className="mini-table">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key}>
                  {c.key === badgeKey ? (
                    <span className={`badge ${badgeMap[row[c.key]] || ""}`}>
                      {row[c.key]}
                    </span>
                  ) : (
                    row[c.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}