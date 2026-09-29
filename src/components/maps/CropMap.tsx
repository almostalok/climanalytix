import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DistrictCropRecord, CropMetricParameter, STATE_VIEWPORTS } from '../../features/crop/cropData';
import { RotateCcw, Layers, MapPin, Info } from 'lucide-react';

interface CropMapProps {
  records: DistrictCropRecord[];
  selectedDistrictId?: string;
  onSelectDistrict?: (district: DistrictCropRecord) => void;
  activeParameter: CropMetricParameter;
  onParameterChange: (param: CropMetricParameter) => void;
  state: string;
  year: string;
  season: string;
  insurerFilter?: string;
}

const ESRI_BASEMAPS = {
  LIGHT: {
    name: 'Light Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  DARK: {
    name: 'Dark Petro',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  SATELLITE: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
  },
};

function getMetricColor(record: DistrictCropRecord, param: CropMetricParameter): string {
  switch (param) {
    case 'claim_ratio':
      if (record.claimRatio > 80) return '#DC2626'; // Red (Catastrophic Loss)
      if (record.claimRatio > 60) return '#EA580C'; // Orange (Elevated)
      if (record.claimRatio > 40) return '#F59E0B'; // Amber (Normal Underwriting)
      return '#10B981'; // Green (Profitable)

    case 'premium':
      if (record.grossPremium >= 320) return '#1D4ED8'; // Deep Blue
      if (record.grossPremium >= 240) return '#2563EB'; // Royal Blue
      if (record.grossPremium >= 160) return '#0284C7'; // Sky Blue
      return '#0D9488'; // Teal

    case 'sum_insured':
      if (record.sumInsured >= 2400) return '#0F172A'; // Midnight Navy
      if (record.sumInsured >= 1800) return '#1E3A8A'; // Deep Navy
      if (record.sumInsured >= 1200) return '#2563EB'; // Blue
      return '#0284C7'; // Cyan

    case 'rainfall_departure':
      if (record.rainfallDeparture <= -30) return '#991B1B'; // Large Deficit
      if (record.rainfallDeparture <= -15) return '#EA580C'; // Moderate Deficit
      if (record.rainfallDeparture <= 19) return '#10B981'; // Normal
      return '#0284C7'; // Excess

    case 'drought_spi':
      if (record.droughtSpi <= -1.8) return '#7F1D1D'; // Extreme Drought
      if (record.droughtSpi <= -1.2) return '#DC2626'; // Severe Drought
      if (record.droughtSpi <= -0.5) return '#F97316'; // Moderate
      return '#10B981'; // Normal/Wet

    case 'sowing_progress':
      if (record.sowingProgress >= 100) return '#047857'; // High
      if (record.sowingProgress >= 80) return '#10B981'; // Good
      if (record.sowingProgress >= 65) return '#F59E0B'; // Delayed
      return '#DC2626'; // Severely Lagging

    default:
      return '#2563EB';
  }
}

function getMetricFormatted(record: DistrictCropRecord, param: CropMetricParameter): string {
  switch (param) {
    case 'claim_ratio':
      return `${record.claimRatio}% Claim Ratio`;
    case 'premium':
      return `₹ ${record.grossPremium} Cr Premium`;
    case 'sum_insured':
      return `₹ ${record.sumInsured} Cr Sum Insured`;
    case 'rainfall_departure':
      return `${record.rainfallDeparture > 0 ? '+' : ''}${record.rainfallDeparture}% Departure`;
    case 'drought_spi':
      return `SPI: ${record.droughtSpi > 0 ? '+' : ''}${record.droughtSpi}`;
    case 'sowing_progress':
      return `${record.sowingProgress}% Sown`;
  }
}

