import { ClimateEvent, YearlyEventCount } from '../../types/climate';

/**
 * Calculates yearly event counts per grid cell grouped by the calendar year of the event START date.
 */
export function calculateYearlyEventCounts(events: ClimateEvent[]): YearlyEventCount[] {
  if (!events || events.length === 0) return [];

  const map = new Map<string, { count: number; totalVal: number; totalDuration: number; refGrid: string; year: number }>();

  for (const ev of events) {
    const year = parseInt(ev.startDate.slice(0, 4), 10);
    const key = `${year}_${ev.refGrid}`;

    const existing = map.get(key) || {
      count: 0,
      totalVal: 0,
      totalDuration: 0,
      refGrid: ev.refGrid,
      year,
    };

    existing.count += 1;
    existing.totalVal += ev.totalValue;
    existing.totalDuration += ev.cumulativeDays;
    map.set(key, existing);
  }

  const results: YearlyEventCount[] = Array.from(map.values()).map((item) => ({
    year: item.year,
    refGrid: item.refGrid,
    eventCount: item.count,
    totalRainfall: Math.round(item.totalVal * 10) / 10,
    avgDurationDays: Math.round((item.totalDuration / item.count) * 10) / 10,
  }));

  // Sort ascending by year
  results.sort((a, b) => a.year - b.year);

  return results;
}
