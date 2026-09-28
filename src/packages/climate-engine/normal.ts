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

export interface RangeNormalResult {
  status: 'available' | 'insufficient_data';
  normalValue: number | null;
  dayCount: number;
  yearsAvailable: number;
  variable: string;
  unit: string;
  message?: string;
}

/**
 * Calculates climatological normal over an arbitrary date range.
 * For Rainfall: Sum of daily climatological normals.
 * For Temperature: Mean of daily climatological normals.
 * Returns explicit 'insufficient_data' if adequate historical years are not present.
 */
export function calculateRangeNormal(
  series: TimeSeriesDataPoint[],
  startDate: string,
  endDate: string,
  normalYears: NormalPeriod = 30,
  variable: 'rainfall' | 'temperature' = 'rainfall'
): RangeNormalResult {
  const isRain = variable === 'rainfall';
  const unit = isRain ? 'mm' : '°C';

  if (!series || series.length === 0 || !startDate || !endDate) {
    return {
      status: 'insufficient_data',
      normalValue: null,
      dayCount: 0,
      yearsAvailable: 0,
      variable,
      unit,
      message: 'No observational data available.',
    };
  }

  const startYear = parseInt(startDate.slice(0, 4), 10);
  const endYear = parseInt(endDate.slice(0, 4), 10);
  const minHistoricalYear = startYear - normalYears;

  // Collect distinct historical years in series strictly preceding target start year
  const historicalYears = new Set<number>();
  for (const pt of series) {
    const y = parseInt(pt.date.slice(0, 4), 10);
    if (y >= minHistoricalYear && y < startYear) {
      historicalYears.add(y);
    }
  }

  // Require at least 3 historical years to calculate a valid climatology window
  if (historicalYears.size < 3) {
    return {
      status: 'insufficient_data',
      normalValue: null,
      dayCount: 0,
      yearsAvailable: historicalYears.size,
      variable,
      unit,
      message: `Insufficient historical baseline: only ${historicalYears.size} prior years found (requires at least 3 years for ${normalYears}-year normal).`,
    };
  }

  // Generate calendar dates in the target range using pure UTC
  const startEpoch = Date.UTC(
    parseInt(startDate.slice(0, 4), 10),
    parseInt(startDate.slice(5, 7), 10) - 1,
    parseInt(startDate.slice(8, 10), 10)
  );
  const endEpoch = Date.UTC(
    parseInt(endDate.slice(0, 4), 10),
    parseInt(endDate.slice(5, 7), 10) - 1,
    parseInt(endDate.slice(8, 10), 10)
  );

  if (startEpoch > endEpoch) {
    return {
      status: 'insufficient_data',
      normalValue: null,
      dayCount: 0,
      yearsAvailable: historicalYears.size,
      variable,
      unit,
      message: 'Start date must be on or before end date.',
    };
  }

  const DAY_MS = 86400000;
  let totalDailyNormals = 0;
  let dayCount = 0;

  for (let ms = startEpoch; ms <= endEpoch; ms += DAY_MS) {
    const d = new Date(ms);
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const mmdd = `${m}-${day}`;

    // Compute normal for this mmdd across historicalYears
    const matchingPoints = series.filter((pt) => {
      const ptYear = parseInt(pt.date.slice(0, 4), 10);
      const ptMMDD = pt.date.slice(5);
      return ptYear >= minHistoricalYear && ptYear < startYear && ptMMDD === mmdd;
    });

    if (matchingPoints.length > 0) {
      const daySum = matchingPoints.reduce((acc, p) => acc + p.value, 0);
      const dayNormal = daySum / matchingPoints.length;
      totalDailyNormals += dayNormal;
    } else {
      // Leap day (Feb 29) fallback to Feb 28 if Feb 29 was not in historical leap years
      if (mmdd === '02-29') {
        const feb28Points = series.filter((pt) => {
          const ptYear = parseInt(pt.date.slice(0, 4), 10);
          return ptYear >= minHistoricalYear && ptYear < startYear && pt.date.slice(5) === '02-28';
        });
        if (feb28Points.length > 0) {
          totalDailyNormals += feb28Points.reduce((acc, p) => acc + p.value, 0) / feb28Points.length;
        }
      }
    }
    dayCount += 1;
  }

  if (dayCount === 0) {
    return {
      status: 'insufficient_data',
      normalValue: null,
      dayCount: 0,
      yearsAvailable: historicalYears.size,
      variable,
      unit,
    };
  }

  const finalNormal = isRain
    ? Math.round(totalDailyNormals * 10) / 10
    : Math.round((totalDailyNormals / dayCount) * 10) / 10;

  return {
    status: 'available',
    normalValue: finalNormal,
    dayCount,
    yearsAvailable: historicalYears.size,
    variable,
    unit,
  };
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
