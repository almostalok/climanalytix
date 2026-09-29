import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ClimateVariable, Dataset, DatasetMetadata, ComparisonOperator } from '../types/climate';
import { GridCell, Region } from '../types/geo';
import { climateDataProvider } from '../data/createClimateDataProvider';
import { findNearestGridCell } from '../packages/climate-engine/grid';

interface ClimateContextType {
  // Datasets
  manifest: DatasetMetadata[];
  selectedDataset: Dataset;
  setSelectedDataset: (ds: Dataset) => void;
  datasetMeta: DatasetMetadata | undefined;

  // Regions & Grids catalog
  regions: Region[];
  gridCells: GridCell[];

  // Location filter state
  locationMode: 'region' | 'point';
  setLocationMode: (mode: 'region' | 'point') => void;

  selectedStateId: string;
  setSelectedStateId: (id: string) => void;
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;
  selectedBlockId: string;
  setSelectedBlockId: (id: string) => void;

  pointLat: number;
  setPointLat: (lat: number) => void;
  pointLon: number;
  setPointLon: (lon: number) => void;
  setPoint: (lat: number, lon: number) => void;

  resolvedGridCell: GridCell;

  // Date range
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;

  // Rainfall criteria
  rainThreshold: number;
  setRainThreshold: (t: number) => void;
  rainBreakDays: number;
  setRainBreakDays: (b: number) => void;
  cumulativeDays: number;
  setCumulativeDays: (c: number) => void;
  comparisonOperator: ComparisonOperator;
  setComparisonOperator: (op: ComparisonOperator) => void;

  // Temperature criteria
  tempThreshold: number;
  setTempThreshold: (t: number) => void;
  tempBreakDays: number;
  setTempBreakDays: (b: number) => void;

  // Normal period (10, 20, 30 years)
  normalPeriod: 10 | 20 | 30;
  setNormalPeriod: (p: 10 | 20 | 30) => void;

  // Analysis execution state
  hasAppliedFilters: boolean;
  setHasAppliedFilters: (v: boolean) => void;

  // Trigger analysis for live re-computation
  analysisTrigger: number;
  triggerAnalysis: () => void;

  // Reset helper
  resetFilters: () => void;
  querySummaryText: (variable: ClimateVariable) => string;
}

const ClimateContext = createContext<ClimateContextType | undefined>(undefined);

