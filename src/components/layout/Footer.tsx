import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-default, #E4E7EC)',
        padding: '16px 28px',
        background: '#FFFFFF',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#667085',
        marginTop: 'auto',
      }}
    >
      <div>
        <span style={{ fontWeight: 600, color: '#111827' }}>Climate Analytics</span> — Historical observational
        gridded climate platform across India.
      </div>
      <div>
        <span>Data attribution: </span>
        <strong style={{ color: '#374151' }}>IMD</strong> (India Meteorological Department) &{' '}
        <strong style={{ color: '#374151' }}>Copernicus ECMWF ERA5</strong>
      </div>
    </footer>
  );
};
