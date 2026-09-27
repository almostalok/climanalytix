import { AnomalyResult, NormalPeriod, TimeSeriesDataPoint } from '../../types/climate';

/**
 * Calculates the climatological normal for a specific calendar date (MM-DD)
 * over the preceding N years (10, 20, or 30).
 *
 * @param series Complete historical daily series for the grid
 * @param targetDate The target date string (YYYY-MM-DD)
 * @param normalYears Window length (10, 20, 30)
 */
export function calculateNormal(
  series: TimeSeriesDataPoint[],
  targetDate: string,
  normalYears: NormalPeriod = 30
): number {
  if (!series || series.length === 0 || !targetDate) return 0;

  const targetYear = parseInt(targetDate.slice(0, 4), 10);
  const targetMonthDay = targetDate.slice(5); // "MM-DD"
  const startYear = targetYear - normalYears;

  // Filter points matching the same calendar day (or 3-day smoothing window for robust normal)
  const matches = series.filter((pt) => {
    const ptYear = parseInt(pt.date.slice(0, 4), 10);
    const ptMonthDay = pt.date.slice(5);
    return ptYear >= startYear && ptYear < targetYear && ptMonthDay === targetMonthDay;
  });

  if (matches.length === 0) {
    // If exact single-day normal has few points in small demo subset, average the same month
    const targetMonth = targetDate.slice(5, 7);
    const monthMatches = series.filter((pt) => {
      const ptYear = parseInt(pt.date.slice(0, 4), 10);
      return ptYear >= startYear && ptYear < targetYear && pt.date.slice(5, 7) === targetMonth;
    });

    if (monthMatches.length === 0) return 0;
    const sum = monthMatches.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round((sum / monthMatches.length) * 10) / 10;
  }

  const sum = matches.reduce((acc, curr) => acc + curr.value, 0);
  return Math.round((sum / matches.length) * 10) / 10;
}

/**
 * Computes anomaly percentage and formatting according to DPR specifications.
 * Formula: ((Actual - Normal) / Normal) * 100
 * If Normal === 0, returns "n/a".
 */
export function calculateAnomaly(
  actual: number,
  normal: number,
  unit: string = 'mm'
): AnomalyResult {
  const roundedActual = Math.round(actual * 10) / 10;
  const roundedNormal = Math.round(normal * 10) / 10;
  const diff = Math.round((roundedActual - roundedNormal) * 10) / 10;

  if (roundedNormal === 0) {
    return {
      actual: roundedActual,
      normal: roundedNormal,
      anomalyPct: 'n/a',
      anomalyFormatted: 'n/a',
      anomalyAbsolute: diff,
      unit,
    };
  }

  const pct = ((roundedActual - roundedNormal) / roundedNormal) * 100;
  const roundedPct = Math.round(pct * 10) / 10;
  const sign = roundedPct > 0 ? '+' : '';

  return {
    actual: roundedActual,
    normal: roundedNormal,
    anomalyPct: roundedPct,
    anomalyFormatted: `${sign}${roundedPct.toFixed(1)}%`,
    anomalyAbsolute: diff,
    unit,
  };
}
