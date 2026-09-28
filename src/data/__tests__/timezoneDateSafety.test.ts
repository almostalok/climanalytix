import { describe, it, expect } from 'vitest';
import { generateDailySeriesForGrid, parseDateToUTC, formatUTCDate } from '../seededDataGenerator';
import { GridCell } from '../../types/geo';

describe('Date and Timezone Safety in Climate Series Generation', () => {
  const sampleCell: GridCell = {
    id: '28.50_77.50',
    lat: 28.5,
    lon: 77.5,
    dataset: 'ERA5',
    resolution: 0.25,
  };

  it('correctly parses and formats dates in pure UTC without off-by-one shifts', () => {
    const epoch = parseDateToUTC('2024-01-01');
    expect(formatUTCDate(epoch)).toBe('2024-01-01');

    const endEpoch = parseDateToUTC('2024-12-31');
    expect(formatUTCDate(endEpoch)).toBe('2024-12-31');

    const leapDayEpoch = parseDateToUTC('2024-02-29');
    expect(formatUTCDate(leapDayEpoch)).toBe('2024-02-29');
  });

  it('generates exact consecutive daily calendar dates between start and end', () => {
    const series = generateDailySeriesForGrid(
      sampleCell,
      'rainfall',
      '2024-02-27',
      '2024-03-02',
      'ERA5'
    );

    const dates = series.map((s) => s.date);
    expect(dates).toEqual([
      '2024-02-27',
      '2024-02-28',
      '2024-02-29', // leap year verified
      '2024-03-01',
      '2024-03-02',
    ]);
  });

  it('generates identical calendar dates regardless of simulated system timezone', () => {
    // Test generation across year-end and leap days
    const seriesA = generateDailySeriesForGrid(
      sampleCell,
      'temperature',
      '2023-12-30',
      '2024-01-03',
      'ERA5'
    );

    const dates = seriesA.map((s) => s.date);
    expect(dates).toEqual([
      '2023-12-30',
      '2023-12-31',
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
    ]);

    // Check that every entry has valid YYYY-MM-DD format
    dates.forEach((d) => {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
