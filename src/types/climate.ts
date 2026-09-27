import { GridCell } from './geo';

export type Dataset = 'ERA5' | 'IMD';

export type ClimateVariable = 'rainfall' | 'temperature';

export type ComparisonOperator = '>=' | '>' | '<=' | '<';

export type AggregationMode = 'daily' | 'monthly' | 'yearly';

export type NormalPeriod = 10 | 20 | 30;

export interface TimeSeriesDataPoint {
  date: string; // YYYY-MM-DD
  value: number;
  variable: ClimateVariable;
  unit: string;
  lat: number;
  lon: number;
  refGrid: string;
}

export interface ClimateEvent {
  id: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  unit: string;
  lat: number;
  lon: number;
  refGrid: string;
  cumulativeDays: number;
  breakDays: number;
  threshold: number;
  operator: ComparisonOperator;
  variable: ClimateVariable;
  avgDailyValue: number;
  maxDailyValue: number;
}

export interface YearlyEventCount {
  year: number;
  refGrid: string;
  eventCount: number;
  totalRainfall?: number;
  avgDurationDays?: number;
}

export interface TrendDataPoint {
  period: string; // YYYY, YYYY-MM, or YYYY-MM-DD
  date: string;
  value: number;
  count: number;
}

export interface TrendStatistics {
  min: number;
  max: number;
  avg: number;
  total: number;
  count: number;
}

export interface TrendResult {
  data: TrendDataPoint[];
  stats: TrendStatistics;
}

export interface AnomalyResult {
  actual: number;
  normal: number;
  anomalyPct: number | 'n/a';
  anomalyFormatted: string; // e.g. "+24.2%" or "-18.5%" or "n/a"
  anomalyAbsolute: number;
  unit: string;
}

export interface HotDaysResult {
  hotDaysCount: number;
  longestStreak: number;
  highestTemperature: number;
  days: {
    date: string;
    temperature: number;
    refGrid: string;
    dayOfWeek?: string;
  }[];
}

export interface LocationFilter {
  mode: 'region' | 'point';
  stateId?: string;
  districtId?: string;
  blockId?: string;
  point?: { lat: number; lon: number };
  resolvedGrid?: GridCell;
}

export interface EventCriteria {
  threshold: number;
  comparison: ComparisonOperator;
  breakDays: number;
}

export interface DatasetMetadata {
  id: Dataset;
  name: string;
  resolution: string;
  startYear: number;
  endYear: number;
  latestDate: string;
  status: 'Available' | 'Updating';
  description: string;
}
