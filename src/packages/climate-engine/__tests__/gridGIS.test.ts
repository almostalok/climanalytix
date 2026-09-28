import { describe, it, expect } from 'vitest';
import {
  findNearestGridCell,
  validateCoordinates,
  calculateCosineScaledDistanceSq,
  INDIA_COORDINATE_BOUNDS,
} from '../grid';
import { GridCell } from '../../../types/geo';

describe('GIS Grid Snapping & Validation (P3-01)', () => {
  const sampleGridCells: GridCell[] = [
    // Northern India (Kashmir / Ladakh / Himachal)
    { id: '34.00_75.00', lat: 34.0, lon: 75.0, dataset: 'ERA5', resolution: 0.25, name: 'Srinagar Region' },
    { id: '34.25_75.00', lat: 34.25, lon: 75.0, dataset: 'ERA5', resolution: 0.25 },
    { id: '34.00_75.25', lat: 34.0, lon: 75.25, dataset: 'ERA5', resolution: 0.25 },

    // Central / National Capital Region
    { id: '28.50_77.25', lat: 28.5, lon: 77.25, dataset: 'ERA5', resolution: 0.25 },
    { id: '28.50_77.50', lat: 28.5, lon: 77.5, dataset: 'ERA5', resolution: 0.25 },
    { id: '28.75_77.25', lat: 28.75, lon: 77.25, dataset: 'ERA5', resolution: 0.25 },
    { id: '28.75_77.50', lat: 28.75, lon: 77.5, dataset: 'ERA5', resolution: 0.25 },

    // Southern India (Tamil Nadu / Kerala / Kanyakumari)
    { id: '8.25_77.50', lat: 8.25, lon: 77.5, dataset: 'ERA5', resolution: 0.25, name: 'Kanyakumari Region' },
    { id: '8.50_77.50', lat: 8.50, lon: 77.5, dataset: 'ERA5', resolution: 0.25 },
  ];

  it('correctly snaps in Northern India accounting for high-latitude longitude convergence', () => {
    // In Northern India (lat ~34°), cos(34°) ~ 0.829, so 0.2° lon difference is shorter distance than 0.2° lat difference
    const pointLat = 34.08;
    const pointLon = 75.04;
    const nearest = findNearestGridCell(pointLat, pointLon, sampleGridCells);
    expect(nearest.id).toBe('34.00_75.00');
  });

  it('correctly snaps in Southern India near equator', () => {
    // In Southern India (lat ~8.25°)
    const pointLat = 8.22;
    const pointLon = 77.51;
    const nearest = findNearestGridCell(pointLat, pointLon, sampleGridCells);
    expect(nearest.id).toBe('8.25_77.50');
  });

  it('correctly resolves diagonal grid points using cosine-scaled metric', () => {
    // Diagonal test between 28.50_77.50 and 28.75_77.25
    // Target closer to 28.50_77.50
    const pointLat = 28.55;
    const pointLon = 77.46;
    const nearest = findNearestGridCell(pointLat, pointLon, sampleGridCells);
    expect(nearest.id).toBe('28.50_77.50');
  });

  it('matches exact grid center with zero distance', () => {
    const nearest = findNearestGridCell(28.5, 77.5, sampleGridCells);
    expect(nearest.id).toBe('28.50_77.50');
    const distSq = calculateCosineScaledDistanceSq(28.5, 77.5, nearest.lat, nearest.lon);
    expect(distSq).toBeCloseTo(0, 8);
  });

  it('rejects coordinates outside India bounds (e.g. lat=0, lon=0)', () => {
    // Null island / Atlantic ocean
    expect(() => findNearestGridCell(0, 0, sampleGridCells)).toThrow(
      /outside the Indian climate domain/
    );

    const val = validateCoordinates(0, 0);
    expect(val.valid).toBe(false);
    expect(val.error).toContain('outside the Indian climate domain');
  });

  it('rejects global out-of-range coordinates or invalid numeric values', () => {
    expect(() => findNearestGridCell(150, 77, sampleGridCells)).toThrow();
    expect(() => findNearestGridCell(NaN, 77, sampleGridCells)).toThrow(/valid numerical values/);

    const londonVal = validateCoordinates(51.5074, -0.1278);
    expect(londonVal.valid).toBe(false);

    const newYorkVal = validateCoordinates(40.7128, -74.006);
    expect(newYorkVal.valid).toBe(false);
  });

  it('accepts valid boundary points across Indian domain', () => {
    // Southwest boundary point (Kerala/Tamil Nadu)
    const sw = validateCoordinates(INDIA_COORDINATE_BOUNDS.minLat, 77.0);
    expect(sw.valid).toBe(true);

    // Northeast boundary point (Assam/Arunachal)
    const ne = validateCoordinates(27.5, INDIA_COORDINATE_BOUNDS.maxLon - 0.5);
    expect(ne.valid).toBe(true);

    // Northwest boundary point (Punjab/Rajasthan)
    const nw = validateCoordinates(31.0, INDIA_COORDINATE_BOUNDS.minLon + 1.0);
    expect(nw.valid).toBe(true);
  });
});
