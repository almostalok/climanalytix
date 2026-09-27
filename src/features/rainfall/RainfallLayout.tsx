import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useClimate } from '../../store/ClimateContext';
import { FilterSidebar } from '../../components/filters/FilterSidebar';
import { CloudRain, Calendar, Layers, Activity, MapPin } from 'lucide-react';

export const RainfallLayout: React.FC = () => {
  const { selectedDataset, setSelectedDataset, manifest, datasetMeta } = useClimate();
  const location = useLocation();

  // Determine if we should show criteria in sidebar (yes for events, no for viz if needed)
  const isViz = location.pathname.includes('/visualization');

  return (
    <div>
      {/* Page Header (Exact ClimAnalytix style) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloudRain size={20} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>
            Rainfall Analysis
          </h2>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, paddingLeft: 42 }}>
          Analyse historical gridded rainfall events patterns using Location grid points across India.
        </p>
      </div>

      {/* Top Data Source & Metadata Banner (Exact ClimAnalytix style) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 6,
          padding: '10px 18px',
          marginBottom: 18,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              Data Source:
            </span>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value as any)}
              className="ca-select"
              style={{ height: 32, padding: '0 10px', fontSize: 13, width: 'auto', fontWeight: 600, color: '#2563EB' }}
            >
              {manifest.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563' }}>
            <Calendar size={14} color="#6B7280" />
            <span>
              Data Available for <strong>Jan 1, 1975 - Sep 26, 2026</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4B5563' }}>
            <Layers size={14} color="#6B7280" />
            <span>
              Resolution: <strong>{datasetMeta?.resolution || '0.25°'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs (Exact ClimAnalytix: Event Analyzer | Visualization) */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid #E5E7EB',
          marginBottom: 20,
        }}
      >
        <NavLink
          to="/rainfall/events"
          className={({ isActive }) => `ca-tab-item ${isActive ? 'active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 600,
            color: '#4B5563',
            borderBottom: '2px solid transparent',
            marginBottom: -1,
            textDecoration: 'none',
          }}
        >
          <Activity size={16} />
          <span>Event Analyzer</span>
        </NavLink>

        <NavLink
          to="/rainfall/visualization"
          className={({ isActive }) => `ca-tab-item ${isActive ? 'active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 600,
            color: '#4B5563',
            borderBottom: '2px solid transparent',
            marginBottom: -1,
            textDecoration: 'none',
          }}
        >
          <MapPin size={16} />
          <span>Visualizations</span>
        </NavLink>
      </div>

      {/* 2-Column Responsive Layout: Left Sidebar Filters + Right Main Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 20,
          alignItems: 'start',
        }}
        className="ca-responsive-grid"
      >
        {/* Left Filter Sidebar */}
        <div>
          <FilterSidebar variable="rainfall" showCriteria={!isViz} />
        </div>

        {/* Right Tab Content */}
        <div style={{ minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
