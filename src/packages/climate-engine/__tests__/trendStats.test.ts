import { describe, it, expect } from 'vitest';
import { calculateTrend, computeStatistics } from '../trend';
import { TimeSeriesDataPoint } from '../../../types/climate';

const makePoint = (
  date: string,
  value: number,
  variable: 'rainfall' | 'temperature' = 'rainfall',
  unit: string = 'mm'
): TimeSeriesDataPoint => ({
  date,
  value,
  variable,
  unit,
  lat: 28.5,
  lon: 77.5,
  refGrid: '28.50_77.50',
});

describe('Climate Engine: Variable-Aware Trend Statistics', () => {
  it('computes cumulative total for rainfall series', () => {
    const rainfallSeries = [
      makePoint('2024-07-01', 10, 'rainfall', 'mm'),
      makePoint('2024-07-02', 20, 'rainfall', 'mm'),
      makePoint('2024-07-03', 30, 'rainfall', 'mm'),
    ];

    const result = calculateTrend(rainfallSeries, 'daily');
    expect(result.stats.total).toBe(60);
    expect(result.stats.avg).toBe(20);
    expect(result.stats.min).toBe(10);
    expect(result.stats.max).toBe(30);
    expect(result.stats.count).toBe(3);
  });

  it('deliberately omits cumulative total for temperature series and computes standard deviation', () => {
    const tempSeries = [
      makePoint('2024-05-01', 30, 'temperature', '°C'),
      makePoint('2024-05-02', 40, 'temperature', '°C'),
      makePoint('2024-05-03', 50, 'temperature', '°C'),
    ];

    const result = calculateTrend(tempSeries, 'daily');
    // Total must be undefined for temperature to prevent physically meaningless sums (e.g. 120°C)
    expect(result.stats.total).toBeUndefined();
    expect(result.stats.avg).toBe(40);
    expect(result.stats.min).toBe(30);
    expect(result.stats.max).toBe(50);
    expect(result.stats.count).toBe(3);
    expect(result.stats.stdDev).toBe(8.2); // sqrt(((10^2 + 0^2 + 10^2)/3)) ~= 8.165 -> 8.2
  });

  it('computeStatistics handles empty array gracefully', () => {
    const rainStats = computeStatistics([], true);
    expect(rainStats.avg).toBe(0);
    expect(rainStats.total).toBe(0);

    const tempStats = computeStatistics([], false);
    expect(tempStats.avg).toBe(0);
    expect(tempStats.total).toBeUndefined();
  });
});