export const ClimateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifest, setManifest] = useState<DatasetMetadata[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset>('ERA5');
  const [regions, setRegions] = useState<Region[]>([]);
  const [gridCells, setGridCells] = useState<GridCell[]>([]);

  // Location (Initially unselected matching ClimAnalytix)
  const [locationMode, setLocationMode] = useState<'region' | 'point'>('region');
  const [selectedStateId, setSelectedStateIdState] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictIdState] = useState<string>('');
  const [selectedBlockId, setSelectedBlockIdState] = useState<string>('');

  // Point coordinates
  const [pointLat, setPointLat] = useState<number>(0);
  const [pointLon, setPointLon] = useState<number>(0);

  // Date range
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');

  // Criteria
  const [rainThreshold, setRainThreshold] = useState<number>(0);
  const [rainBreakDays, setRainBreakDays] = useState<number>(0);
  const [cumulativeDays, setCumulativeDays] = useState<number>(1);
  const [comparisonOperator, setComparisonOperator] = useState<ComparisonOperator>('>=');

  const [tempThreshold, setTempThreshold] = useState<number>(35);
  const [tempBreakDays, setTempBreakDays] = useState<number>(0);

  const [normalPeriod, setNormalPeriod] = useState<10 | 20 | 30>(30);
  const [hasAppliedFilters, setHasAppliedFilters] = useState<boolean>(false);
  const [analysisTrigger, setAnalysisTrigger] = useState<number>(0);

  const triggerAnalysis = useCallback(() => {
    setHasAppliedFilters(true);
    setAnalysisTrigger((prev) => prev + 1);
  }, []);

  // Load initial metadata, regions, grids
  useEffect(() => {
    async function init() {
      try {
        const [m, r, g] = await Promise.all([
          climateDataProvider.getManifest(),
          climateDataProvider.getRegions(),
          climateDataProvider.getGridCells(),
        ]);
        setManifest(m);
        setRegions(r);
        setGridCells(g);
      } catch (err) {
        console.warn('Failed to load climate metadata, falling back to static catalogue:', err);
        const { REGIONS } = await import('../data/regions');
        const { GRID_CELLS } = await import('../data/gridCells');
        const { DATASET_MANIFEST } = await import('../data/MockClimateDataProvider');
        setManifest(DATASET_MANIFEST);
        setRegions(REGIONS);
        setGridCells(GRID_CELLS);
      }
    }
    init();
  }, []);

  // Cascading Region Resets with centroid synchronization
  const setSelectedStateId = useCallback((stateId: string) => {
    setSelectedStateIdState(stateId);
    setSelectedDistrictIdState('');
    setSelectedBlockIdState('');
    if (stateId) {
      const stateObj = regions.find((r) => r.id === stateId);
      if (stateObj?.centroid) {
        setPointLat(stateObj.centroid[0]);
        setPointLon(stateObj.centroid[1]);
      }
    }
  }, [regions]);

  const setSelectedDistrictId = useCallback((districtId: string) => {
    setSelectedDistrictIdState(districtId);
    setSelectedBlockIdState('');
    if (districtId) {
      const distObj = regions.find((r) => r.id === districtId);
      if (distObj?.centroid) {
        setPointLat(distObj.centroid[0]);
        setPointLon(distObj.centroid[1]);
      }
    }
  }, [regions]);

  const setSelectedBlockId = useCallback((blockId: string) => {
    setSelectedBlockIdState(blockId);
    if (blockId) {
      const matchGrid = gridCells.find((c) => c.blockId === blockId);
      if (matchGrid) {
        setPointLat(matchGrid.lat);
        setPointLon(matchGrid.lon);
      }
    }
  }, [gridCells]);

  const setPoint = useCallback((lat: number, lon: number) => {
    setPointLat(Math.round(lat * 10000) / 10000);
    setPointLon(Math.round(lon * 10000) / 10000);
  }, []);

  // Compute resolved grid cell
  const resolvedGridCell = useMemo<GridCell>(() => {
    if (gridCells.length === 0) {
      return {
        id: '28.50_77.50',
        lat: 28.5,
        lon: 77.5,
        dataset: selectedDataset,
        resolution: 0.25,
        name: 'Dadri / Greater Noida (UP)',
      };
    }

    if (locationMode === 'point') {
      const snapped = findNearestGridCell(pointLat, pointLon, gridCells);
      return { ...snapped, dataset: selectedDataset };
    }

    // Region mode resolution
    if (selectedBlockId) {
      const match = gridCells.find((c) => c.blockId === selectedBlockId);
      if (match) return { ...match, dataset: selectedDataset };
    }
    if (selectedDistrictId) {
      const match = gridCells.find((c) => c.districtId === selectedDistrictId);
      if (match) return { ...match, dataset: selectedDataset };
    }
    if (selectedStateId) {
      const match = gridCells.find((c) => c.stateId === selectedStateId);
      if (match) return { ...match, dataset: selectedDataset };
    }

    return { ...gridCells[0], dataset: selectedDataset };
  }, [
    gridCells,
    locationMode,
    pointLat,
    pointLon,
    selectedBlockId,
    selectedDistrictId,
    selectedStateId,
    selectedDataset,
  ]);

  const datasetMeta = useMemo(() => {
    return manifest.find((m) => m.id === selectedDataset) || manifest[0];
  }, [manifest, selectedDataset]);

  const resetFilters = useCallback(() => {
    setSelectedStateIdState('');
    setSelectedDistrictIdState('');
    setSelectedBlockIdState('');
    setPointLat(0);
    setPointLon(0);
    setStartDate('2024-01-01');
    setEndDate('2024-12-31');
    setRainThreshold(0);
    setRainBreakDays(0);
    setCumulativeDays(1);
    setComparisonOperator('>=');
    setTempThreshold(35);
    setTempBreakDays(0);
    setNormalPeriod(30);
    setHasAppliedFilters(false);
    setAnalysisTrigger((prev) => prev + 1);
  }, []);

  const querySummaryText = useCallback(
    (variable: ClimateVariable) => {
      const isRain = variable === 'rainfall';
      const locLabel =
        locationMode === 'region'
          ? [
              regions.find((r) => r.id === selectedStateId)?.name,
              regions.find((r) => r.id === selectedDistrictId)?.name,
              regions.find((r) => r.id === selectedBlockId)?.name,
            ]
              .filter(Boolean)
              .join(' > ') || resolvedGridCell.name || resolvedGridCell.id
          : `Point (${pointLat.toFixed(4)}°N, ${pointLon.toFixed(4)}°E) → Grid ${resolvedGridCell.id}`;

      const thresholdVal = isRain ? `${rainThreshold} mm` : `${tempThreshold}°C`;
      const breakVal = isRain ? `${rainBreakDays} day` : `${tempBreakDays} day`;

      return `${selectedDataset} • ${locLabel} • ${startDate} to ${endDate} • Threshold ≥ ${thresholdVal} • Max Break: ${breakVal}`;
    },
    [
      selectedDataset,
      locationMode,
      selectedStateId,
      selectedDistrictId,
      selectedBlockId,
      regions,
      resolvedGridCell,
      pointLat,
      pointLon,
      startDate,
      endDate,
      rainThreshold,
      rainBreakDays,
      tempThreshold,
      tempBreakDays,
    ]
  );

  return (
    <ClimateContext.Provider
      value={{
        manifest,
        selectedDataset,
        setSelectedDataset,
        datasetMeta,
        regions,
        gridCells,
        locationMode,
        setLocationMode,
        selectedStateId,
        setSelectedStateId,
        selectedDistrictId,
        setSelectedDistrictId,
        selectedBlockId,
        setSelectedBlockId,
        pointLat,
        setPointLat,
        pointLon,
        setPointLon,
        setPoint,
        resolvedGridCell,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        rainThreshold,
        setRainThreshold,
        rainBreakDays,
        setRainBreakDays,
        cumulativeDays,
        setCumulativeDays,
        comparisonOperator,
        setComparisonOperator,
        tempThreshold,
        setTempThreshold,
        tempBreakDays,
        setTempBreakDays,
        normalPeriod,
        setNormalPeriod,
        hasAppliedFilters,
        setHasAppliedFilters,
        analysisTrigger,
        triggerAnalysis,
        resetFilters,
        querySummaryText,
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
};

export const useClimate = (): ClimateContextType => {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error('useClimate must be used within a ClimateProvider');
  }
  return context;
};
