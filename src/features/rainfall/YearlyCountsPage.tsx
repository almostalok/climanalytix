import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { FilterPanel } from '../../components/filters/FilterPanel';
import { QuerySummary } from '../../components/analytics/QuerySummary';
import { YearlyEventChart } from '../../components/charts/YearlyEventChart';
import { ResultsTable, ColumnDef } from '../../components/analytics/ResultsTable';
import { ExportButton } from '../../components/analytics/ExportButton';
import { CSVColumn } from '../../packages/climate-engine/csv';
import { findEvents } from '../../packages/climate-engine/events';
import { calculateYearlyEventCounts } from '../../packages/climate-engine/yearly';
import { climateDataProvider } from '../../data/MockClimateDataProvider';
import { YearlyEventCount } from '../../types/climate';

export const YearlyCountsPage: React.FC = () => {
  const {
    selectedDataset,
    resolvedGridCell,
    startDate,
    endDate,
    rainThreshold,
    rainBreakDays,
  } = useClimate();

  const [yearlyData, setYearlyData] = useState<YearlyEventCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalEvents, setTotalEvents] = useState<number>(0);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await climateDataProvider.getTimeSeries({
        dataset: selectedDataset,
        gridId: resolvedGridCell.id,
        variable: 'rainfall',
        startDate,
        endDate,
      });

      const events = findEvents(data, rainThreshold, '>=', rainBreakDays);
      setTotalEvents(events.length);
      const counts = calculateYearlyEventCounts(events);
      setYearlyData(counts);
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, resolvedGridCell.id, startDate, endDate, rainThreshold, rainBreakDays]);

  useEffect(() => {
    runAnalysis();
  }, [runAnalysis]);

  const columns: ColumnDef<YearlyEventCount>[] = [
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
        <code style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>
          {r.refGrid}
        </code>
      ),
    },
    {
      key: 'eventCount',
      header: 'Event Count',
      sortable: true,
      align: 'right',
      render: (r) => (
        <span style={{ fontWeight: 600, color: '#0284C7' }}>{r.eventCount}</span>
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

  const csvColumns: CSVColumn<YearlyEventCount>[] = [
    { key: 'year', header: 'Year' },
    { key: 'refGrid', header: 'Ref Grid' },
    { key: 'eventCount', header: 'Event Count' },
    { key: 'totalRainfall', header: 'Total Event Rainfall (mm)' },
    { key: 'avgDurationDays', header: 'Avg Duration (days)' },
  ];

  return (
    <div>
      <FilterPanel variable="rainfall" onAnalyze={runAnalysis} showCriteria={true} />
      <QuerySummary variable="rainfall" eventsCount={totalEvents} />

      {/* Primary Bar Chart */}
      <YearlyEventChart data={yearlyData} color="#0284C7" />

      {/* Results Table */}
      <div className="ca-card">
        <div className="ca-card-header">
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
              Yearly Event Summary Table
            </h3>
            <span style={{ fontSize: 12, color: '#667085' }}>
              Aggregated annual frequency per 0.25° grid cell
            </span>
          </div>

          <ExportButton
            filename={`yearly-rainfall-counts-${resolvedGridCell.id}`}
            columns={csvColumns}
            data={yearlyData}
            disabled={isLoading || yearlyData.length === 0}
          />
        </div>

        <ResultsTable
          columns={columns}
          data={yearlyData}
          isLoading={isLoading}
          emptyTitle="No yearly events detected"
          emptyDescription="No events met the criteria in the selected temporal range."
        />
      </div>
    </div>
  );
};
