import { GridCell } from '../../types/geo';

/**
 * Geographic bounding box defining the Indian climate domain.
 * India mainland + islands roughly span 6.5°N - 37.5°N and 68.0°E - 97.5°E.
 */
export const INDIA_COORDINATE_BOUNDS = {
  minLat: 6.5,
  maxLat: 37.5,
  minLon: 68.0,
  maxLon: 97.5,
} as const;

export interface CoordinateValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates that latitude and longitude are within acceptable bounds for Indian climate analysis.
 * Rejects non-numbers, NaN, global out-of-range coordinates, and coordinates outside India.
 * Specifically rejects (0, 0) and other non-India points.
 */
export function validateCoordinates(lat: number, lon: number): CoordinateValidationResult {
  if (typeof lat !== 'number' || typeof lon !== 'number' || Number.isNaN(lat) || Number.isNaN(lon)) {
    return { valid: false, error: 'Coordinates must be valid numerical values.' };
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return { valid: false, error: `Coordinates (${lat}, ${lon}) are outside valid planetary latitude/longitude range.` };
  }
  if (
    lat < INDIA_COORDINATE_BOUNDS.minLat ||
    lat > INDIA_COORDINATE_BOUNDS.maxLat ||
    lon < INDIA_COORDINATE_BOUNDS.minLon ||
    lon > INDIA_COORDINATE_BOUNDS.maxLon
  ) {
    return {
      valid: false,
      error: `Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)}) fall outside the Indian climate domain [${INDIA_COORDINATE_BOUNDS.minLat}°N–${INDIA_COORDINATE_BOUNDS.maxLat}°N, ${INDIA_COORDINATE_BOUNDS.minLon}°E–${INDIA_COORDINATE_BOUNDS.maxLon}°E].`,
    };
  }
  return { valid: true };
}

/**
 * Computes cosine-scaled distance squared between two latitude/longitude coordinates.
 * Formula: dLat² + (dLon * cos(midLatitude))²
 * This accounts for meridional convergence where longitude degrees shrink towards the poles.
 */
export function calculateCosineScaledDistanceSq(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const midLatRad = (((lat1 + lat2) / 2) * Math.PI) / 180;
  const dLat = lat1 - lat2;
  const scaledDLon = (lon1 - lon2) * Math.cos(midLatRad);
  return dLat * dLat + scaledDLon * scaledDLon;
}

/**
 * Finds the nearest grid cell from a target latitude/longitude coordinate using
 * cosine-scaled spherical distance.
 *
 * Validates coordinates first; throws an Error if coordinates fall outside the India bounds
 * or are invalid (e.g. lat=0, lon=0).
 */
export function findNearestGridCell(
  lat: number,
  lon: number,
  gridCells: GridCell[]
): GridCell {
  const validation = validateCoordinates(lat, lon);
  if (!validation.valid) {
    throw new Error(`Coordinate validation failed: ${validation.error}`);
  }

  if (!gridCells || gridCells.length === 0) {
    // Fallback: round to nearest 0.25 deg lattice
    const snapLat = Math.round(lat * 4) / 4;
    const snapLon = Math.round(lon * 4) / 4;
    return {
      id: `${snapLat.toFixed(2)}_${snapLon.toFixed(2)}`,
      lat: snapLat,
      lon: snapLon,
      dataset: 'ERA5',
      resolution: 0.25,
      name: `Grid ${snapLat.toFixed(2)}°N, ${snapLon.toFixed(2)}°E`,
    };
  }

  let nearest = gridCells[0];
  let minDistanceSq = Infinity;

  for (const cell of gridCells) {
    const distSq = calculateCosineScaledDistanceSq(lat, lon, cell.lat, cell.lon);

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearest = cell;
    }
  }

  return nearest;
}

/**
 * Snaps arbitrary latitude and longitude to 0.25 degree grid center coordinates.
 */
export function snapToGridResolution(coord: number, resolution: number = 0.25): number {
  return Math.round(coord / resolution) * resolution;
}
