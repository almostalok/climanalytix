import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ClimateVariable, Dataset } from '../../types/climate';
import { DailyGridPoint } from '../../types/provider';
import { MapLegend } from './MapLegend';
import { RotateCcw } from 'lucide-react';

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
  selectedGridId?: string;
  viewState: ViewState;
  onViewStateChange?: (state: ViewState) => void;
  onMapClick?: (lat: number, lon: number) => void;
  unit: string;
  basemap?: 'light' | 'dark' | 'satellite';
}

const BASEMAP_TILES: Record<string, string> = {
  light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

// Color scale interpolator for grid cells
function getFillColor(val: number, type: 'actual' | 'normal' | 'anomaly', variable: ClimateVariable): string {
  if (type === 'anomaly') {
    if (val === undefined || isNaN(val)) return '#9CA3AF';
    if (val >= 60) return '#DC2626';
    if (val >= 20) return '#FB923C';
    if (val >= -19 && val <= 19) return '#E2E8F0';
    if (val >= -50) return '#60A5FA';
    return '#1D4ED8';
  }

  if (variable === 'rainfall') {
    if (val <= 0.5) return '#F0F9FF';
    if (val <= 10) return '#BAE6FD';
    if (val <= 25) return '#38BDF8';
    if (val <= 50) return '#0284C7';
    return '#0C4A6E';
  } else {
    // Temperature
    if (val < 22) return '#93C5FD';
    if (val < 30) return '#FDE68A';
    if (val < 38) return '#F97316';
    if (val < 42) return '#EA580C';
    return '#991B1B';
  }
}

export const ClimateMap: React.FC<ClimateMapProps> = ({
  title,
  type,
  variable,
  dataset,
  date,
  gridPoints,
  selectedGridId,
  viewState,
  onViewStateChange,
  onMapClick,
  unit,
  basemap = 'light',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const isInternalMoveRef = useRef<boolean>(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Clean, high-performance Esri World Canvas (100% free, no API key required, no watermarks)
    const map = L.map(mapContainerRef.current, {
      center: viewState.center,
      zoom: viewState.zoom,
      zoomControl: false,
      attributionControl: false,
    });

    const tileUrl = BASEMAP_TILES[basemap] || BASEMAP_TILES.light;
    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer group for dynamic grid cells
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Sync viewport change to siblings
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

    // Map click handling
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

  // Sync incoming viewState (from brother maps)
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

  // Dynamically update basemap tile layer when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const tileUrl = BASEMAP_TILES[basemap] || BASEMAP_TILES.light;
    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri',
    }).addTo(map);
    tileLayerRef.current = tileLayer;
    tileLayer.bringToBack();
  }, [basemap]);

  // Redraw grid cells when gridPoints or selection changes
  useEffect(() => {
    const group = layerGroupRef.current;
    if (!group) return;

    group.clearLayers();

    const isRain = variable === 'rainfall';
    const halfRes = 0.25 / 2;

    gridPoints.forEach((point) => {
      const isSelected = point.id === selectedGridId;
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

      const fillColor = getFillColor(valForColor, type, variable);

      const rect = L.rectangle(bounds, {
        color: isSelected ? '#1E40AF' : '#64748B',
        weight: isSelected ? 2.5 : 0.8,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.85 : 0.7,
      });

      // Tooltip popup per Spec 56
      let valueDisplay = '';
      if (type === 'anomaly') {
        valueDisplay = `Anomaly: <strong>${point.anomalyFormatted}</strong> (Actual: ${point.value}${unit}, Normal: ${point.normal}${unit})`;
      } else if (type === 'normal') {
        valueDisplay = `Climatological Normal: <strong>${point.normal} ${unit}</strong>`;
      } else {
        valueDisplay = `${isRain ? 'Rainfall' : 'Temperature'}: <strong>${point.value} ${unit}</strong>`;
      }

      const popupContent = `
        <div style="font-family: var(--font-sans); font-size: 12px; line-height: 1.4; min-width: 170px;">
          <div style="font-weight: 700; color: #111827; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; margin-bottom: 4px;">
            ${point.regionName}
          </div>
          <div>${point.lat.toFixed(2)}°N, ${point.lon.toFixed(2)}°E</div>
          <div style="margin: 4px 0; color: #1E40AF;">${valueDisplay}</div>
          <div style="font-size: 11px; color: #6B7280; font-family: var(--font-mono);">
            Ref Grid: <strong>${point.id}</strong><br/>
            Dataset: ${dataset} | Date: ${date}
          </div>
        </div>
      `;

      rect.bindTooltip(popupContent, { sticky: true, className: 'ca-map-tooltip' });

      // Click to select
      rect.on('click', () => {
        if (onMapClick) {
          onMapClick(point.lat, point.lon);
        }
      });

      rect.addTo(group);

      if (isSelected) {
        // High-contrast beacon ring
        const beacon = L.circleMarker([point.lat, point.lon], {
          radius: 12,
          color: '#2563EB',
          weight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.35,
        });
        beacon.addTo(group);

        // Center dot
        const pin = L.circleMarker([point.lat, point.lon], {
          radius: 5,
          color: '#FFFFFF',
          weight: 2,
          fillColor: '#1D4ED8',
          fillOpacity: 1.0,
        });
        pin.addTo(group);
      }
    });
  }, [gridPoints, selectedGridId, type, variable, dataset, date, unit]);

  const handleResetView = () => {
    if (onViewStateChange) {
      onViewStateChange({ center: [22.5, 79.5], zoom: 5 });
    }
  };

  return (
    <div
      className="ca-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        minHeight: 420,
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '10px 14px',
          background: '#F8F9FA',
          borderBottom: '1px solid #E4E7EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '1px 5px',
              borderRadius: 3,
              background: type === 'anomaly' ? '#FEF3C7' : type === 'actual' ? '#EFF6FF' : '#F3F4F6',
              color: type === 'anomaly' ? '#B45309' : type === 'actual' ? '#1E40AF' : '#4B5563',
            }}
          >
            {type === 'anomaly' ? '%' : unit}
          </span>
        </div>

        <button
          onClick={handleResetView}
          className="ca-btn ca-btn-secondary ca-btn-sm"
          style={{ padding: '3px 8px', fontSize: 11, gap: 4 }}
          title="Reset map center to India view"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Leaflet map container with absolute overlay legend */}
      <div style={{ position: 'relative', flex: 1, minHeight: 380 }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Legend Overlay at bottom left */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 400 }}>
          <MapLegend type={type} variable={variable} />
        </div>
      </div>
    </div>
  );
};
