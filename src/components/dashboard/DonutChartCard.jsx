import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DonutChartCard({ title, labels, data, colors }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    });
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">{title}</span>
      </div>
      <div style={{ position: "relative", height: "160px" }}>
        <canvas ref={canvasRef} />
      </div>
      <div className="donut-legend">
        {labels.map((l, i) => (
          <span key={l} className="legend-item">
            <span className="legend-dot" style={{ background: colors[i] }} />
            {l} {data[i]}%
          </span>
        ))}
      </div>
    </div>
  );
}