import React, { useState, useEffect, useCallback } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { MetricCard } from '../../components/analytics/MetricCard';
import { ResultsTable, ColumnDef } from '../../components/analytics/ResultsTable';
import { ExportButton } from '../../components/analytics/ExportButton';
import { SynchronizedMaps } from '../../components/maps/SynchronizedMaps';
import { CSVColumn } from '../../packages/climate-engine/csv';
import { findHotDays } from '../../packages/climate-engine/hotDays';
import { climateDataProvider } from '../../data/MockClimateDataProvider';
import { DailyGridPoint } from '../../types/provider';
import { HotDaysResult, NormalPeriod } from '../../types/climate';
import { Flame, Clock, Thermometer, MapPin } from 'lucide-react';

export const HotDaysPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    startDate,
    endDate,
    tempThreshold,
    pointLat,
    pointLon,
    setPoint,
    normalPeriod,
    setNormalPeriod,
    analysisTrigger,
  } = useClimate();

  const [hotDaysResult, setHotDaysResult] = useState<HotDaysResult>({
    hotDaysCount: 0,
    longestStreak: 0,
    highestTemperature: 0,
    days: [],
  });
  const [gridPoints, setGridPoints] = useState<DailyGridPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [customLat, setCustomLat] = useState<string>(pointLat.toString());
  const [customLon, setCustomLon] = useState<string>(pointLon.toString());

  useEffect(() => {
    setCustomLat(pointLat.toString());
    setCustomLon(pointLon.toString());
  }, [pointLat, pointLon]);

  const handleDropPin = () => {
    const lat = parseFloat(customLat) || 28.5;
    const lon = parseFloat(customLon) || 77.5;
    setPoint(lat, lon);
  };

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    try {
      const [seriesData, gridSnapshot] = await Promise.all([
        climateDataProvider.getTimeSeries({
          dataset: selectedDataset,
          gridId: resolvedGridCell.id,
          variable: 'temperature',
          startDate,
          endDate,
        }),
        climateDataProvider.getDailyGrid({
          dataset: selectedDataset,
          variable: 'temperature',
          date: '2024-05-25',
          normalPeriod,
        }),
      ]);

      const res = findHotDays(seriesData, tempThreshold);
      setHotDaysResult(res);
      setGridPoints(gridSnapshot.cells);
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, resolvedGridCell.id, startDate, endDate, tempThreshold, normalPeriod, analysisTrigger]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const handleMapClick = (lat: number, lon: number) => {
    setPoint(lat, lon);
    setCustomLat(lat.toFixed(4));
    setCustomLon(lon.toFixed(4));
  };

  const columns: ColumnDef<HotDaysResult['days'][0]>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (r) => <strong>{r.date}</strong>,
    },
    {
      key: 'dayOfWeek',
      header: 'Day',
      align: 'center',
      render: (r) => <span>{r.dayOfWeek}</span>,
    },
    {
      key: 'temperature',
      header: 'Tmax Observed',
      sortable: true,
      align: 'right',
      render: (r) => (
        <span
          style={{
            fontWeight: 700,
            color: r.temperature >= 44 ? '#991B1B' : r.temperature >= 42 ? '#DC2626' : '#EA580C',
          }}
        >
          {r.temperature} °C
        </span>
      ),
    },
    {
      key: 'refGrid',
      header: 'Ref Grid',
      align: 'center',
      render: (r) => (
        <code style={{ fontSize: 11, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>
          {r.refGrid}
        </code>
      ),
    },
    {
      key: 'severity',
      header: 'Heat Classification',
      render: (r) => {
        if (r.temperature >= 45) {
          return <span className="ca-badge ca-badge-orange" style={{ background: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' }}>Severe Heatwave</span>;
        }
        if (r.temperature >= 42) {
          return <span className="ca-badge ca-badge-orange">Heatwave</span>;
        }
        return <span className="ca-badge ca-badge-neutral">Hot Day</span>;
      },
    },
  ];

  const csvColumns: CSVColumn<HotDaysResult['days'][0]>[] = [
    { key: 'date', header: 'Date' },
    { key: 'dayOfWeek', header: 'Day of Week' },
    { key: 'temperature', header: 'Tmax (°C)' },
    { key: 'refGrid', header: 'Ref Grid' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Top Controls Bar with Pin Dropper (Exact ClimAnalytix) */}
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

        <div
          style={{
            fontSize: 12,
            background: '#FEF3C7',
            color: '#B45309',
            padding: '6px 12px',
            borderRadius: 6,
            fontWeight: 500,
            border: '1px solid #FDE68A',
          }}
        >
          Target: <strong>{resolvedGridCell.id}</strong> ({resolvedGridCell.lat.toFixed(2)}°N, {resolvedGridCell.lon.toFixed(2)}°E)
        </div>
      </div>

      {/* 2. 3 Synchronized Maps for Hot Days (Actual, Normal, Anomaly) */}
      <SynchronizedMaps
        variable="temperature"
        dataset={selectedDataset}
        date={startDate}
        gridPoints={gridPoints}
        selectedGridId={resolvedGridCell.id}
        onMapClick={handleMapClick}
        unit="days"
      />

      {/* 3. Metric KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        <MetricCard
          label="Hot Days"
          value={hotDaysResult.hotDaysCount}
          unit="days"
          subtext={`Days where Tmax ≥ ${tempThreshold}°C`}
          accentColor="#EA580C"
          icon={<Flame size={18} />}
        />
        <MetricCard
          label="Longest Streak"
          value={hotDaysResult.longestStreak}
          unit="days"
          subtext="Continuous consecutive hot days"
          accentColor="#C2410C"
          icon={<Clock size={18} />}
        />
        <MetricCard
          label="Highest Temperature"
          value={hotDaysResult.highestTemperature}
          unit="°C"
          subtext="Absolute peak observation"
          accentColor="#DC2626"
          icon={<Thermometer size={18} />}
        />
      </div>

      {/* 4. Hot Days Observational Log Table */}
      <div className="ca-card">
        <div className="ca-card-header" style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              Hot Days Observational Log
            </h3>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Daily records where Tmax &ge; {tempThreshold}°C for reference grid {resolvedGridCell.id}
            </span>
          </div>

          <ExportButton
            filename={`hot-days-${resolvedGridCell.id}-${tempThreshold}C`}
            columns={csvColumns}
            data={hotDaysResult.days}
            disabled={isLoading || hotDaysResult.days.length === 0}
          />
        </div>

        <ResultsTable
          columns={columns}
          data={hotDaysResult.days}
          isLoading={isLoading}
          emptyTitle="No hot days detected"
          emptyDescription={`No days in the selected date range had a maximum temperature exceeding ${tempThreshold}°C.`}
          emptySuggestions={[
            'Try lowering threshold (e.g. 35°C or 38°C)',
            'Expand date range to include May and June',
          ]}
          maxHeight={450}
        />
      </div>
    </div>
  );
};
