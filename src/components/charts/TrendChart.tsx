import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { AggregationMode, ClimateVariable, TimeSeriesDataPoint } from '../../types/climate';
import { calculateTrend } from '../../packages/climate-engine/trend';

interface TrendChartProps {
  series: TimeSeriesDataPoint[];
  variable: ClimateVariable;
  isLoading?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({ series, variable, isLoading }) => {
  const [aggregation, setAggregation] = useState<AggregationMode>('monthly');

  const isRain = variable === 'rainfall';
  const unit = isRain ? 'mm' : '°C';
  const strokeColor = isRain ? '#0284C7' : '#EA580C';
  const fillColor = isRain ? '#E0F2FE' : '#FFEDD5';

  const { data, stats } = useMemo(() => {
    if (!series || series.length === 0) {
      return {
        data: [],
        stats: { min: 0, max: 0, avg: 0, total: 0, count: 0 },
      };
    }
    return calculateTrend(series, aggregation);
  }, [series, aggregation]);

  if (!series || series.length === 0) {
    return (
      <div className="ca-card">
        <div className="ca-card-header" style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              {isRain ? 'Historical Rainfall Trend' : 'Historical Maximum Temperature Trend'}
            </h3>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Aggregated observational time series ({unit})
            </span>
          </div>
        </div>
        <div style={{ padding: '64px 20px', textAlign: 'center', color: '#6B7280', fontSize: 13, background: '#FFFFFF' }}>
          No data available.
        </div>
      </div>
    );
  }

  return (
    <div className="ca-card">
      <div className="ca-card-header">
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
            {isRain ? 'Historical Rainfall Trend' : 'Historical Maximum Temperature Trend'}
          </h3>
          <span style={{ fontSize: 12, color: '#667085' }}>
            Aggregated observational time series ({unit})
          </span>
        </div>

        {/* Aggregation Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', padding: 2, borderRadius: 6 }}>
          {(['daily', 'monthly', 'yearly'] as AggregationMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAggregation(mode)}
              style={{
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 500,
                textTransform: 'capitalize',
                borderRadius: 4,
                background: aggregation === mode ? '#FFFFFF' : 'transparent',
                color: aggregation === mode ? '#1E40AF' : '#4B5563',
                boxShadow: aggregation === mode ? 'var(--shadow-subtle)' : 'none',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="ca-card-body">
        {/* Recharts chart */}
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                minTickGap={25}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                unit={` ${unit}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
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
                        <div style={{ color: '#6B7280', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontWeight: 600, color: strokeColor }}>
                          {isRain ? 'Rainfall' : 'Max Temperature'}: {payload[0].value} {unit}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Bar */}
        <div
          style={{
            marginTop: 20,
            padding: '14px 18px',
            background: '#F8F9FA',
            border: '1px solid #E4E7EC',
            borderRadius: 6,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: '#667085', textTransform: 'uppercase' }}>Minimum</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {stats.min} {unit}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#667085', textTransform: 'uppercase' }}>Maximum</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {stats.max} {unit}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#667085', textTransform: 'uppercase' }}>Average</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {stats.avg} {unit}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#667085', textTransform: 'uppercase' }}>
              {isRain ? 'Total Rainfall' : 'Std Deviation (±)'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
              {isRain
                ? `${stats.total ?? 0} mm`
                : stats.stdDev !== undefined
                ? `±${stats.stdDev} °C`
                : `${stats.count} days`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
