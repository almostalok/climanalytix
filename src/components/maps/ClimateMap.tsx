import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';
import { DistrictGISData } from '../../data/districtBoundaries';

export interface ViewState {
  center: [number, number];
  zoom: number;
}

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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const isInternalMoveRef = useRef<boolean>(false);

  const badgeTitle =
    type === 'actual'
      ? `Actual (${unit})`
      : type === 'normal'
      ? `Normal (${unit})`
      : 'Anomaly (%)';

  // Initialize Leaflet map matching exact reference platform layout
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: viewState.center,
      zoom: viewState.zoom,
      zoomControl: true, // + and - at top-left matching reference screenshot
      attributionControl: true, // Leaflet badge at bottom-right
    });

    // High detail OpenStreetMap standard tile layer matching reference screenshot topography & borders
    L.tileLayer('https://tile.openstreetmap.org/{z}/{y}/{x}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

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
          weight: 0.6,
          fillColor,
          fillOpacity: 0.78,
        });

        const tooltipVal =
          type === 'actual'
            ? `<strong>${block.actual} ${unit}</strong>`
            : type === 'normal'
            ? `<strong>${block.normal} ${unit}</strong>`
            : `<strong>${block.anomalyPct >= 0 ? '+' : ''}${block.anomalyPct}%</strong>`;

        const popupContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4; min-width: 150px;">
            <div style="font-weight: 700; color: #111827; border-bottom: 1px solid #E5E7EB; padding-bottom: 3px; margin-bottom: 3px;">
              ${districtGIS.name}
            </div>
            <div style="color: #4B5563;">${block.lat.toFixed(2)}°N, ${block.lon.toFixed(2)}°E</div>
            <div style="margin-top: 3px; color: #1E40AF;">
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
          weight: 2.2,
          fill: false,
          opacity: 0.95,
        });
        poly.addTo(group);
      }
      return;
    }

    // 2. Otherwise render standard national/state grid cells
    gridPoints.forEach((point) => {
      const isSelected = point.id === selectedGridId;
      const halfRes = 0.25 / 2;
      const bounds: L.LatLngBoundsExpression = [
        [point.lat - halfRes, point.lon - halfRes],
        [point.lat + halfRes, point.lon + halfRes],
      ];

      const valForColor =
        type === 'anomaly'
          ? typeof point.anomalyPct === 'number'
            ? point.anomalyPct
            : 0
          : type === 'normal'
          ? point.normal
          : point.value;

      let fillColor = '#38BDF8';
      if (type === 'anomaly') {
        fillColor = valForColor >= 60 ? '#1D4ED8' : valForColor >= 20 ? '#38BDF8' : valForColor >= -19 ? '#E2E8F0' : '#F97316';
      } else if (type === 'normal') {
        fillColor = valForColor > 100 ? '#EF4444' : '#F87171';
      } else {
        fillColor = valForColor > 250 ? '#2563EB' : valForColor > 150 ? '#22C55E' : '#FBBF24';
      }

      const rect = L.rectangle(bounds, {
        color: isSelected ? '#1E40AF' : '#64748B',
        weight: isSelected ? 2 : 0.8,
        fillColor,
        fillOpacity: 0.75,
      });

      rect.addTo(group);
    });
  }, [districtGIS, gridPoints, selectedGridId, type, variable, dataset, date, unit, badgeTitle]);

  return (
    <div
      style={{
        position: 'relative',
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 6,
        overflow: 'hidden',
        height: '460px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
          border: '1px solid #E5E7EB',
          borderRadius: 6,
          padding: '6px 20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
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
