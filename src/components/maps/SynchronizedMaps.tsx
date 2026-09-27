import React, { useState } from 'react';
import { ClimateMap, ViewState } from './ClimateMap';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';

interface SynchronizedMapsProps {
  variable: ClimateVariable;
  dataset: Dataset;
  date: string;
  gridPoints: DailyGridPoint[];
  selectedGridId?: string;
  onMapClick?: (lat: number, lon: number) => void;
  unit: string;
}

export const SynchronizedMaps: React.FC<SynchronizedMapsProps> = ({
  variable,
  dataset,
  date,
  gridPoints,
  selectedGridId,
  onMapClick,
  unit,
}) => {
  // Shared viewport state across all 3 maps
  const [viewState, setViewState] = useState<ViewState>({
    center: [22.5, 79.5],
    zoom: 5,
  });

  return (
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
      />
    </div>
  );
};
