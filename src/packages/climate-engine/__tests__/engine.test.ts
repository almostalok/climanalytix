import { describe, it, expect } from 'vitest';
import {
  findEvents,
  calculateYearlyEventCounts,
  calculateTrend,
  calculateNormal,
  calculateAnomaly,
  findHotDays,
  findNearestGridCell,
  generateCSV,
} from '../index';
import { TimeSeriesDataPoint } from '../../../types/climate';
import { GridCell } from '../../../types/geo';

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

describe('Climate Engine: findEvents', () => {
  it('case 1: detects continuous event', () => {
    const series = [
      makePoint('2024-07-01', 5),
      makePoint('2024-07-02', 25),
      makePoint('2024-07-03', 30),
      makePoint('2024-07-04', 35),
      makePoint('2024-07-05', 10),
    ];
    const events = findEvents(series, 20, '>=', 1);
    expect(events.length).toBe(1);
    expect(events[0].startDate).toBe('2024-07-02');
    expect(events[0].endDate).toBe('2024-07-04');
    expect(events[0].cumulativeDays).toBe(3);
    expect(events[0].breakDays).toBe(0);
    expect(events[0].totalValue).toBe(90);
  });

  it('case 2: detects event with allowed internal break days', () => {
    const series = [
      makePoint('2024-07-01', 25),
      makePoint('2024-07-02', 15), // break day (< 20)
      makePoint('2024-07-03', 40),
      makePoint('2024-07-04', 5),
      makePoint('2024-07-05', 5),
    ];
    const events = findEvents(series, 20, '>=', 1);
    expect(events.length).toBe(1);
    expect(events[0].startDate).toBe('2024-07-01');
    expect(events[0].endDate).toBe('2024-07-03');
    expect(events[0].cumulativeDays).toBe(3);
    expect(events[0].breakDays).toBe(1);
    expect(events[0].totalValue).toBe(80);
  });

  it('case 3: closes event when non-qualifying days exceed break limit', () => {
    const series = [
      makePoint('2024-07-01', 30),
      makePoint('2024-07-02', 10), // gap 1
      makePoint('2024-07-03', 5),  // gap 2 > maxBreak (1)
      makePoint('2024-07-04', 40),
    ];
    const events = findEvents(series, 20, '>=', 1);
    // Should split into two distinct events
    expect(events.length).toBe(2);
    expect(events[0].startDate).toBe('2024-07-01');
    expect(events[0].endDate).toBe('2024-07-01');
    expect(events[1].startDate).toBe('2024-07-04');
    expect(events[1].endDate).toBe('2024-07-04');
  });

  it('case 4: detects multiple distinct events', () => {
    const series = [
      makePoint('2024-07-01', 25),
      makePoint('2024-07-02', 30),
      makePoint('2024-07-03', 2),
      makePoint('2024-07-04', 3),
      makePoint('2024-07-05', 45),
      makePoint('2024-07-06', 50),
    ];
    const events = findEvents(series, 20, '>=', 0);
    expect(events.length).toBe(2);
    expect(events[0].cumulativeDays).toBe(2);
    expect(events[1].cumulativeDays).toBe(2);
  });

  it('case 5: returns empty array when no events qualify', () => {
    const series = [
      makePoint('2024-07-01', 5),
      makePoint('2024-07-02', 12),
      makePoint('2024-07-03', 8),
    ];
    const events = findEvents(series, 20, '>=', 1);
    expect(events.length).toBe(0);
  });

  it('case 6: detects event at end of series', () => {
    const series = [
      makePoint('2024-07-01', 2),
      makePoint('2024-07-02', 5),
      makePoint('2024-07-03', 25),
      makePoint('2024-07-04', 35),
    ];
    const events = findEvents(series, 20, '>=', 1);
    expect(events.length).toBe(1);
    expect(events[0].startDate).toBe('2024-07-03');
    expect(events[0].endDate).toBe('2024-07-04');
  });

  it('case 7: detects event at beginning of series', () => {
    const series = [
      makePoint('2024-07-01', 25),
      makePoint('2024-07-02', 30),
      makePoint('2024-07-03', 2),
      makePoint('2024-07-04', 1),
    ];
    const events = findEvents(series, 20, '>=', 1);
    expect(events.length).toBe(1);
    expect(events[0].startDate).toBe('2024-07-01');
    expect(events[0].endDate).toBe('2024-07-02');
  });
});

