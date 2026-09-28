import React, { useState, useEffect, useCallback } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { SynchronizedMaps } from '../../components/maps/SynchronizedMaps';
import { climateDataProvider } from '../../data/createClimateDataProvider';
import { DailyGridPoint } from '../../types/provider';
import { NormalPeriod } from '../../types/climate';
import { MapPin, Calendar, Layers, Sliders, ArrowRight } from 'lucide-react';

export const VisualizationPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    pointLat,
    setPointLat,
    pointLon,
    setPointLon,
    setPoint,
    normalPeriod,
    setNormalPeriod,
    rainThreshold,
    setRainThreshold,
  } = useClimate();

  const [date, setDate] = useState<string>('2024-07-15');
  const [gridPoints, setGridPoints] = useState<DailyGridPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Local inputs for coordinate pin dropping
  const [customLat, setCustomLat] = useState<string>(pointLat.toString());
  const [customLon, setCustomLon] = useState<string>(pointLon.toString());

  // Synchronize when pointLat/Lon changes externally
  useEffect(() => {
    setCustomLat(pointLat.toString());
    setCustomLon(pointLon.toString());
  }, [pointLat, pointLon]);

  const handleDropPin = () => {
    const lat = parseFloat(customLat) || 28.5;
    const lon = parseFloat(customLon) || 77.5;
    setPoint(lat, lon);
  };

  const loadGridSnapshot = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await climateDataProvider.getDailyGrid({
        dataset: selectedDataset,
        variable: 'rainfall',
        date,
        normalPeriod,
      });
      setGridPoints(snapshot.cells);
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, date, normalPeriod]);

  useEffect(() => {
    loadGridSnapshot();
  }, [loadGridSnapshot]);

  const handleMapClick = (lat: number, lon: number) => {
    setPoint(lat, lon);
    setCustomLat(lat.toFixed(4));
    setCustomLon(lon.toFixed(4));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Coordinate Bar with Pin Dropper (Exact ClimAnalytix) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '12px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Lat input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Lat:</span>
            <input
              type="number"
              step="0.0001"
              value={customLat}
              onChange={(e) => setCustomLat(e.target.value)}
              className="ca-input"
              style={{ width: 90, height: 34, fontSize: 13 }}
            />
          </div>

          {/* Lon input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Lon:</span>
            <input
              type="number"
              step="0.0001"
              value={customLon}
              onChange={(e) => setCustomLon(e.target.value)}
              className="ca-input"
              style={{ width: 90, height: 34, fontSize: 13 }}
            />
          </div>

          {/* Drop Pin Button (ClimAnalytix style: #4B5563 / dark slate) */}
          <button
            type="button"
            onClick={handleDropPin}
            style={{
              height: 34,
              padding: '0 14px',
              background: '#374151',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              letterSpacing: '0.03em',
            }}
          >
            <MapPin size={14} />
            <span>DROP PIN</span>
          </button>

          {/* Date Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Date:</span>
            <input
              type="date"
              value={date}
              min="1979-01-01"
              max="2026-12-31"
              onChange={(e) => setDate(e.target.value)}
              className="ca-input"
              style={{ height: 34, fontSize: 12, width: 'auto' }}
            />
          </div>

          {/* Normal Period */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Normal Period:</span>
            <select
              value={normalPeriod}
              onChange={(e) => setNormalPeriod(parseInt(e.target.value, 10) as NormalPeriod)}
              className="ca-select"
              style={{ height: 34, fontSize: 12, width: 'auto' }}
            >
              <option value={10}>10 Years</option>
              <option value={20}>20 Years</option>
              <option value={30}>30 Years</option>
            </select>
          </div>
        </div>

        {/* Active Grid Badge */}
        <div
          style={{
            fontSize: 12,
            background: '#EFF6FF',
            color: '#1D4ED8',
            padding: '6px 12px',
            borderRadius: 6,
            fontWeight: 500,
            border: '1px solid #DBEAFE',
          }}
        >
          Selected Grid: <strong>{resolvedGridCell.id}</strong> ({resolvedGridCell.lat.toFixed(2)}°N, {resolvedGridCell.lon.toFixed(2)}°E)
        </div>
      </div>

      {/* 3 Synchronized Leaflet Maps: Actual (mm), Normal (mm), Anomaly (%) */}
      <SynchronizedMaps
        variable="rainfall"
        dataset={selectedDataset}
        date={date}
        gridPoints={gridPoints}
        selectedGridId={resolvedGridCell.id}
        onMapClick={handleMapClick}
        unit="mm"
      />
    </div>
  );
};
