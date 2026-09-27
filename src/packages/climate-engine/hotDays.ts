import { HotDaysResult, TimeSeriesDataPoint } from '../../types/climate';

/**
 * Finds all days exceeding the hot day threshold (e.g. Tmax >= 40°C),
 * computes streak statistics and returns list of events.
 */
export function findHotDays(
  series: TimeSeriesDataPoint[],
  threshold: number = 40
): HotDaysResult {
  if (!series || series.length === 0) {
    return {
      hotDaysCount: 0,
      longestStreak: 0,
      highestTemperature: 0,
      days: [],
    };
  }

  const days: HotDaysResult['days'] = [];
  let currentStreak = 0;
  let maxStreak = 0;
  let highestTemp = -Infinity;

  for (const pt of series) {
    if (pt.value >= threshold) {
      currentStreak += 1;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
      if (pt.value > highestTemp) {
        highestTemp = pt.value;
      }

      const dateObj = new Date(pt.date);
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      days.push({
        date: pt.date,
        temperature: pt.value,
        refGrid: pt.refGrid,
        dayOfWeek,
      });
    } else {
      currentStreak = 0;
    }
  }

  return {
    hotDaysCount: days.length,
    longestStreak: maxStreak,
    highestTemperature: highestTemp === -Infinity ? 0 : Math.round(highestTemp * 10) / 10,
    days,
  };
}
