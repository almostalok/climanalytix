import { ClimateVariable, Dataset, DatasetMetadata, NormalPeriod, TimeSeriesDataPoint } from './climate';
import { GridCell, Region } from './geo';

export interface TimeSeriesQuery {
  dataset: Dataset;
  gridId: string;
  variable: ClimateVariable;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface DailyGridQuery {
  dataset: Dataset;
  variable: ClimateVariable;
  date: string; // YYYY-MM-DD
  normalPeriod?: NormalPeriod;
}

export interface DailyGridPoint {
  id: string;
  lat: number;
  lon: number;
  value: number; // Actual
  normal: number; // Climatological normal
  anomalyPct: number | 'n/a';
  anomalyFormatted: string;
  unit: string;
  regionName: string;
}

export interface DailyGridSnapshot {
  date: string;
  dataset: Dataset;
  variable: ClimateVariable;
  unit: string;
  cells: DailyGridPoint[];
}

export interface ClimateDataProvider {
  getManifest(): Promise<DatasetMetadata[]>;
  getRegions(): Promise<Region[]>;
  getGridCells(dataset?: Dataset): Promise<GridCell[]>;
  getTimeSeries(query: TimeSeriesQuery): Promise<TimeSeriesDataPoint[]>;
  getDailyGrid(query: DailyGridQuery): Promise<DailyGridSnapshot>;
  getGridCellById(gridId: string): Promise<GridCell | null>;
}
