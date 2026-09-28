import {
  ClimateDataProvider,
  DailyGridQuery,
  DailyGridSnapshot,
  TimeSeriesQuery,
} from '../types/provider';
import { Dataset, DatasetMetadata, TimeSeriesDataPoint } from '../types/climate';
import { GridCell, Region } from '../types/geo';
import { authService } from '../features/auth/AuthService';

export class HttpClimateDataProvider implements ClimateDataProvider {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (
      baseUrl ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
      'https://climanalytix.alokisstudying.workers.dev'
    ).replace(/\/$/, '');
  }

  private async fetchWithAuth<T>(path: string, init?: RequestInit): Promise<T> {
    const token = authService.getToken();
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `Climate API error (${response.status}): ${response.statusText}${
          errorText ? ` - ${errorText}` : ''
        }`
      );
    }

    return response.json();
  }

  async getManifest(): Promise<DatasetMetadata[]> {
    return this.fetchWithAuth<DatasetMetadata[]>('/api/manifest');
  }

  async getRegions(): Promise<Region[]> {
    return this.fetchWithAuth<Region[]>('/api/regions');
  }

  async getGridCells(dataset: Dataset = 'ERA5'): Promise<GridCell[]> {
    return this.fetchWithAuth<GridCell[]>(`/api/grids?dataset=${encodeURIComponent(dataset)}`);
  }

  async getGridCellById(gridId: string): Promise<GridCell | null> {
    try {
      return await this.fetchWithAuth<GridCell>(`/api/grids/${encodeURIComponent(gridId)}`);
    } catch {
      return null;
    }
  }

  async getTimeSeries(query: TimeSeriesQuery): Promise<TimeSeriesDataPoint[]> {
    const params = new URLSearchParams({
      dataset: query.dataset,
      gridId: query.gridId,
      variable: query.variable,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return this.fetchWithAuth<TimeSeriesDataPoint[]>(`/api/series?${params.toString()}`);
  }

  async getDailyGrid(query: DailyGridQuery): Promise<DailyGridSnapshot> {
    const params = new URLSearchParams({
      dataset: query.dataset,
      variable: query.variable,
      date: query.date,
      ...(query.normalPeriod ? { normalPeriod: query.normalPeriod.toString() } : {}),
    });
    return this.fetchWithAuth<DailyGridSnapshot>(`/api/daily?${params.toString()}`);
  }
}
