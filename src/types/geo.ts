export type RegionType = 'country' | 'state' | 'district' | 'block';

export interface Region {
  id: string;
  name: string;
  type: RegionType;
  parentId: string | null;
  centroid?: [number, number]; // [lat, lon]
}

export interface GridCell {
  id: string; // e.g. "28.50_77.50"
  lat: number;
  lon: number;
  dataset: 'ERA5' | 'IMD';
  resolution: number; // 0.25
  stateId?: string;
  districtId?: string;
  blockId?: string;
  name?: string;
}

export interface GeoPoint {
  lat: number;
  lon: number;
}
