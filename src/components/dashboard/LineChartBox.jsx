import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function LineChartBox({ title, data, dataKey, color }) {
  // Vérification des données
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color || "#e5a546"} 
            strokeWidth={2}
            dot={{ fill: color || "#e5a546", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}