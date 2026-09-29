import React from 'react';

interface ReferenceMapLegendsProps {
  variable?: 'rainfall' | 'temperature';
}

export const ReferenceMapLegends: React.FC<ReferenceMapLegendsProps> = ({ variable = 'rainfall' }) => {
  const isRain = variable === 'rainfall';

  if (!isRain) {
    // Temperature legends
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 16,
          marginTop: 12,
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            padding: '12px 20px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              height: 18,
              borderRadius: 3,
              background: 'linear-gradient(to right, #93C5FD, #BAE6FD, #FDE68A, #F59E0B, #F97316, #EF4444, #B91C1C, #7F1D1D)',
              marginBottom: 6,
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#374151',
              fontWeight: 500,
            }}
          >
            <span>20</span>
            <span>24</span>
            <span>28</span>
            <span>32</span>
            <span>36</span>
            <span>40</span>
            <span>44</span>
            <span>48</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#111827', marginTop: 4 }}>
            Temperature (°C)
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            padding: '12px 20px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', height: 18, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ flex: 1, background: '#1D4ED8' }} />
            <div style={{ flex: 1, background: '#60A5FA' }} />
            <div style={{ flex: 1, background: '#E2E8F0' }} />
            <div style={{ flex: 1, background: '#F97316' }} />
            <div style={{ flex: 1, background: '#DC2626' }} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#374151',
              fontWeight: 500,
            }}
          >
            <span>&lt; -4°C</span>
            <span>-2°C</span>
            <span>0°C</span>
            <span>+2°C</span>
            <span>&gt; +4°C</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#111827', marginTop: 4 }}>
            Temperature Anomaly (°C Departure)
          </div>
        </div>
      </div>
    );
  }

  // Exact reference platform legends for Rainfall
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
        marginTop: 12,
      }}
    >
      {/* Left: Continuous gradient for Actual (mm) and Normal (mm) spanning maps 1 & 2 */}
      <div
        style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 6,
          padding: '12px 24px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            height: 18,
            borderRadius: 2,
            background: 'linear-gradient(to right, #EF4444 0%, #F97316 11%, #FBBF24 22%, #A3E635 33%, #22C55E 44%, #06B6D4 55%, #38BDF8 66%, #2563EB 77%, #1D4ED8 88%, #1E1B4B 100%)',
            marginBottom: 6,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#111827',
            fontWeight: 500,
          }}
        >
          <span>52</span>
          <span>86</span>
          <span>120</span>
          <span>154</span>
          <span>188</span>
          <span>222</span>
          <span>256</span>
          <span>290</span>
          <span>324</span>
          <span>358</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111827', marginTop: 4 }}>
          Rainfall (mm)
        </div>
      </div>

      {/* Right: Discrete segments for Anomaly (%) under Map 3 */}
      <div
        style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 6,
          padding: '12px 24px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', height: 18, borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ flex: 1, background: '#9CA3AF' }} title="-100%" />
          <div style={{ flex: 1, background: '#DC2626' }} title="-99% to -60%" />
          <div style={{ flex: 1, background: '#F97316' }} title="-60% to -19%" />
          <div style={{ flex: 1, background: '#E2E8F0' }} title="-19% to 20%" />
          <div style={{ flex: 1, background: '#38BDF8' }} title="20% to 60%" />
          <div style={{ flex: 1.2, background: '#1D4ED8' }} title=">=60%" />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#111827',
            fontWeight: 500,
          }}
        >
          <span>-100%</span>
          <span>-99%</span>
          <span>-60%</span>
          <span>-19%</span>
          <span>20%</span>
          <span>&gt;=60%</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#111827', marginTop: 4 }}>
          Rainfall Anomaly (%)
        </div>
      </div>
    </div>
  );
};
