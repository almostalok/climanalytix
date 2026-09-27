import React from 'react';

interface LoadingStateProps {
  type?: 'table' | 'chart' | 'map' | 'cards';
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ type = 'table', message = 'Processing climate time-series...' }) => {
  if (type === 'cards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="ca-card" style={{ padding: 18 }}>
            <div className="ca-skeleton" style={{ width: '40%', height: 12, marginBottom: 12 }} />
            <div className="ca-skeleton" style={{ width: '70%', height: 28, marginBottom: 8 }} />
            <div className="ca-skeleton" style={{ width: '50%', height: 10 }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="ca-card" style={{ padding: 24, minHeight: 320 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div className="ca-skeleton" style={{ width: 140, height: 16 }} />
          <div className="ca-skeleton" style={{ width: 100, height: 24 }} />
        </div>
        <div className="ca-skeleton" style={{ width: '100%', height: 220, borderRadius: 6 }} />
        <p style={{ textAlign: 'center', fontSize: 12, color: '#667085', marginTop: 12 }}>{message}</p>
      </div>
    );
  }

  if (type === 'map') {
    return (
      <div className="ca-card" style={{ padding: 16, minHeight: 420 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div className="ca-skeleton" style={{ width: 180, height: 16 }} />
          <div className="ca-skeleton" style={{ width: 80, height: 16 }} />
        </div>
        <div className="ca-skeleton" style={{ width: '100%', height: 340, borderRadius: 6 }} />
      </div>
    );
  }

  // Table skeleton default
  return (
    <div className="ca-table-container" style={{ padding: 16 }}>
      <div className="ca-skeleton" style={{ width: 200, height: 16, marginBottom: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="ca-skeleton" style={{ width: '100%', height: 32, borderRadius: 4 }} />
        ))}
      </div>
    </div>
  );
};
