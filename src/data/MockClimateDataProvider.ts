import { ClimateDataProvider, DailyGridPoint, DailyGridQuery, DailyGridSnapshot, TimeSeriesQuery } from '../types/provider';
import { Dataset, DatasetMetadata, TimeSeriesDataPoint } from '../types/climate';
import { GridCell, Region } from '../types/geo';
import { REGIONS } from './regions';
import { GRID_CELLS } from './gridCells';
import { generateDailySeriesForGrid } from './seededDataGenerator';
import { calculateAnomaly } from '../packages/climate-engine/normal';

export const DATASET_MANIFEST: DatasetMetadata[] = [
  {
    id: 'ERA5',
    name: 'ERA5 Reanalysis',
    resolution: '0.25° (~27 km)',
    startYear: 1979,
    endYear: 2026,
    latestDate: '2026-09-15',
    status: 'Available',
    description: 'ECMWF atmospheric reanalysis of the global climate. High-resolution gridded observational assimilation.',
  },
  {
    id: 'IMD',
    name: 'IMD High-Resolution Gridded',
    resolution: '0.25° (~27 km)',
    startYear: 1975,
    endYear: 2026,
    latestDate: '2026-09-15',
    status: 'Available',
    description: 'India Meteorological Department operational daily gridded rainfall and temperature station-interpolated dataset.',
  },
];

export class MockClimateDataProvider implements ClimateDataProvider {
  // In-memory cache to ensure extreme performance across tab switches
  private seriesCache = new Map<string, TimeSeriesDataPoint[]>();

  async getManifest(): Promise<DatasetMetadata[]> {
    return DATASET_MANIFEST;
  }

  async getRegions(): Promise<Region[]> {
    return REGIONS;
  }

  async getGridCells(dataset: Dataset = 'ERA5'): Promise<GridCell[]> {
    return GRID_CELLS.map((c) => ({ ...c, dataset }));
  }

  async getGridCellById(gridId: string): Promise<GridCell | null> {
    const found = GRID_CELLS.find((c) => c.id === gridId);
    return found || null;
  }

  async getTimeSeries(query: TimeSeriesQuery): Promise<TimeSeriesDataPoint[]> {
    const cacheKey = `${query.dataset}_${query.gridId}_${query.variable}_${query.startDate}_${query.endDate}`;
    if (this.seriesCache.has(cacheKey)) {
      return this.seriesCache.get(cacheKey)!;
    }

    const cell = GRID_CELLS.find((c) => c.id === query.gridId) || GRID_CELLS[0];
    const data = generateDailySeriesForGrid(
      cell,
      query.variable,
      query.startDate,
      query.endDate,
      query.dataset
    );

    this.seriesCache.set(cacheKey, data);
    return data;
  }

  async getDailyGrid(query: DailyGridQuery): Promise<DailyGridSnapshot> {
    const date = query.date;
    const isRain = query.variable === 'rainfall';
    const unit = isRain ? 'mm' : '°C';

    const cells: DailyGridPoint[] = [];

    // For each cell in our network, pull or generate its daily value & normal
    for (const cell of GRID_CELLS) {
      // Pull single day
      const series = await this.getTimeSeries({
        dataset: query.dataset,
        gridId: cell.id,
        variable: query.variable,
        startDate: date,
        endDate: date,
      });

      const actualVal = series.length > 0 ? series[0].value : 0;

      // Realistic normal for this day of year
      const dateObj = new Date(date);
      const dayOfYear = Math.floor((dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) / 86400000);

      let normalVal = 0;
      if (isRain) {
        const isMonsoon = dayOfYear >= 160 && dayOfYear <= 270;
        normalVal = isMonsoon ? (cell.lat > 25 ? 18.5 : 24.0) : 1.2;
      } else {
        const seasonalAngle = ((dayOfYear - 145) / 365) * 2 * Math.PI;
        normalVal = 32.0 + 8.5 * Math.cos(seasonalAngle);
      }
      normalVal = Math.round(normalVal * 10) / 10;

      const anomaly = calculateAnomaly(actualVal, normalVal, unit);

      cells.push({
        id: cell.id,
        lat: cell.lat,
        lon: cell.lon,
        value: actualVal,
        normal: normalVal,
        anomalyPct: anomaly.anomalyPct,
        anomalyFormatted: anomaly.anomalyFormatted,
        unit,
        regionName: cell.name || cell.id,
      });
    }

    return {
      date,
      dataset: query.dataset,
      variable: query.variable,
      unit,
      cells,
    };
  }
}

// Singleton factory
export const climateDataProvider = new MockClimateDataProvider();
