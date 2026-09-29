import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';
import { DistrictGISData } from '../../data/districtBoundaries';

export interface ViewState {
  center: [number, number];
  zoom: number;
}

export type BasemapMode = 'satellite' | 'streets' | 'light' | 'dark';

interface ClimateMapProps {
  title: string;
  type: 'actual' | 'normal' | 'anomaly';
  variable: ClimateVariable;
  dataset: Dataset;
  date: string;
  gridPoints: DailyGridPoint[];
  districtGIS?: DistrictGISData | null;
  selectedGridId?: string;
  viewState: ViewState;
  onViewStateChange?: (state: ViewState) => void;
  onMapClick?: (lat: number, lon: number) => void;
  unit: string;
  basemap?: BasemapMode;
}

export const ClimateMap: React.FC<ClimateMapProps> = ({
  type,
  variable,
  dataset,
  date,
  gridPoints,
  districtGIS,
  selectedGridId,
  viewState,
  onViewStateChange,
  onMapClick,
  unit,
  basemap = 'satellite',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayTileLayerRef = useRef<L.TileLayer | null>(null);
  const roadsTileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const isInternalMoveRef = useRef<boolean>(false);

  const badgeTitle =
    type === 'actual'
      ? `Actual (${unit})`
      : type === 'normal'
      ? `Normal (${unit})`
      : 'Anomaly (%)';

  // Helper to attach appropriate tile layers
  const setupTileLayers = (map: L.Map, mode: BasemapMode) => {
    // Remove existing tile layers
    if (baseTileLayerRef.current) map.removeLayer(baseTileLayerRef.current);
    if (overlayTileLayerRef.current) map.removeLayer(overlayTileLayerRef.current);
    if (roadsTileLayerRef.current) map.removeLayer(roadsTileLayerRef.current);

    if (mode === 'satellite') {
      // 1. High-resolution Satellite Imagery
      const base = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics' }
      ).addTo(map);
      baseTileLayerRef.current = base;

      // 2. High-contrast Reference Overlay (City Names, District Names, State & National Boundaries)
      const overlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, pane: 'overlayPane' }
      ).addTo(map);
      overlayTileLayerRef.current = overlay;

      // 3. World Transportation (Roads & Highways)
      const roads = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, pane: 'overlayPane', opacity: 0.65 }
      ).addTo(map);
      roadsTileLayerRef.current = roads;

      base.bringToBack();
    } else if (mode === 'streets') {
      const base = L.tileLayer('https://tile.openstreetmap.org/{z}/{y}/{x}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      baseTileLayerRef.current = base;
      base.bringToBack();
    } else if (mode === 'dark') {
      const base = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16, attribution: 'Tiles &copy; Esri' }
      ).addTo(map);
      baseTileLayerRef.current = base;

      const overlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16, pane: 'overlayPane' }
      ).addTo(map);
      overlayTileLayerRef.current = overlay;
      base.bringToBack();
    } else {
      // Light canvas
      const base = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16, attribution: 'Tiles &copy; Esri' }
      ).addTo(map);
      baseTileLayerRef.current = base;

      const overlay = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16, pane: 'overlayPane' }
      ).addTo(map);
      overlayTileLayerRef.current = overlay;
      base.bringToBack();
    }
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: viewState.center,
      zoom: viewState.zoom,
      zoomControl: true, // + and - at top-left
      attributionControl: true,
    });

    setupTileLayers(map, basemap);

    // Dynamic layer group for district boundary & grid blocks
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Viewport change synchronization
    map.on('moveend', () => {
      if (isInternalMoveRef.current) {
        isInternalMoveRef.current = false;
        return;
      }
      if (onViewStateChange) {
        const c = map.getCenter();
        onViewStateChange({
          center: [c.lat, c.lng],
          zoom: map.getZoom(),
        });
      }
    });

    // Map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync basemap mode updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setupTileLayers(map, basemap);
  }, [basemap]);

  // Sync viewport changes between maps
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    const latDiff = Math.abs(currentCenter.lat - viewState.center[0]);
    const lngDiff = Math.abs(currentCenter.lng - viewState.center[1]);
    const zoomDiff = Math.abs(currentZoom - viewState.zoom);

    if (latDiff > 0.005 || lngDiff > 0.005 || zoomDiff > 0.1) {
      isInternalMoveRef.current = true;
      map.setView(viewState.center, viewState.zoom, { animate: false });
    }
  }, [viewState]);

  // Redraw layers when districtGIS, gridPoints, or parameters change
  useEffect(() => {
    const group = layerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    // 1. If District GIS data with raster blocks is present, render district polygon & contiguous raster blocks
    if (districtGIS && districtGIS.blocks && districtGIS.blocks.length > 0) {
      // Draw contiguous raster blocks matching screenshot
      districtGIS.blocks.forEach((block) => {
        const fillColor =
          type === 'actual'
            ? block.colorActual
            : type === 'normal'
            ? block.colorNormal
            : block.colorAnomaly;

        const rect = L.rectangle(block.bounds, {
          color: '#1E293B',
          weight: 0.8,
          fillColor,
          fillOpacity: 0.82,
        });

        const tooltipVal =
          type === 'actual'
            ? `<strong>${block.actual} ${unit}</strong>`
            : type === 'normal'
            ? `<strong>${block.normal} ${unit}</strong>`
            : `<strong>${block.anomalyPct >= 0 ? '+' : ''}${block.anomalyPct}%</strong>`;

        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4; min-width: 160px;">
            <div style="font-weight: 700; color: #111827; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; margin-bottom: 4px;">
              ${districtGIS.name}
            </div>
            <div style="color: #4B5563; font-size: 11px;">Grid Cell: ${block.lat.toFixed(2)}°N, ${block.lon.toFixed(2)}°E</div>
            <div style="margin-top: 4px; color: #1E40AF; font-size: 12px;">
              ${badgeTitle}: ${tooltipVal}
            </div>
          </div>
        `;
        rect.bindTooltip(popupContent, { sticky: true });
        rect.addTo(group);
      });

      // Draw crisp black district outline boundary over the raster blocks
      if (districtGIS.polygon && districtGIS.polygon.length > 0) {
        const poly = L.polygon(districtGIS.polygon, {
          color: '#000000',
          weight: 2.5,
          fill: false,
          opacity: 1.0,
        });
        poly.addTo(group);
      }
      return;
    }

    // 2. Default state: render all national observation nodes with clean indicators
    gridPoints.forEach((point) => {
      const isSelected = point.id === selectedGridId;
      const marker = L.circleMarker([point.lat, point.lon], {
        radius: isSelected ? 8 : 4.5,
        color: isSelected ? '#FFFFFF' : '#3B82F6',
        weight: isSelected ? 2.5 : 1.2,
        fillColor: isSelected ? '#2563EB' : '#60A5FA',
        fillOpacity: isSelected ? 1.0 : 0.65,
      });

      const popupContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4; min-width: 140px;">
          <div style="font-weight: 700; color: #111827;">${point.regionName}</div>
          <div style="font-size: 11px; color: #6B7280;">${point.lat.toFixed(2)}°N, ${point.lon.toFixed(2)}°E</div>
          <div style="margin-top: 4px; color: #1E40AF; font-weight: 600;">
            ${badgeTitle}: ${point.value} ${unit}
          </div>
        </div>
      `;
      marker.bindTooltip(popupContent, { sticky: true });
      marker.addTo(group);
    });
  }, [districtGIS, gridPoints, selectedGridId, type, variable, dataset, date, unit, badgeTitle]);

  return (
    <div
      style={{
        position: 'relative',
        background: '#0F172A',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
        height: '480px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Floating White Pill Header Title matching reference platform */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#FFFFFF',
          border: '1px solid #D1D5DB',
          borderRadius: 6,
          padding: '6px 22px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          zIndex: 999,
          fontSize: 13,
          fontWeight: 700,
          color: '#111827',
          letterSpacing: '0.01em',
          pointerEvents: 'none',
        }}
      >
        {badgeTitle}
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
