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
import { Activity, Clock, Flame, Thermometer } from 'lucide-react';

export const TempEventAnalyzerPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    startDate,
    endDate,
    tempThreshold,
    tempBreakDays,
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
        variable: 'temperature',
        startDate,
        endDate,
      });
      setSeries(data);

      const detectedEvents = findEvents(data, tempThreshold, comparisonOperator, tempBreakDays);
      setEvents(detectedEvents);

      const yearly = calculateYearlyEventCounts(detectedEvents);
      setYearlyData(yearly);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve observational series');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, resolvedGridCell.id, startDate, endDate, tempThreshold, comparisonOperator, tempBreakDays, analysisTrigger, hasAppliedFilters]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const metrics = useMemo(() => {
    if (events.length === 0) {
      return { count: 0, maxDuration: 0, peakTemp: 0, avgTemp: 0 };
    }

    let maxDur = 0;
    let peak = -Infinity;
    let totalTemp = 0;

    events.forEach((ev) => {
      if (ev.cumulativeDays > maxDur) maxDur = ev.cumulativeDays;
      if (ev.maxDailyValue > peak) peak = ev.maxDailyValue;
      totalTemp += ev.avgDailyValue;
    });

    return {
      count: events.length,
      maxDuration: maxDur,
      peakTemp: peak === -Infinity ? 0 : Math.round(peak * 10) / 10,
      avgTemp: Math.round((totalTemp / events.length) * 10) / 10,
    };
  }, [events]);

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
      key: 'maxDailyValue',
      header: 'Peak Tmax (°C)',
      sortable: true,
      align: 'right',
      render: (r) => (
        <span style={{ fontWeight: 700, color: '#DC2626' }}>
          {r.maxDailyValue} °C
        </span>
      ),
    },
    {
      key: 'avgDailyValue',
      header: 'Avg Event Temp',
      sortable: true,
      align: 'right',
      render: (r) => <span>{r.avgDailyValue} °C</span>,
    },
    {
      key: 'cumulativeDays',
      header: 'Spell Duration',
      sortable: true,
      align: 'center',
      render: (r) => <span>{r.cumulativeDays} d</span>,
    },
    {
      key: 'breakDays',
      header: 'Break Days',
      sortable: true,
      align: 'center',
      render: (r) => <span>{r.breakDays}</span>,
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
        <code style={{ fontSize: 11, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>
          {r.refGrid}
        </code>
      ),
    },
    {
      key: 'threshold',
      header: 'Threshold',
      align: 'right',
      render: (r) => <span>{comparisonOperator} {r.threshold} °C</span>,
    },
  ];

  const csvColumns: CSVColumn<ClimateEvent>[] = [
    { key: 'taluk' as any, header: 'Taluk' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'maxDailyValue', header: 'Peak Tmax (°C)' },
    { key: 'avgDailyValue', header: 'Avg Event Temp (°C)' },
    { key: 'cumulativeDays', header: 'Spell Duration (days)' },
    { key: 'breakDays', header: 'Break Days' },
    { key: 'lat', header: 'Latitude' },
    { key: 'lon', header: 'Longitude' },
    { key: 'refGrid', header: 'Ref Grid' },
    { key: 'threshold', header: 'Threshold (°C)' },
  ];

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
        <span style={{ fontWeight: 700, color: '#D97706' }}>{r.eventCount}</span>
      ),
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
    { key: 'avgDurationDays', header: 'Avg Duration (days)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Metric Cards (Only shown after filters applied with events) */}
      {hasAppliedFilters && events.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14,
          }}
        >
          <MetricCard
            label="Heat Events Found"
            value={metrics.count}
            subtext="Runs meeting threshold cutoff"
            accentColor="#EA580C"
            icon={<Activity size={18} />}
          />
          <MetricCard
            label="Longest Heat Spell"
            value={metrics.maxDuration}
            unit="days"
            subtext="Consecutive days ≥ threshold"
            accentColor="#C2410C"
            icon={<Clock size={18} />}
          />
          <MetricCard
            label="Peak Temperature"
            value={metrics.peakTemp}
            unit="°C"
            subtext="Maximum recorded during event"
            accentColor="#DC2626"
            icon={<Flame size={18} />}
          />
          <MetricCard
            label="Average Spell Temperature"
            value={metrics.avgTemp}
            unit="°C"
            subtext="Mean temperature during runs"
            accentColor="#D97706"
            icon={<Thermometer size={18} />}
          />
        </div>
      )}

      {/* 2. Card 1: Events for selected parameters (Exact ClimAnalytix) */}
      <div className="ca-card">
        <div className="ca-card-header" style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              Events for selected parameters
            </h3>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Historical multi-day extreme temperature runs {hasAppliedFilters ? `for ${talukName}` : ''}
            </span>
          </div>

          <ExportButton
            filename={`temperature-events-${resolvedGridCell.id}-${startDate}-${endDate}`}
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

      {/* 3. Card 2: Yearly Event Counts */}
      <div className="ca-card">
        <div className="ca-card-header" style={{ padding: '14px 18px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
              Yearly Event Counts
            </h3>
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              Aggregated heat event frequency per year {hasAppliedFilters ? `for reference grid ${resolvedGridCell.id}` : ''}
            </span>
          </div>

          <ExportButton
            filename={`yearly-temperature-counts-${resolvedGridCell.id}`}
            columns={yearlyCsvColumns}
            data={yearlyData.map((y) => ({ ...y, taluk: talukName } as any))}
            disabled={isLoading || yearlyData.length === 0}
          />
        </div>

        <ResultsTable
          columns={yearlyColumns}
          data={yearlyData}
          isLoading={isLoading}
          emptyTitle="No data available"
        />

        {hasAppliedFilters && yearlyData.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #F3F4F6' }}>
            <YearlyEventChart data={yearlyData} color="#EA580C" />
          </div>
        )}
      </div>

      {/* 4. Card 3: Temperature Trend */}
      <div className="ca-card">
        <TrendChart series={series} variable="temperature" isLoading={isLoading} />
      </div>
    </div>
  );
};
