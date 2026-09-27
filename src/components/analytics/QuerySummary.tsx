import React from 'react';
import { useClimate } from '../../store/ClimateContext';
import { ClimateVariable } from '../../types/climate';
import { Sliders, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface QuerySummaryProps {
  variable: ClimateVariable;
  eventsCount?: number;
}

export const QuerySummary: React.FC<QuerySummaryProps> = ({ variable, eventsCount }) => {
  const { querySummaryText, resolvedGridCell } = useClimate();
  const summaryText = querySummaryText(variable);

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E4E7EC',
        borderRadius: 6,
        padding: '10px 16px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#1E40AF', fontWeight: 600 }}>
          <Sliders size={14} />
          <span>Active Query Parameters:</span>
        </div>
        <span style={{ color: '#374151', fontFamily: 'var(--font-mono)' }}>{summaryText}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            background: '#F1F5F9',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            color: '#475569',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Ref: {resolvedGridCell.id} ({resolvedGridCell.lat.toFixed(2)}°N, {resolvedGridCell.lon.toFixed(2)}°E)
        </div>

        {eventsCount !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#065F46', fontWeight: 600 }}>
            <CheckCircle2 size={13} color="#10B981" />
            <span>{eventsCount} events matched</span>
          </div>
        )}
      </div>
    </div>
  );
};
