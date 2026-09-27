import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  accentColor?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  accentColor = '#1E40AF',
  icon,
}) => {
  return (
    <div
      className="ca-card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        {icon && <span style={{ color: accentColor, opacity: 0.85 }}>{icon}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 13, fontWeight: 500, color: '#667085' }}>{unit}</span>}
      </div>

      {subtext && <div style={{ fontSize: 11, color: '#667085', marginTop: 4 }}>{subtext}</div>}
    </div>
  );
};
