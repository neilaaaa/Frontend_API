export default function RecentTable({ title, columns, rows, badgeKey, badgeMap }) {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">{title}</span>
      </div>

      <table className="mini-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!hasRows ? (
            <tr>
              <td className="mini-table-empty" colSpan={columns.length}>
                Aucune donnée disponible pour le moment.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => {
                  const rawValue = row?.[column.key];
                  const value = column.render ? column.render(rawValue, row) : rawValue;

                  return (
                    <td key={column.key}>
                      {column.key === badgeKey ? (
                        <span className={`badge ${badgeMap?.[rawValue] || ""}`}>
                          {rawValue || "—"}
                        </span>
                      ) : (
                        value || "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
