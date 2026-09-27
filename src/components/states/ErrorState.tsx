import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load climate data',
  message = 'The observational series could not be retrieved from the active data provider.',
  onRetry,
}) => {
  return (
    <div
      className="ca-card"
      style={{
        padding: '36px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FEF2F2',
        borderColor: '#FECACA',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#FEE2E2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <AlertTriangle size={22} />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#7F1D1D', maxWidth: 420, marginBottom: 18 }}>{message}</p>

      {onRetry && (
        <button onClick={onRetry} className="ca-btn ca-btn-secondary ca-btn-sm" style={{ gap: 6 }}>
          <RotateCcw size={14} />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
