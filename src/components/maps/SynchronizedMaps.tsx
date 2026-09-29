import React, { useState, useEffect } from 'react';
import { ClimateMap, ViewState, BasemapMode } from './ClimateMap';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';
import { DistrictGISData } from '../../data/districtBoundaries';
import { ReferenceMapLegends } from './ReferenceMapLegends';
import { Layers, MapPin, Compass } from 'lucide-react';

interface SynchronizedMapsProps {
  variable: ClimateVariable;
  dataset: Dataset;
  date: string;
  gridPoints: DailyGridPoint[];
  districtGIS?: DistrictGISData | null;
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
  districtGIS,
  selectedGridId,
  onMapClick,
  unit,
  targetCenter,
  targetZoom,
}) => {
  // Shared viewport state across all 3 maps (defaults to India national overview when unselected)
  const [viewState, setViewState] = useState<ViewState>({
    center: targetCenter || [22.8, 79.5],
    zoom: targetZoom || 5,
  });

  // Default basemap is detailed Satellite Hybrid with City Names
  const [basemap, setBasemap] = useState<BasemapMode>('satellite');

  // Sync when targetCenter or district changes
  useEffect(() => {
    if (targetCenter && targetCenter[0] !== 0 && targetCenter[1] !== 0) {
      setViewState({
        center: targetCenter,
        zoom: targetZoom || (districtGIS ? 8 : 5),
      });
    }
  }, [targetCenter, targetZoom, districtGIS]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Professional GIS Control & Layer Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          padding: '8px 16px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        {/* Layer / Region Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {districtGIS ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                {districtGIS.name}
              </span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>
                ({districtGIS.blocks.length} raster blocks mapped)
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4B5563' }}>
              <Compass size={15} color="#2563EB" />
              <span style={{ fontWeight: 600, color: '#1F2937' }}>All India National View</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>• Select State & District in Filters to inspect raster blocks</span>
            </div>
          )}
        </div>

        {/* Basemap Switcher Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 2, fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
            <Layers size={14} />
            <span>Map Style:</span>
          </div>

          <button
            type="button"
            onClick={() => setBasemap('satellite')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'satellite' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'satellite' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'satellite' ? '#1D4ED8' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🛰️ Satellite (Cities & Places)
          </button>

          <button
            type="button"
            onClick={() => setBasemap('streets')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'streets' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'streets' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'streets' ? '#1D4ED8' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🗺️ Topo / Streets
          </button>

          <button
            type="button"
            onClick={() => setBasemap('light')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'light' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'light' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'light' ? '#1D4ED8' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            ☀️ Light
          </button>

          <button
            type="button"
            onClick={() => setBasemap('dark')}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 5,
              border: basemap === 'dark' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
              background: basemap === 'dark' ? '#EFF6FF' : '#FFFFFF',
              color: basemap === 'dark' ? '#1D4ED8' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      {/* 3 Synchronized Maps Side-by-Side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}
        className="ca-sync-maps-grid"
      >
        {/* Map 1: Actual */}
        <ClimateMap
          title="Actual"
          type="actual"
          variable={variable}
          dataset={dataset}
          date={date}
          gridPoints={gridPoints}
          districtGIS={districtGIS}
          selectedGridId={selectedGridId}
          viewState={viewState}
          onViewStateChange={setViewState}
          onMapClick={onMapClick}
          unit={unit}
          basemap={basemap}
        />

        {/* Map 2: Normal */}
        <ClimateMap
          title="Normal"
          type="normal"
          variable={variable}
          dataset={dataset}
          date={date}
          gridPoints={gridPoints}
          districtGIS={districtGIS}
          selectedGridId={selectedGridId}
          viewState={viewState}
          onViewStateChange={setViewState}
          onMapClick={onMapClick}
          unit={unit}
          basemap={basemap}
        />

        {/* Map 3: Anomaly */}
        <ClimateMap
          title="Anomaly"
          type="anomaly"
          variable={variable}
          dataset={dataset}
          date={date}
          gridPoints={gridPoints}
          districtGIS={districtGIS}
          selectedGridId={selectedGridId}
          viewState={viewState}
          onViewStateChange={setViewState}
          onMapClick={onMapClick}
          unit={unit}
          basemap={basemap}
        />
      </div>

      {/* Exact Reference Platform Legends at bottom */}
      <ReferenceMapLegends variable={variable} />
    </div>
  );
};
