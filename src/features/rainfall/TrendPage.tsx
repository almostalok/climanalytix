import React, { useState, useEffect, useCallback } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { FilterPanel } from '../../components/filters/FilterPanel';
import { QuerySummary } from '../../components/analytics/QuerySummary';
import { TrendChart } from '../../components/charts/TrendChart';
import { ExportButton } from '../../components/analytics/ExportButton';
import { CSVColumn } from '../../packages/climate-engine/csv';
import { climateDataProvider } from '../../data/MockClimateDataProvider';
import { TimeSeriesDataPoint } from '../../types/climate';

export const TrendPage: React.FC = () => {
  const { selectedDataset, resolvedGridCell, startDate, endDate } = useClimate();
  const [series, setSeries] = useState<TimeSeriesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await climateDataProvider.getTimeSeries({
        dataset: selectedDataset,
        gridId: resolvedGridCell.id,
        variable: 'rainfall',
        startDate,
        endDate,
      });
      setSeries(data);
    } catch {
      // Error
    } finally {
      setIsLoading(false);
    }
  }, [selectedDataset, resolvedGridCell.id, startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const csvColumns: CSVColumn<TimeSeriesDataPoint>[] = [
    { key: 'date', header: 'Date' },
    { key: 'value', header: 'Precipitation (mm)' },
    { key: 'lat', header: 'Latitude' },
    { key: 'lon', header: 'Longitude' },
    { key: 'refGrid', header: 'Ref Grid' },
  ];

  return (
    <div>
      <FilterPanel variable="rainfall" onAnalyze={loadData} showCriteria={false} />
      <QuerySummary variable="rainfall" />

      {/* Primary Trend Area Chart with Min/Max/Avg/Total statistics */}
      <TrendChart series={series} variable="rainfall" isLoading={isLoading} />

      {/* CSV Export Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <ExportButton
          filename={`rainfall-trend-${resolvedGridCell.id}-${startDate}-${endDate}`}
          columns={csvColumns}
          data={series}
          disabled={isLoading || series.length === 0}
        />
      </div>
    </div>
  );
};
