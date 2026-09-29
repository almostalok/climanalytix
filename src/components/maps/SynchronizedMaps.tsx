import React, { useState, useEffect } from 'react';
import { ClimateMap, ViewState } from './ClimateMap';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';
import { DistrictGISData } from '../../data/districtBoundaries';
import { ReferenceMapLegends } from './ReferenceMapLegends';

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
  // Shared viewport state across all 3 maps (defaults to ASR district / AP view matching reference)
  const [viewState, setViewState] = useState<ViewState>({
    center: targetCenter || [18.05, 82.25],
    zoom: targetZoom || 8,
  });

  // Sync when targetCenter or district changes
  useEffect(() => {
    if (targetCenter && targetCenter[0] !== 0 && targetCenter[1] !== 0) {
      setViewState({
        center: targetCenter,
        zoom: targetZoom || 8,
      });
    }
  }, [targetCenter, targetZoom]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 3 Synchronized Maps Side-by-Side matching reference platform */}
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
        />
      </div>

      {/* Exact Reference Platform Legends at bottom */}
      <ReferenceMapLegends variable={variable} />
    </div>
  );
};
