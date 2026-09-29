import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { SynchronizedMaps } from '../../components/maps/SynchronizedMaps';
import { climateDataProvider } from '../../data/createClimateDataProvider';
import { DailyGridPoint } from '../../types/provider';
import { getDistrictGISData } from '../../data/districtBoundaries';

export const VisualizationPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    pointLat,
    pointLon,
    setPoint,
    normalPeriod,
    regions,
    selectedStateId,
    selectedDistrictId,
    analysisTrigger,
    startDate,
  } = useClimate();

  const [date, setDate] = useState<string>(startDate || '2026-09-21');
  const [gridPoints, setGridPoints] = useState<DailyGridPoint[]>([]);

  // Keep date synced with startDate
  useEffect(() => {
    if (startDate) setDate(startDate);
  }, [startDate]);

  // Local inputs for coordinate pin dropping matching reference screenshot
  const [customLat, setCustomLat] = useState<string>(pointLat ? pointLat.toFixed(2) : '28.61');
  const [customLon, setCustomLon] = useState<string>(pointLon ? pointLon.toFixed(2) : '77.20');

  useEffect(() => {
    if (pointLat && pointLon) {
      setCustomLat(pointLat.toFixed(2));
      setCustomLon(pointLon.toFixed(2));
    }
  }, [pointLat, pointLon]);

  const handleDropPin = () => {
    const lat = parseFloat(customLat) || 28.61;
    const lon = parseFloat(customLon) || 77.20;
    setPoint(lat, lon);
  };

  const loadGridSnapshot = useCallback(async () => {
    try {
      const snapshot = await climateDataProvider.getDailyGrid({
        dataset: selectedDataset,
        variable: 'rainfall',
        date,
        normalPeriod,
      });
      setGridPoints(snapshot.cells);
    } catch (err) {
      console.error('Error loading daily rainfall grid:', err);
    }
  }, [selectedDataset, date, normalPeriod]);

  useEffect(() => {
    loadGridSnapshot();
  }, [loadGridSnapshot, analysisTrigger]);

  const handleMapClick = (lat: number, lon: number) => {
    setPoint(lat, lon);
    setCustomLat(lat.toFixed(2));
    setCustomLon(lon.toFixed(2));
  };

  // Generate contiguous raster blocks and district boundary polygon when district/state is filtered
  const districtGIS = useMemo(() => {
    if (selectedDistrictId) {
      const dist = regions.find((r) => r.id === selectedDistrictId);
      return getDistrictGISData(selectedDistrictId, dist?.centroid, dist?.name);
    }
    if (selectedStateId) {
      const stateDistricts = regions.filter((r) => r.type === 'district' && r.parentId === selectedStateId);
      if (stateDistricts.length > 0) {
        return getDistrictGISData(stateDistricts[0].id, stateDistricts[0].centroid, stateDistricts[0].name);
      }
    }
    return null;
  }, [selectedDistrictId, selectedStateId, regions]);

  // Map viewport target center (defaults to All India overview)
  const targetCenter = useMemo<[number, number]>(() => {
    if (districtGIS && districtGIS.centroid) {
      return districtGIS.centroid;
    }
    if (selectedStateId) {
      const stateObj = regions.find((r) => r.id === selectedStateId);
      if (stateObj?.centroid) return stateObj.centroid;
    }
    return [22.8, 79.5];
  }, [districtGIS, selectedStateId, regions]);

  const targetZoom = useMemo<number>(() => {
    if (districtGIS) return districtGIS.zoom || 8;
    if (selectedStateId) return 6;
    return 5;
  }, [districtGIS, selectedStateId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Coordinate Bar with Pin Dropper (Exact reference platform UI) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Lat:</span>
          <input
            type="number"
            step="0.01"
            value={customLat}
            onChange={(e) => setCustomLat(e.target.value)}
            className="ca-input"
            style={{ width: 85, height: 32, fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Lon:</span>
          <input
            type="number"
            step="0.01"
            value={customLon}
            onChange={(e) => setCustomLon(e.target.value)}
            className="ca-input"
            style={{ width: 85, height: 32, fontSize: 13 }}
          />
        </div>

        <button
          type="button"
          onClick={handleDropPin}
          style={{
            height: 32,
            padding: '0 14px',
            background: '#4B5563',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#374151')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#4B5563')}
        >
          DROP PIN
        </button>
      </div>

      {/* 3 Synchronized Leaflet Maps: Actual (mm), Normal (mm), Anomaly (%) + Bottom Legends */}
      <SynchronizedMaps
        variable="rainfall"
        dataset={selectedDataset}
        date={date}
        gridPoints={gridPoints}
        districtGIS={districtGIS}
        selectedGridId={resolvedGridCell.id}
        onMapClick={handleMapClick}
        unit="mm"
        targetCenter={targetCenter}
        targetZoom={targetZoom}
      />
    </div>
  );
};
