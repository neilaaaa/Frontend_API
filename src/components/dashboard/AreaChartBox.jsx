import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AreaChartBox({ title, data, dataKey, color }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color || "#e5a546"} 
            fill={color || "#e5a546"} 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}