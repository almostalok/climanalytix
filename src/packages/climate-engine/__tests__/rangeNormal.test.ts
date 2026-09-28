import { describe, it, expect } from 'vitest';
import { calculateRangeNormal } from '../normal';
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

describe('Climate Engine: Range Normal Climatology', () => {
  // Construct 5 years of historical July daily rainfall (2019-2023)
  const historicalRainfallSeries: TimeSeriesDataPoint[] = [];
  for (let year = 2019; year <= 2023; year++) {
    historicalRainfallSeries.push(makePoint(`${year}-07-01`, 10));
    historicalRainfallSeries.push(makePoint(`${year}-07-02`, 20));
    historicalRainfallSeries.push(makePoint(`${year}-07-03`, 30));
  }

  it('calculates range normal for rainfall as sum of daily normals', () => {
    // Range July 1 to July 3 in target year 2024
    // Daily normal for 07-01: 10
    // Daily normal for 07-02: 20
    // Daily normal for 07-03: 30
    // Cumulative rainfall normal = 10 + 20 + 30 = 60 mm
    const result = calculateRangeNormal(
      historicalRainfallSeries,
      '2024-07-01',
      '2024-07-03',
      10,
      'rainfall'
    );

    expect(result.status).toBe('available');
    expect(result.normalValue).toBe(60);
    expect(result.dayCount).toBe(3);
    expect(result.yearsAvailable).toBe(5);
  });

  it('calculates range normal for temperature as mean of daily normals', () => {
    const historicalTempSeries: TimeSeriesDataPoint[] = [];
    for (let year = 2019; year <= 2023; year++) {
      historicalTempSeries.push(makePoint(`${year}-05-01`, 38, 'temperature', '°C'));
      historicalTempSeries.push(makePoint(`${year}-05-02`, 42, 'temperature', '°C'));
    }

    // Daily normal for 05-01: 38°C
    // Daily normal for 05-02: 42°C
    // Mean temperature normal = (38 + 42) / 2 = 40.0°C
    const result = calculateRangeNormal(
      historicalTempSeries,
      '2024-05-01',
      '2024-05-02',
      10,
      'temperature'
    );

    expect(result.status).toBe('available');
    expect(result.normalValue).toBe(40);
    expect(result.dayCount).toBe(2);
  });

  it('returns insufficient_data when historical years are fewer than minimum required', () => {
    // Only 1 year of historical data available
    const sparseSeries = [
      makePoint('2023-07-01', 25),
      makePoint('2023-07-02', 30),
    ];

    const result = calculateRangeNormal(
      sparseSeries,
      '2024-07-01',
      '2024-07-02',
      30,
      'rainfall'
    );

    expect(result.status).toBe('insufficient_data');
    expect(result.normalValue).toBeNull();
    expect(result.yearsAvailable).toBe(1);
    expect(result.message).toContain('Insufficient historical baseline');
  });

  it('handles leap year Feb 29 smoothly', () => {
    const leapSeries: TimeSeriesDataPoint[] = [];
    // 2016, 2020 are leap years; 2017, 2018, 2019 are non-leap years
    for (let year = 2016; year <= 2020; year++) {
      leapSeries.push(makePoint(`${year}-02-28`, 5));
      if (year === 2016 || year === 2020) {
        leapSeries.push(makePoint(`${year}-02-29`, 8));
      }
    }

    const result = calculateRangeNormal(
      leapSeries,
      '2024-02-28',
      '2024-02-29',
      10,
      'rainfall'
    );

    expect(result.status).toBe('available');
    expect(result.dayCount).toBe(2);
    expect(typeof result.normalValue).toBe('number');
  });
});
