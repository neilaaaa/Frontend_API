import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SalesChart({ 
  data = [], 
  title = "Sales dynamics",
  years = ["2021", "2022"],
  colors = ["#e5a546", "#e5a546"]
}) {
  const [selectedYear, setSelectedYear] = useState(years[1]);

  return (
    <div className="sales-chart">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="year-selector">
          {years.map((year) => (
            <button 
              key={year}
              className={selectedYear === year ? "active" : ""} 
              onClick={() => setSelectedYear(year)}
            >
              {year} ▼
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey={selectedYear === years[0] ? "value2021" : "value2022"} 
            fill={colors[0]} 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}