import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { MetricCard } from '../../components/analytics/MetricCard';
import { ResultsTable, ColumnDef } from '../../components/analytics/ResultsTable';
import { ExportButton } from '../../components/analytics/ExportButton';
import { YearlyEventChart } from '../../components/charts/YearlyEventChart';
import { TrendChart } from '../../components/charts/TrendChart';
import { CSVColumn } from '../../packages/climate-engine/csv';
import { findEvents } from '../../packages/climate-engine/events';
import { calculateYearlyEventCounts } from '../../packages/climate-engine/yearly';
import { climateDataProvider } from '../../data/MockClimateDataProvider';
import { ClimateEvent, TimeSeriesDataPoint, YearlyEventCount } from '../../types/climate';
import { Activity, CloudRain, Clock, Droplets, Download, TrendingUp } from 'lucide-react';

export const EventAnalyzerPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    startDate,
    endDate,
    rainThreshold,
    rainBreakDays,
    comparisonOperator,
    analysisTrigger,
    hasAppliedFilters,
    regions,
    selectedBlockId,
    selectedDistrictId,
  } = useClimate();

  const [series, setSeries] = useState<TimeSeriesDataPoint[]>([]);
  const [events, setEvents] = useState<ClimateEvent[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyEventCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derive Taluk / Sub-District display name
  const talukName = useMemo(() => {
    if (selectedBlockId) {
      const b = regions.find((r) => r.id === selectedBlockId);
      if (b) return b.name;
    }
    if (selectedDistrictId) {
      const d = regions.find((r) => r.id === selectedDistrictId);
      if (d) return d.name;
    }
    return (resolvedGridCell.name || resolvedGridCell.id).split('/')[0].trim();
  }, [selectedBlockId, selectedDistrictId, regions, resolvedGridCell]);

  // Load time series and run findEvents + yearly analysis
  const runAnalysis = useCallback(async () => {
    if (!hasAppliedFilters) {
      setSeries([]);
      setEvents([]);
      setYearlyData([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await climateDataProvider.getTimeSeries({
        dataset: selectedDataset,
        gridId: resolvedGridCell.id,
        variable: 'rainfall',
        startDate,
        endDate,
      });
      setSeries(data);

      const detectedEvents = findEvents(data, rainThreshold, comparisonOperator, rainBreakDays);
      setEvents(detectedEvents);

      const yearly = calculateYearlyEventCounts(detectedEvents);
      setYearlyData(yearly);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve observational series');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, resolvedGridCell.id, startDate, endDate, rainThreshold, comparisonOperator, rainBreakDays, analysisTrigger, hasAppliedFilters]);

  // Execute on initial mount and when parameters / trigger change
  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  // Metrics computation
  const metrics = useMemo(() => {
    if (events.length === 0) {
      return {
        count: 0,
        maxDuration: 0,
        highestRainfall: 0,
        avgRainfall: 0,
      };
    }

    let maxDur = 0;
    let maxRain = 0;
    let totalRain = 0;

    events.forEach((ev) => {
      if (ev.cumulativeDays > maxDur) maxDur = ev.cumulativeDays;
      if (ev.totalValue > maxRain) maxRain = ev.totalValue;
      totalRain += ev.totalValue;
    });

    return {
      count: events.length,
      maxDuration: maxDur,
      highestRainfall: Math.round(maxRain * 10) / 10,
      avgRainfall: Math.round((totalRain / events.length) * 10) / 10,
    };
  }, [events]);

  // Table columns definition (matching ClimAnalytix)
  const eventColumns: ColumnDef<ClimateEvent>[] = [
    {
      key: 'taluk' as any,
      header: 'Taluk',
      sortable: true,
      render: () => <span style={{ fontWeight: 600, color: '#111827' }}>{talukName}</span>,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (r) => <span>{r.startDate}</span>,
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (r) => <span>{r.endDate}</span>,
    },
    {
      key: 'totalValue',
      header: 'Rainfall (mm)',
      sortable: true,
      align: 'right',
      render: (r) => (
        <span style={{ fontWeight: 700, color: '#2563EB' }}>
          {r.totalValue} mm
        </span>
      ),
    },
    {
      key: 'lat',
      header: 'Latitude',
      align: 'right',
      render: (r) => <span>{r.lat.toFixed(2)}</span>,
    },
    {
      key: 'lon',
      header: 'Longitude',
      align: 'right',
      render: (r) => <span>{r.lon.toFixed(2)}</span>,
    },
    {
      key: 'refGrid',
      header: 'Ref Grid',
      align: 'center',
      render: (r) => (
        <code style={{ fontSize: 11, background: '#F3F4F6', color: '#1F2937', padding: '2px 6px', borderRadius: 4 }}>
          {r.refGrid}
        </code>
      ),
    },
    {
      key: 'cumulativeDays',
      header: 'Cumulative Days',
      sortable: true,
      align: 'center',
      render: (r) => <span>{r.cumulativeDays}</span>,
    },
    {
      key: 'breakDays',
      header: 'Break Days',
      sortable: true,
      align: 'center',
      render: (r) => (
        <span style={{ color: r.breakDays > 0 ? '#B45309' : '#6B7280' }}>
          {r.breakDays}
        </span>
      ),
    },
    {
      key: 'threshold',
      header: 'Threshold',
      align: 'right',
      render: (r) => <span>{comparisonOperator} {r.threshold} mm</span>,
    },
  ];

  // CSV export columns for events
  const csvColumns: CSVColumn<ClimateEvent>[] = [
    { key: 'taluk' as any, header: 'Taluk' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'totalValue', header: 'Rainfall (mm)' },
    { key: 'lat', header: 'Latitude' },
    { key: 'lon', header: 'Longitude' },
    { key: 'refGrid', header: 'Ref Grid' },
    { key: 'cumulativeDays', header: 'Cumulative Days' },
    { key: 'breakDays', header: 'Break Days' },
    { key: 'threshold', header: 'Threshold (mm)' },
  ];

  // Yearly counts columns
  const yearlyColumns: ColumnDef<YearlyEventCount>[] = [
    {
      key: 'taluk' as any,
      header: 'Taluk',
      render: () => <span style={{ fontWeight: 600 }}>{talukName}</span>,
    },
    {
      key: 'year',
      header: 'Year',
      sortable: true,
      render: (r) => <strong>{r.year}</strong>,
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
      key: 'eventCount',
      header: 'Total Count',
      sortable: true,
      align: 'right',
      render: (r) => (
        <span style={{ fontWeight: 700, color: '#2563EB' }}>{r.eventCount}</span>
      ),
    },
    {
      key: 'totalRainfall',
      header: 'Total Event Rainfall',
      sortable: true,
      align: 'right',
      render: (r) => <span>{r.totalRainfall} mm</span>,
    },
    {
      key: 'avgDurationDays',
      header: 'Avg Duration',
      sortable: true,
      align: 'right',
      render: (r) => <span>{r.avgDurationDays} days</span>,
    },
  ];

  const yearlyCsvColumns: CSVColumn<YearlyEventCount>[] = [
    { key: 'taluk' as any, header: 'Taluk' },
    { key: 'year', header: 'Year' },
    { key: 'refGrid', header: 'Ref Grid' },
    { key: 'eventCount', header: 'Total Count' },
    { key: 'totalRainfall', header: 'Total Event Rainfall (mm)' },
    { key: 'avgDurationDays', header: 'Avg Duration (days)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Summary Metric Cards (Only shown after filters applied with events) */}
      {hasAppliedFilters && events.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14,
          }}
        >
          <MetricCard
            label="Events Found"
            value={metrics.count}
            subtext="Runs meeting threshold criteria"
            accentColor="#2563EB"
            icon={<Activity size={18} />}
          />
          <MetricCard
            label="Max Event"
            value={metrics.maxDuration}
            unit="days"
            subtext="Longest consecutive spell"
            accentColor="#1D4ED8"
            icon={<Clock size={18} />}
          />
          <MetricCard
            label="Peak Rainfall"
            value={metrics.highestRainfall}
            unit="mm"
            subtext="Highest cumulative event"
            accentColor="#0284C7"
            icon={<CloudRain size={18} />}
          />
          <MetricCard
            label="Avg Event Rainfall"
            value={metrics.avgRainfall}
            unit="mm"
            subtext="Mean precipitation per event"
            accentColor="#10B981"
            icon={<Droplets size={18} />}
          />
        </div>
      )}

      {/* 2. Card 1: Events for Selected Parameters (Exact ClimAnalytix Title) */}
      <div className="ca-card">
        <div className="ca-card-header" style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              Events for selected parameters
            </h3>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Historical multi-day rainfall event records {hasAppliedFilters ? `for ${talukName}` : ''}
            </span>
          </div>

          <ExportButton
            filename={`rainfall-events-${resolvedGridCell.id}-${startDate}-${endDate}`}
            columns={csvColumns}
            data={events.map((e) => ({ ...e, taluk: talukName } as any))}
            disabled={isLoading || events.length === 0}
          />
        </div>

        <ResultsTable
          columns={eventColumns}
          data={events}
          isLoading={isLoading}
          emptyTitle="No daily events found"
        />
      </div>

      {/* 3. Card 2: Yearly Event Counts (Exact ClimAnalytix Title) */}
      <div className="ca-card">
        <div className="ca-card-header" style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              Yearly Event Counts
            </h3>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Aggregated frequency per year {hasAppliedFilters ? `for reference grid ${resolvedGridCell.id}` : ''}
            </span>
          </div>

          <ExportButton
            filename={`yearly-rainfall-counts-${resolvedGridCell.id}`}
            columns={yearlyCsvColumns}
            data={yearlyData.map((y) => ({ ...y, taluk: talukName } as any))}
            disabled={isLoading || yearlyData.length === 0}
          />
        </div>

        {/* Results Table for Yearly Counts */}
        <ResultsTable
          columns={yearlyColumns}
          data={yearlyData}
          isLoading={isLoading}
          emptyTitle="No data available"
        />

        {/* Bar Chart inside Yearly Event Counts Card */}
        {hasAppliedFilters && yearlyData.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6' }}>
            <YearlyEventChart data={yearlyData} color="#2563EB" />
          </div>
        )}
      </div>

      {/* 4. Card 3: Rainfall Trend (Exact ClimAnalytix Title) */}
      <div className="ca-card">
        <TrendChart series={series} variable="rainfall" isLoading={isLoading} />
      </div>
    </div>
  );
};
