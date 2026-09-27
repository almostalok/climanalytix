import React from 'react';
import { SearchX, Filter } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  suggestions?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No events found',
  description = 'No observational events matched the selected criteria and date range.',
  actionText,
  onAction,
  suggestions = ['Lowering the threshold cutoff', 'Widening the date range span', 'Increasing allowed break days'],
}) => {
  return (
    <div
      className="ca-card"
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#F1F5F9',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <SearchX size={24} />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#667085', maxWidth: 440, marginBottom: 18 }}>{description}</p>

      {suggestions && suggestions.length > 0 && (
        <div
          style={{
            background: '#F8F9FA',
            border: '1px solid #E4E7EC',
            borderRadius: 6,
            padding: '12px 18px',
            fontSize: 12,
            textAlign: 'left',
            marginBottom: 20,
            maxWidth: 380,
          }}
        >
          <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={12} />
            <span>Recommended adjustments:</span>
          </div>
          <ul style={{ paddingLeft: 18, color: '#4B5563', lineHeight: 1.6 }}>
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {actionText && onAction && (
        <button onClick={onAction} className="ca-btn ca-btn-secondary ca-btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
