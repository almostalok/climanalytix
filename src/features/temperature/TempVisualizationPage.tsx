import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { SynchronizedMaps } from '../../components/maps/SynchronizedMaps';
import { climateDataProvider } from '../../data/createClimateDataProvider';
import { DailyGridPoint } from '../../types/provider';
import { NormalPeriod } from '../../types/climate';
import { MapPin, Calendar, Layers, RefreshCw, Compass } from 'lucide-react';

export const TempVisualizationPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    pointLat,
    pointLon,
    setPoint,
    normalPeriod,
    setNormalPeriod,
    regions,
    selectedStateId,
    setSelectedStateId,
    selectedDistrictId,
    analysisTrigger,
  } = useClimate();

  const [date, setDate] = useState<string>('2024-05-25');
  const [gridPoints, setGridPoints] = useState<DailyGridPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const states = useMemo(() => regions.filter((r) => r.type === 'state'), [regions]);

  const [customLat, setCustomLat] = useState<string>(pointLat ? pointLat.toString() : '28.5000');
  const [customLon, setCustomLon] = useState<string>(pointLon ? pointLon.toString() : '77.5000');

  useEffect(() => {
    if (pointLat && pointLon) {
      setCustomLat(pointLat.toString());
      setCustomLon(pointLon.toString());
    }
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
        variable: 'temperature',
        date,
        normalPeriod,
      });
      setGridPoints(snapshot.cells);
    } catch (err) {
      console.error('Error loading daily temperature grid:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, date, normalPeriod]);

  useEffect(() => {
    loadGridSnapshot();
  }, [loadGridSnapshot, analysisTrigger]);

  const handleMapClick = (lat: number, lon: number) => {
    setPoint(lat, lon);
    setCustomLat(lat.toFixed(4));
    setCustomLon(lon.toFixed(4));
  };

  const targetCenter = useMemo<[number, number]>(() => {
    if (resolvedGridCell && resolvedGridCell.lat && resolvedGridCell.lon) {
      return [resolvedGridCell.lat, resolvedGridCell.lon];
    }
    if (pointLat && pointLon) {
      return [pointLat, pointLon];
    }
    return [22.5, 79.5];
  }, [resolvedGridCell, pointLat, pointLon]);

  const targetZoom = useMemo<number>(() => {
    if (selectedDistrictId) return 8;
    if (selectedStateId) return 6;
    if (pointLat && pointLon) return 7;
    return 5;
  }, [selectedDistrictId, selectedStateId, pointLat, pointLon]);

  // Aggregate statistics for demo temperature data
  const stats = useMemo(() => {
    if (gridPoints.length === 0) return { meanVal: 0, meanNorm: 0, meanAnomaly: 0 };
    const sumVal = gridPoints.reduce((acc, p) => acc + (p.value || 0), 0);
    const sumNorm = gridPoints.reduce((acc, p) => acc + (p.normal || 0), 0);
    const meanVal = Math.round((sumVal / gridPoints.length) * 10) / 10;
    const meanNorm = Math.round((sumNorm / gridPoints.length) * 10) / 10;
    const meanAnomaly = Math.round((meanVal - meanNorm) * 10) / 10;
    return { meanVal, meanNorm, meanAnomaly };
  }, [gridPoints]);

  const selectedStateName = useMemo(() => {
    if (!selectedStateId) return 'All India (National Grid)';
    const found = states.find((s) => s.id === selectedStateId);
    return found ? found.name : selectedStateId;
  }, [selectedStateId, states]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Filter and Coordinate Bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* State Quick Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={16} color="#DC2626" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>State Focus:</span>
              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="ca-select"
                style={{ height: 34, fontSize: 13, minWidth: 200, fontWeight: 600, color: '#DC2626' }}
              >
                <option value="">All India (National Overview)</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick State Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'rj', label: 'Rajasthan' },
                { id: 'mp', label: 'Madhya Pradesh' },
                { id: 'mh', label: 'Maharashtra' },
                { id: 'gj', label: 'Gujarat' },
                { id: 'up', label: 'Uttar Pradesh' },
                { id: 'pb', label: 'Punjab' },
                { id: 'tn', label: 'Tamil Nadu' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedStateId(item.id)}
                  style={{
                    padding: '3px 9px',
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 14,
                    border: selectedStateId === item.id ? '1px solid #DC2626' : '1px solid #E5E7EB',
                    background: selectedStateId === item.id ? '#FEF2F2' : '#F9FAFB',
                    color: selectedStateId === item.id ? '#B91C1C' : '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={loadGridSnapshot}
            disabled={isLoading}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'spin' : ''} />
            <span>{isLoading ? 'Updating...' : 'Refresh Grid'}</span>
          </button>
        </div>

        {/* Coordinate Dropper & Date Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 10,
            borderTop: '1px solid #F3F4F6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {/* Lat input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Lat:</span>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                className="ca-input"
                style={{ width: 90, height: 32, fontSize: 13 }}
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
                style={{ width: 90, height: 32, fontSize: 13 }}
              />
            </div>

            {/* Drop Pin Button */}
            <button
              type="button"
              onClick={handleDropPin}
              style={{
                height: 32,
                padding: '0 12px',
                background: '#374151',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                letterSpacing: '0.03em',
              }}
            >
              <MapPin size={13} />
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
                style={{ height: 32, fontSize: 12, width: 'auto' }}
              />
            </div>

            {/* Normal Period */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>Normal:</span>
              <select
                value={normalPeriod}
                onChange={(e) => setNormalPeriod(parseInt(e.target.value, 10) as NormalPeriod)}
                className="ca-select"
                style={{ height: 32, fontSize: 12, width: 'auto' }}
              >
                <option value={10}>10 Yrs</option>
                <option value={20}>20 Yrs</option>
                <option value={30}>30 Yrs</option>
              </select>
            </div>
          </div>

          {/* Active Grid Badge */}
          <div
            style={{
              fontSize: 12,
              background: '#FEF2F2',
              color: '#DC2626',
              padding: '6px 12px',
              borderRadius: 6,
              fontWeight: 500,
              border: '1px solid #FEE2E2',
            }}
          >
            Active Focal Grid: <strong>{resolvedGridCell.name || resolvedGridCell.id}</strong> ({resolvedGridCell.lat.toFixed(2)}°N, {resolvedGridCell.lon.toFixed(2)}°E)
          </div>
        </div>
      </div>

      {/* Real-time Regional Temperature Summary Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          padding: '12px 18px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Active Region</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginTop: 2 }}>{selectedStateName}</div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Mean Observed Temp</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#DC2626', marginTop: 2 }}>
            {stats.meanVal} <span style={{ fontSize: 12, fontWeight: 500 }}>°C</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Climatological Normal</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginTop: 2 }}>
            {stats.meanNorm} <span style={{ fontSize: 12, fontWeight: 500 }}>°C</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Thermal Departure</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                background: stats.meanAnomaly >= 2.0 ? '#FEE2E2' : stats.meanAnomaly <= -2.0 ? '#EFF6FF' : '#F3F4F6',
                color: stats.meanAnomaly >= 2.0 ? '#B91C1C' : stats.meanAnomaly <= -2.0 ? '#1D4ED8' : '#374151',
              }}
            >
              {stats.meanAnomaly >= 0 ? `+${stats.meanAnomaly}°C` : `${stats.meanAnomaly}°C`}
            </span>
            <span style={{ fontSize: 11, color: '#6B7280' }}>
              {stats.meanAnomaly >= 4.0 ? 'Severe Heatwave' : stats.meanAnomaly >= 2.0 ? 'Heatwave' : stats.meanAnomaly <= -2.0 ? 'Cold Wave' : 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Synchronized Leaflet Maps: Actual (°C), Normal (°C), Anomaly (°C departure) */}
      <SynchronizedMaps
        variable="temperature"
        dataset={selectedDataset}
        date={date}
        gridPoints={gridPoints}
        selectedGridId={resolvedGridCell.id}
        onMapClick={handleMapClick}
        unit="°C"
        targetCenter={targetCenter}
        targetZoom={targetZoom}
      />
    </div>
  );
};
