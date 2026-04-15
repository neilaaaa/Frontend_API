import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function BarChartCard({ title, labels, datasets, period, onPeriodChange }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#aaa" } },
          y: { grid: { color: "#f3f3f3" }, ticks: { font: { size: 11 }, color: "#aaa" } },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [labels, datasets]);

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">{title}</span>
        <div className="tab-group">
          {["Jour", "Semaine", "Mois"].map((t) => (
            <button
              key={t}
              className={`dash-tab ${period === t ? "active" : ""}`}
              onClick={() => onPeriodChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#ffe0c2" }} />
          Agents
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#ff7a18" }} />
          Directeurs
        </span>
      </div>

      <div style={{ position: "relative", height: "200px" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}