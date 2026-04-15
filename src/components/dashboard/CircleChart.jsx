import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function CircleChart({ 
  title, 
  value = 78,
  indicators = null,
  colors = ["#22c55e", "#ef4444"]
}) {
  // Si des indicateurs personnalisés sont fournis, on les utilise
  const hasIndicators = indicators && Array.isArray(indicators);
  
  const data = hasIndicators 
    ? indicators.map(item => ({ name: item.label, value: item.value }))
    : [
        { name: "Complété", value: value },
        { name: "Restant", value: 100 - value },
      ];

  const chartColors = hasIndicators 
    ? indicators.map(i => i.color) 
    : colors;

  return (
    <div className="chart-card center">
      <h3>{title}</h3>

      {/* Indicateurs de couleur */}
      {hasIndicators && (
        <div className="circle-indicators" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          width: '100%'
        }}>
          {indicators.map((indicator, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: indicator.color 
                }}></div>
                <span style={{ color: '#444' }}>{indicator.label}</span>
              </div>
              <span style={{ fontWeight: '600', color: indicator.color }}>
                {indicator.value}%
              </span>
            </div>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={chartColors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="circle-label" style={{ 
        marginTop: '10px',
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        {hasIndicators 
          ? `${indicators[0].value}% / ${indicators[1].value}%`
          : `${value}%`
        }
      </div>
    </div>
  );
}