import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { YearlyEventCount } from '../../types/climate';

interface YearlyEventChartProps {
  data: YearlyEventCount[];
  color?: string;
}

export const YearlyEventChart: React.FC<YearlyEventChartProps> = ({ data, color = '#0284C7' }) => {
  return (
    <div className="ca-card" style={{ marginBottom: 24 }}>
      <div className="ca-card-header">
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Yearly Event Distribution</h3>
          <span style={{ fontSize: 12, color: '#667085' }}>
            Count of qualifying observational climate events grouped by start year
          </span>
        </div>
      </div>

      <div className="ca-card-body">
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#4B5563' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as YearlyEventCount;
                    return (
                      <div
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E4E7EC',
                          borderRadius: 6,
                          padding: '8px 12px',
                          boxShadow: 'var(--shadow-card)',
                          fontSize: 12,
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#111827' }}>Year: {label}</div>
                        <div style={{ color, marginTop: 2 }}>
                          Events Detected: <strong>{item.eventCount}</strong>
                        </div>
                        {item.totalRainfall !== undefined && (
                          <div style={{ color: '#4B5563', fontSize: 11 }}>
                            Total Event Rainfall: {item.totalRainfall} mm
                          </div>
                        )}
                        {item.avgDurationDays !== undefined && (
                          <div style={{ color: '#4B5563', fontSize: 11 }}>
                            Avg Event Duration: {item.avgDurationDays} days
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="eventCount" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
