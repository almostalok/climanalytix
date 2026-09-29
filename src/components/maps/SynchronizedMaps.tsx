import React, { useState, useEffect } from 'react';
import { ClimateMap, ViewState } from './ClimateMap';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';
import { Map, Moon, Sun, Globe } from 'lucide-react';

interface SynchronizedMapsProps {
  variable: ClimateVariable;
  dataset: Dataset;
  date: string;
  gridPoints: DailyGridPoint[];
  selectedGridId?: string;
  onMapClick?: (lat: number, lon: number) => void;
  unit: string;
  targetCenter?: [number, number];
  targetZoom?: number;
}

export const SynchronizedMaps: React.FC<SynchronizedMapsProps> = ({
  variable,
  dataset,
  date,
  gridPoints,
  selectedGridId,
  onMapClick,
  unit,
  targetCenter,
  targetZoom,
}) => {
  // Shared viewport state across all 3 maps
  const [viewState, setViewState] = useState<ViewState>({
    center: [22.5, 79.5],
    zoom: 5,
  });

  const [basemap, setBasemap] = useState<'light' | 'dark' | 'satellite'>('light');

  // React to target center changes (e.g. state/district selected or pin dropped)
  useEffect(() => {
    if (targetCenter && targetCenter[0] !== 0 && targetCenter[1] !== 0) {
      setViewState({
        center: targetCenter,
        zoom: targetZoom || (targetCenter[0] === 22.5 ? 5 : 7),
      });
    }
  }, [targetCenter, targetZoom]);

  return (
    <div>
      {/* Top Map Sync Toolbar with Basemap Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 12,
          padding: '8px 14px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
          <Map size={16} color="#2563EB" />
          <span style={{ fontWeight: 600 }}>Tri-Synchronized Spatial Projection</span>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            ({gridPoints.length} observation grid cells active)
          </span>
        </div>

        {/* Basemap Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 12, color: '#6B7280', marginRight: 4, fontWeight: 500 }}>Basemap:</span>
          <button
            type="button"
            onClick={() => setBasemap('light')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'light' ? '1px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'light' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'light' ? '#1D4ED8' : '#4B5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Sun size={12} />
            <span>Light Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setBasemap('dark')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'dark' ? '1px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'dark' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'dark' ? '#1D4ED8' : '#4B5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Moon size={12} />
            <span>Dark Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setBasemap('satellite')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'satellite' ? '1px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'satellite' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'satellite' ? '#1D4ED8' : '#4B5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Globe size={12} />
            <span>Satellite</span>
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Panel 1: Actual */}
        <ClimateMap
          title="1. Observational Actual"
          type="actual"
          variable={variable}
          dataset={dataset}
          date={date}
          gridPoints={gridPoints}
          selectedGridId={selectedGridId}
          viewState={viewState}
          onViewStateChange={setViewState}
          onMapClick={onMapClick}
          unit={unit}
          basemap={basemap}
        />

        {/* Panel 2: Climatological Normal */}
        <ClimateMap
          title="2. Climatological Normal"
          type="normal"
          variable={variable}
          dataset={dataset}
          date={date}
          gridPoints={gridPoints}
          selectedGridId={selectedGridId}
          viewState={viewState}
          onViewStateChange={setViewState}
          onMapClick={onMapClick}
          unit={unit}
          basemap={basemap}
        />

        {/* Panel 3: Anomaly */}
        <ClimateMap
          title="3. Climatological Anomaly"
          type="anomaly"
          variable={variable}
          dataset={dataset}
          date={date}
          gridPoints={gridPoints}
          selectedGridId={selectedGridId}
          viewState={viewState}
          onViewStateChange={setViewState}
          onMapClick={onMapClick}
          unit={unit}
          basemap={basemap}
        />
      </div>
    </div>
  );
};
