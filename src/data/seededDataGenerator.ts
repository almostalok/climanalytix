import { ClimateVariable, Dataset, TimeSeriesDataPoint } from '../types/climate';
import { GridCell } from '../types/geo';

/**
 * Deterministic PRNG using Mulberry32 for repeatable climate simulation.
 */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a unique integer seed based on cell coordinates, dataset, and year.
 */
function getCellSeed(cell: GridCell, year: number, dataset: Dataset): number {
  const dsFactor = dataset === 'IMD' ? 7919 : 49157;
  const latInt = Math.floor((cell.lat + 90) * 1000);
  const lonInt = Math.floor((cell.lon + 180) * 1000);
  return (latInt * 31 + lonInt * 17 + year * dsFactor) >>> 0;
}

/**
 * Parses YYYY-MM-DD string into UTC epoch milliseconds.
 */
export function parseDateToUTC(dateStr: string): number {
  const parts = dateStr.split('-').map((v) => parseInt(v, 10));
  return Date.UTC(parts[0], parts[1] - 1, parts[2]);
}

/**
 * Formats UTC epoch milliseconds into YYYY-MM-DD calendar date string.
 */
export function formatUTCDate(utcMs: number): string {
  const d = new Date(utcMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Generates continuous daily time series for a grid cell between startDate and endDate.
 * Uses pure UTC calendar date arithmetic to ensure zero timezone distortion.
 */
export function generateDailySeriesForGrid(
  cell: GridCell,
  variable: ClimateVariable,
  startDateStr: string,
  endDateStr: string,
  dataset: Dataset = 'ERA5'
): TimeSeriesDataPoint[] {
  const result: TimeSeriesDataPoint[] = [];

  const startMs = parseDateToUTC(startDateStr);
  const endMs = parseDateToUTC(endDateStr);
  const DAY_MS = 86400000;

  const isRain = variable === 'rainfall';
  const unit = isRain ? 'mm' : '°C';

  // Base climate factors by latitude & region
  const lat = cell.lat;
  const lon = cell.lon;
  const isNorthern = lat > 24;
  const isCoastal = lon > 85 || (lat < 20 && lon < 74) || (lat < 14 && lon > 79);
  const isArid = lon < 76 && lat > 24; // Rajasthan

  for (let currentMs = startMs; currentMs <= endMs; currentMs += DAY_MS) {
    const curr = new Date(currentMs);
    const year = curr.getUTCFullYear();
    const month = curr.getUTCMonth() + 1; // 1-12
    const dateStr = formatUTCDate(currentMs);

    const yearStartMs = Date.UTC(year, 0, 1);
    const dayOfYear = Math.floor((currentMs - yearStartMs) / DAY_MS) + 1;

    // Daily deterministic random generator
    const seed = getCellSeed(cell, year, dataset) + dayOfYear * 1337;
    const rng = mulberry32(seed);

    let val = 0;

    if (isRain) {
      // Monsoon dynamics (India SW Monsoon: mid-June to late September, day ~160 to 270)
      const isMonsoon = dayOfYear >= 160 && dayOfYear <= 270;
      const isPostMonsoon = month === 10 || month === 11; // NE monsoon for Tamil Nadu
      const isWinterRain = (month === 1 || month === 2) && isNorthern; // Western disturbances

      const randR = rng();
      const wave = Math.sin((dayOfYear / 12) * Math.PI); // synoptic wave (cyclical weather systems)

      if (isMonsoon) {
        // High rain probability during monsoon synoptic trough
        const probRain = isArid ? 0.35 : 0.65;
        if (randR < probRain && wave > -0.2) {
          // Event magnitude
          const intensity = rng();
          if (intensity > 0.85) {
            // Heavy monsoon deluge: 45 to 110 mm
            val = 45 + rng() * 65;
          } else if (intensity > 0.45) {
            // Moderate rainfall event: 20 to 45 mm
            val = 20 + rng() * 25;
          } else {
            // Light to moderate rain: 5 to 20 mm
            val = 5 + rng() * 15;
          }
        }
      } else if (isPostMonsoon && lat < 15) {
        // Tamil Nadu / South East coast NE monsoon
        if (randR < 0.5) {
          val = 15 + rng() * 55;
        }
      } else if (isWinterRain) {
        // Occasional light winter disturbance
        if (randR < 0.15) {
          val = 3 + rng() * 18;
        }
      } else if (month === 4 || month === 5) {
        // Pre-monsoon thunder squalls
        if (randR < 0.12) {
          val = 8 + rng() * 28;
        }
      }

      // Dataset slight calibration variance
      if (dataset === 'IMD' && val > 0) {
        val = val * (0.95 + rng() * 0.1);
      }

      val = Math.round(val * 10) / 10;
    } else {
      // Temperature (Tmax)
      // Annual cycle peaking in May/early June (day 135-155), minimum in January (day 15)
      const seasonalAngle = ((dayOfYear - 145) / 365) * 2 * Math.PI;
      const seasonalBase = Math.cos(seasonalAngle); // -1 in Jan, +1 in late May

      let baseSummer = isArid ? 44.5 : isNorthern ? 41.5 : isCoastal ? 36.0 : 38.5;
      let baseWinter = isNorthern ? 19.5 : isCoastal ? 30.0 : 28.0;

      const midTemp = (baseSummer + baseWinter) / 2;
      const amplitude = (baseSummer - baseWinter) / 2;

      // Monsoon cooling effect (evaporative cooling during July-August)
      let monsoonCooling = 0;
      if (dayOfYear >= 170 && dayOfYear <= 250) {
        monsoonCooling = isArid ? 2.5 : 5.0;
      }

      const dailyNoise = (rng() - 0.5) * 3.8;
      let temp = midTemp + amplitude * seasonalBase - monsoonCooling + dailyNoise;

      if (dataset === 'IMD') {
        temp = temp + (rng() - 0.5) * 0.4;
      }

      val = Math.round(temp * 10) / 10;
    }

    result.push({
      date: dateStr,
      value: val,
      variable,
      unit,
      lat: cell.lat,
      lon: cell.lon,
      refGrid: cell.id,
    });
  }

  return result;
}