describe('Climate Engine: yearly counts', () => {
  it('groups event counts by start year', () => {
    const series = [
      makePoint('2022-07-01', 30),
      makePoint('2022-07-02', 0), // non-qualifying separates events
      makePoint('2022-07-03', 40),
      makePoint('2022-07-04', 0),
      makePoint('2023-08-01', 50),
      makePoint('2023-08-02', 0),
      makePoint('2023-08-03', 60),
      makePoint('2023-08-04', 0),
      makePoint('2023-09-01', 35),
    ];
    const events = findEvents(series, 25, '>=', 0);
    const yearly = calculateYearlyEventCounts(events);

    expect(yearly.length).toBe(2);
    expect(yearly[0].year).toBe(2022);
    expect(yearly[0].eventCount).toBe(2);
    expect(yearly[1].year).toBe(2023);
    expect(yearly[1].eventCount).toBe(3);
  });
});

describe('Climate Engine: normal & anomaly calculation', () => {
  it('calculates climatological normal and positive anomaly', () => {
    const series = [
      makePoint('2020-07-15', 50),
      makePoint('2021-07-15', 70),
      makePoint('2022-07-15', 60),
    ];
    const normal = calculateNormal(series, '2023-07-15', 30);
    expect(normal).toBe(60);

    const anomaly = calculateAnomaly(75, normal, 'mm');
    expect(anomaly.anomalyPct).toBe(25);
    expect(anomaly.anomalyFormatted).toBe('+25.0%');
  });

  it('safely handles zero normal without dividing by zero', () => {
    const anomaly = calculateAnomaly(10, 0, 'mm');
    expect(anomaly.anomalyPct).toBe('n/a');
    expect(anomaly.anomalyFormatted).toBe('n/a');
  });
});

describe('Climate Engine: nearest grid lookup', () => {
  it('finds nearest grid center correctly', () => {
    const gridCells: GridCell[] = [
      { id: '28.50_77.25', lat: 28.5, lon: 77.25, dataset: 'ERA5', resolution: 0.25 },
      { id: '28.50_77.50', lat: 28.5, lon: 77.5, dataset: 'ERA5', resolution: 0.25 },
      { id: '28.75_77.50', lat: 28.75, lon: 77.5, dataset: 'ERA5', resolution: 0.25 },
    ];
    const nearest = findNearestGridCell(28.5355, 77.391, gridCells);
    expect(nearest.id).toBe('28.50_77.50');
  });
});

describe('Climate Engine: hot day detection', () => {
  it('identifies hot days, streaks, and max temperature', () => {
    const series = [
      makePoint('2024-05-20', 38, 'temperature', '°C'),
      makePoint('2024-05-21', 41.5, 'temperature', '°C'),
      makePoint('2024-05-22', 43.2, 'temperature', '°C'),
      makePoint('2024-05-23', 44.7, 'temperature', '°C'),
      makePoint('2024-05-24', 39.5, 'temperature', '°C'),
    ];
    const hotDays = findHotDays(series, 40);
    expect(hotDays.hotDaysCount).toBe(3);
    expect(hotDays.longestStreak).toBe(3);
    expect(hotDays.highestTemperature).toBe(44.7);
  });
});

describe('Climate Engine: CSV generation', () => {
  it('generates standard CSV with headers and formatted values', () => {
    const data = [
      { year: 2024, count: 5, refGrid: '28.50_77.50' },
      { year: 2025, count: 7, refGrid: '28.50_77.50' },
    ];
    const csv = generateCSV(
      [
        { key: 'year', header: 'Year' },
        { key: 'count', header: 'Event Count' },
        { key: 'refGrid', header: 'Ref Grid' },
      ],
      data
    );
    expect(csv).toContain('Year,Event Count,Ref Grid');
    expect(csv).toContain('2024,5,28.50_77.50');
    expect(csv).toContain('2025,7,28.50_77.50');
  });
});
