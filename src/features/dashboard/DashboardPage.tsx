import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClimate } from '../../store/ClimateContext';
import { CloudRain, Thermometer, Sprout, ArrowRight, MapPin, Database, CheckCircle2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { resolvedGridCell, selectedDataset } = useClimate();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40, padding: '20px 0' }}>
      {/* 1. ClimAnalytix Hero Header */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}
        >
          Explore Historical Weather Data
        </h1>
        <p style={{ fontSize: 16, color: '#64748B', maxWidth: 640, margin: '0 auto', lineHeight: 1.5 }}>
          Access high-resolution gridded rainfall, temperature, and crop risk analytics across India (1979–2026).
        </p>

        {/* Selected Location Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 20,
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            borderRadius: 9999,
            padding: '6px 16px',
            fontSize: 12,
            color: '#334155',
          }}
        >
          <MapPin size={14} color="#1D4ED8" />
          <span>
            Active Grid: <strong>{resolvedGridCell.id}</strong> ({resolvedGridCell.lat.toFixed(2)}°N, {resolvedGridCell.lon.toFixed(2)}°E)
          </span>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <span style={{ color: '#1D4ED8', fontWeight: 600 }}>{selectedDataset} 0.25°</span>
        </div>
      </div>

      {/* 2. Three Primary Feature Cards matching ClimAnalytix Home Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}
      >
        {/* Card 1: Rainfall Analysis */}
        <div
          className="ca-card"
          style={{
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 150ms ease',
          }}
        >
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#EFF6FF',
                color: '#1D4ED8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <CloudRain size={26} />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
              Rainfall Analysis
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
              Analyse multi-day rainfall event detection, yearly counts, long-term trends, and synchronized
              observational actual, normal, and percentage anomaly GIS maps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />
                <span>Event Analyzer with break-day tolerances</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />
                <span>Annual event frequency bar distribution</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB' }} />
                <span>30-year climatological normal comparison</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/rainfall/events')}
            className="ca-btn"
            style={{
              width: '100%',
              height: 44,
              borderRadius: 10,
              background: '#1D4ED8',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span>Explore Rainfall</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 2: Temperature Analysis */}
        <div
          className="ca-card"
          style={{
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 150ms ease',
          }}
        >
          <div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#FFF7ED',
                color: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Thermometer size={26} />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
              Temperature Analysis
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
              Track daily maximum temperature (2m Tmax), heat spell durations, hot-day frequency records
              (Tmax ≥ 40°C), and thermal anomaly distributions across India.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EA580C' }} />
                <span>Heatwave spell detection (Tmax ≥ 40°C)</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EA580C' }} />
                <span>Longest continuous hot days streak tracker</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EA580C' }} />
                <span>Synchronized actual, normal & anomaly maps</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/temperature/events')}
            className="ca-btn"
            style={{
              width: '100%',
              height: 44,
              borderRadius: 10,
              background: '#EA580C',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span>Explore Temperature</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 3: Crop Analytics */}
        <div
          className="ca-card"
          style={{
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 150ms ease',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sprout size={26} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#FEF3C7',
                  color: '#92400E',
                  padding: '3px 10px',
                  borderRadius: 9999,
                  border: '1px solid #FDE68A',
                  letterSpacing: '0.04em',
                }}
              >
                PHASE 2 PREVIEW
              </span>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>
              Crop Analytics
            </h3>

            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>
              Demonstrator preview for future agro-insurance intelligence covering district coverage, sowing and harvest progress,
              historical drought (1901–2020), and cyclone risk correlations (planned for Phase 2).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <span>11 Agro-Insurance & Yield Demonstrator Modules</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <span>Sowing status, calendar & drought trends</span>
              </div>
              <div style={{ fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <span>Phase 2 pipeline: Non-MVP demonstrator</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/crop-dashboard')}
            className="ca-btn"
            style={{
              width: '100%',
              height: 44,
              borderRadius: 10,
              background: '#059669',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span>Explore Crop Analytics (Phase 2)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3. Operational Dataset Catalog Summary Bar */}
      <div
        className="ca-card"
        style={{
          borderRadius: 12,
          padding: '18px 24px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#F1F5F9',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Database size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
              Operational Meteorological Datasets
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              ECMWF Copernicus ERA5 Reanalysis & India Meteorological Department (IMD)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, color: '#334155' }}>
          <div>
            <strong>Spatial Resolution:</strong> 0.25° (~27 km)
          </div>
          <div>
            <strong>Temporal Span:</strong> 1979–2026 (Daily)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#065F46', fontWeight: 600 }}>
            <CheckCircle2 size={14} color="#10B981" />
            <span>Active Feed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
