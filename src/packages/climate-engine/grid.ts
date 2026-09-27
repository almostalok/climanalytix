import { GridCell } from '../../types/geo';

/**
 * Finds the nearest grid cell from a target latitude/longitude coordinate.
 * Grid cells in ERA5/IMD are on a regular 0.25 degree lattice.
 */
export function findNearestGridCell(
  lat: number,
  lon: number,
  gridCells: GridCell[]
): GridCell {
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
    const dLat = cell.lat - lat;
    const dLon = cell.lon - lon;
    const distSq = dLat * dLat + dLon * dLon;

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