export const CropMap: React.FC<CropMapProps> = ({
  records,
  selectedDistrictId,
  onSelectDistrict,
  activeParameter,
  onParameterChange,
  state,
  year,
  season,
  insurerFilter = 'All Insurers',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [basemapStyle, setBasemapStyle] = useState<'LIGHT' | 'DARK' | 'SATELLITE'>('DARK');
  const [selectedRecord, setSelectedRecord] = useState<DistrictCropRecord | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialViewport = STATE_VIEWPORTS[state] || STATE_VIEWPORTS['All India'];

    const map = L.map(mapContainerRef.current, {
      center: initialViewport.center,
      zoom: initialViewport.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    const activeTile = ESRI_BASEMAPS[basemapStyle];
    const tileLayer = L.tileLayer(activeTile.url, {
      maxZoom: 16,
      attribution: activeTile.attribution,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Pan to State when state filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = STATE_VIEWPORTS[state] || STATE_VIEWPORTS['All India'];
    map.flyTo(target.center, target.zoom, { duration: 1.0 });
  }, [state]);

  // Update Basemap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);
    const activeTile = ESRI_BASEMAPS[basemapStyle];
    const newTile = L.tileLayer(activeTile.url, {
      maxZoom: 16,
      attribution: activeTile.attribution,
    }).addTo(map);
    tileLayerRef.current = newTile;
  }, [basemapStyle]);

  // Render District Beacons & Interactive SVG Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    records.forEach((rec) => {
      const isSelected = rec.id === selectedDistrictId || rec.id === selectedRecord?.id;
      const isDimmed =
        insurerFilter !== 'All Insurers' &&
        !rec.insurer.toLowerCase().includes(insurerFilter.toLowerCase().replace(' of india', ''));

      const color = getMetricColor(rec, activeParameter);
      const metricValueStr = getMetricFormatted(rec, activeParameter);

      // 1. Geographic circle representing coverage radius / intensity
      const radiusMeters = 18000 + Math.min(25000, (rec.sumInsured / 3000) * 15000);
      const circle = L.circle([rec.lat, rec.lon], {
        radius: radiusMeters,
        color: isSelected ? '#38BDF8' : color,
        weight: isSelected ? 3 : 1.5,
        fillColor: color,
        fillOpacity: isDimmed ? 0.15 : isSelected ? 0.65 : 0.45,
        dashArray: isSelected ? '4, 4' : undefined,
      });

      // 2. Custom Central Interactive Beacon Marker
      const iconHtml = `
        <div style="
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          opacity: ${isDimmed ? 0.35 : 1.0};
          transition: transform 0.2s ease;
        ">
          <div style="
            background: ${color};
            color: #FFFFFF;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 9999px;
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            white-space: nowrap;
            letter-spacing: 0.02em;
          ">
            ${rec.district}
          </div>
          <div style="
            background: rgba(15, 23, 42, 0.95);
            color: #E2E8F0;
            font-size: 10px;
            font-weight: 600;
            padding: 1px 6px;
            border-radius: 4px;
            margin-top: 2px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${metricValueStr}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-crop-pin',
        html: iconHtml,
        iconSize: [100, 36],
        iconAnchor: [50, 18],
      });

      const marker = L.marker([rec.lat, rec.lon], { icon: customIcon });

      // Rich Agricultural Underwriting Dossier Popup
      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px; min-width: 250px; color: #0F172A;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px;">
            <div>
              <span style="font-size: 14px; font-weight: 800; color: #0F172A;">${rec.district}</span>
              <span style="font-size: 11px; color: #64748B; margin-left: 4px;">(${rec.state})</span>
            </div>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${
              rec.riskCategory === 'HIGH_CLAIM'
                ? '#FEE2E2; color: #991B1B;'
                : rec.riskCategory === 'DROUGHT_ALERT'
                ? '#FFEDD5; color: #9A3412;'
                : '#ECFDF5; color: #065F46;'
            }">
              ${rec.riskCategory.replace('_', ' ')}
            </span>
          </div>

          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            Insurer: <strong style="color: #2563EB;">${rec.insurer}</strong><br/>
            Scheme: <strong>${rec.scheme}</strong> | Season: <strong>${rec.season} ${rec.year}</strong>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 8px; margin-bottom: 8px; font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>
              <div style="color: #64748B;">Gross Premium:</div>
              <strong style="color: #2563EB; font-family: monospace;">₹ ${rec.grossPremium} Cr</strong>
            </div>
            <div>
              <div style="color: #64748B;">Sum Insured:</div>
              <strong style="color: #0F172A; font-family: monospace;">₹ ${rec.sumInsured} Cr</strong>
            </div>
            <div>
              <div style="color: #64748B;">Claims Ratio:</div>
              <strong style="color: ${rec.claimRatio > 60 ? '#DC2626' : '#10B981'}; font-family: monospace;">${rec.claimRatio}%</strong>
            </div>
            <div>
              <div style="color: #64748B;">Rainfall Dep:</div>
              <strong style="color: ${rec.rainfallDeparture < -20 ? '#EA580C' : '#0284C7'}; font-family: monospace;">${rec.rainfallDeparture > 0 ? '+' : ''}${rec.rainfallDeparture}%</strong>
            </div>
            <div>
              <div style="color: #64748B;">Farmers Enrolled:</div>
              <strong style="color: #0F172A; font-family: monospace;">${rec.farmers.toLocaleString()}</strong>
            </div>
            <div>
              <div style="color: #64748B;">Sowing Progress:</div>
              <strong style="color: #059669; font-family: monospace;">${rec.sowingProgress}%</strong>
            </div>
          </div>

          <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
            Key Crops: <em>${rec.majorCrops.join(', ')}</em>
          </div>

          <div style="font-size: 10px; color: #94A3B8; text-align: center; font-style: italic;">
            Click to inspect district analytics breakdown
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      const handleSelect = () => {
        setSelectedRecord(rec);
        if (onSelectDistrict) onSelectDistrict(rec);
      };

      circle.on('click', handleSelect);
      marker.on('click', handleSelect);

      circle.addTo(group);
      marker.addTo(group);
    });
  }, [records, selectedDistrictId, selectedRecord, activeParameter, insurerFilter]);

  const handleResetToState = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const target = STATE_VIEWPORTS[state] || STATE_VIEWPORTS['All India'];
    map.flyTo(target.center, target.zoom, { duration: 0.8 });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '560px',
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#091524',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Map Filter & Parameter Bar */}
      <div
        style={{
          background: '#081728',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '10px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          zIndex: 500,
        }}
      >
        {/* Left: Parameter Pill Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Map Parameter:
          </span>
          {(
            [
              { id: 'premium', label: 'Gross Premium' },
              { id: 'sum_insured', label: 'Sum Insured' },
              { id: 'claim_ratio', label: 'Claims Ratio (%)' },
              { id: 'rainfall_departure', label: 'Rainfall Departure' },
              { id: 'drought_spi', label: 'Drought SPI' },
              { id: 'sowing_progress', label: 'Sowing Progress' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => onParameterChange(p.id)}
              style={{
                background: activeParameter === p.id ? '#2563EB' : 'rgba(255, 255, 255, 0.08)',
                color: activeParameter === p.id ? '#FFFFFF' : '#CBD5E1',
                border: activeParameter === p.id ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.15)',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Right: Basemap Selector & Reset View */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Basemap Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 6, padding: 2 }}>
            {(
              [
                { id: 'DARK', label: 'Dark' },
                { id: 'LIGHT', label: 'Light' },
                { id: 'SATELLITE', label: 'Satellite' },
              ] as const
            ).map((b) => (
              <button
                key={b.id}
                onClick={() => setBasemapStyle(b.id)}
                style={{
                  background: basemapStyle === b.id ? '#10B981' : 'transparent',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetToState}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 6,
              color: '#FFFFFF',
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            title="Reset map view to current State"
          >
            <RotateCcw size={12} />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Map Canvas with Floating Legend and Stats Overlay */}
      <div style={{ position: 'relative', flex: 1, width: '100%', height: '100%' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Dynamic Legend at Bottom Left */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 400,
            background: 'rgba(11, 30, 54, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#FFFFFF',
            fontSize: 11,
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            maxWidth: 240,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 11, color: '#38BDF8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {activeParameter.replace('_', ' ')} Legend
          </div>

          {activeParameter === 'claim_ratio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#10B981' }} />
                <span>&lt; 40% (Profitable / Low Loss)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#F59E0B' }} />
                <span>40% – 60% (Moderate Underwriting)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#EA580C' }} />
                <span>60% – 80% (Elevated Claims)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#DC2626' }} />
                <span>&gt; 80% (Severe Loss Portfolio)</span>
              </div>
            </div>
          )}

          {activeParameter === 'premium' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#1D4ED8' }} />
                <span>&gt; ₹ 300 Cr (Major Underwriting)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#2563EB' }} />
                <span>₹ 200 – 300 Cr (Medium Cluster)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#0D9488' }} />
                <span>&lt; ₹ 200 Cr (Baseline Cluster)</span>
              </div>
            </div>
          )}

          {activeParameter === 'sum_insured' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#0F172A' }} />
                <span>&gt; ₹ 2,200 Cr (High Exposure)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#1E3A8A' }} />
                <span>₹ 1,500 – 2,200 Cr (Moderate)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#0284C7' }} />
                <span>&lt; ₹ 1,500 Cr (Standard)</span>
              </div>
            </div>
          )}

          {activeParameter === 'rainfall_departure' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#0284C7' }} />
                <span>&gt; +20% (Excess Rainfall)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#10B981' }} />
                <span>-19% to +19% (Normal)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#EA580C' }} />
                <span>-20% to -40% (Deficit Risk)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#991B1B' }} />
                <span>&lt; -40% (Severe Drought Risk)</span>
              </div>
            </div>
          )}

          {activeParameter === 'drought_spi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#10B981' }} />
                <span>&gt; -0.5 (Normal to Wet)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#F97316' }} />
                <span>-0.5 to -1.4 (Moderate Drought)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#7F1D1D' }} />
                <span>&lt; -1.5 (Severe / Extreme)</span>
              </div>
            </div>
          )}

          {activeParameter === 'sowing_progress' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#047857' }} />
                <span>&gt; 95% (Target Sowing Achieved)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#F59E0B' }} />
                <span>75% – 95% (Active Window)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#DC2626' }} />
                <span>&lt; 75% (Delayed / Moisture Deficit)</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected District Floating Quick Dossier at Bottom Right */}
        {selectedRecord && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              zIndex: 400,
              background: 'rgba(11, 30, 54, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #38BDF8',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              minWidth: 260,
              maxWidth: 320,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <strong style={{ fontSize: 14, color: '#38BDF8' }}>{selectedRecord.district}</strong>
              <span style={{ fontSize: 10, background: '#2563EB', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                {selectedRecord.state}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#CBD5E1', marginBottom: 6 }}>
              Allocated to: <strong>{selectedRecord.insurer}</strong>
            </div>
            <div style={{ fontSize: 11, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: 'rgba(255,255,255,0.06)', padding: 6, borderRadius: 4 }}>
              <div>Sum Insured: <strong>₹ {selectedRecord.sumInsured} Cr</strong></div>
              <div>Premium: <strong style={{ color: '#38BDF8' }}>₹ {selectedRecord.grossPremium} Cr</strong></div>
              <div>Claims Ratio: <strong style={{ color: selectedRecord.claimRatio > 60 ? '#F87171' : '#34D399' }}>{selectedRecord.claimRatio}%</strong></div>
              <div>Farmers: <strong>{selectedRecord.farmers.toLocaleString()}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
