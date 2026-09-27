import React from 'react';
import { ClimateVariable } from '../../types/climate';

interface MapLegendProps {
  type: 'actual' | 'normal' | 'anomaly';
  variable: ClimateVariable;
}

export const MapLegend: React.FC<MapLegendProps> = ({ type, variable }) => {
  const isRain = variable === 'rainfall';

  if (type === 'anomaly') {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          border: '1px solid #E4E7EC',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 11,
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>Anomaly (%)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 10, width: 160, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ flex: 1, height: '100%', background: '#1D4ED8' }} title="Large Deficit (< -50%)" />
          <div style={{ flex: 1, height: '100%', background: '#60A5FA' }} title="Deficit (-20% to -50%)" />
          <div style={{ flex: 1, height: '100%', background: '#E5E7EB' }} title="Normal (-19% to +19%)" />
          <div style={{ flex: 1, height: '100%', background: '#FB923C' }} title="Excess (+20% to +59%)" />
          <div style={{ flex: 1, height: '100%', background: '#DC2626' }} title="Large Excess (>= +60%)" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: 10, marginTop: 3 }}>
          <span>-60%</span>
          <span>Normal</span>
          <span>+60%</span>
        </div>
      </div>
    );
  }

  // Actual or Normal
  if (isRain) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          border: '1px solid #E4E7EC',
          borderRadius: 6,
          padding: '6px 10px',
          fontSize: 11,
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>Rainfall (mm)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 10, width: 160, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ flex: 1, height: '100%', background: '#F0F9FF' }} title="0 - 2 mm" />
          <div style={{ flex: 1, height: '100%', background: '#BAE6FD' }} title="2 - 15 mm" />
          <div style={{ flex: 1, height: '100%', background: '#38BDF8' }} title="15 - 35 mm" />
          <div style={{ flex: 1, height: '100%', background: '#0284C7' }} title="35 - 70 mm" />
          <div style={{ flex: 1, height: '100%', background: '#0C4A6E' }} title="> 70 mm" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: 10, marginTop: 3 }}>
          <span>0</span>
          <span>25</span>
          <span>75+</span>
        </div>
      </div>
    );
  }

  // Temperature
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(4px)',
        border: '1px solid #E4E7EC',
        borderRadius: 6,
        padding: '6px 10px',
        fontSize: 11,
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>Max Temperature (°C)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 10, width: 160, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ flex: 1, height: '100%', background: '#93C5FD' }} title="< 20°C" />
        <div style={{ flex: 1, height: '100%', background: '#FDE68A' }} title="20 - 30°C" />
        <div style={{ flex: 1, height: '100%', background: '#F97316' }} title="30 - 38°C" />
        <div style={{ flex: 1, height: '100%', background: '#EA580C' }} title="38 - 42°C" />
        <div style={{ flex: 1, height: '100%', background: '#991B1B' }} title="> 42°C (Extreme)" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280', fontSize: 10, marginTop: 3 }}>
        <span>&lt;20°C</span>
        <span>32°C</span>
        <span>&gt;42°C</span>
      </div>
    </div>
  );
};
