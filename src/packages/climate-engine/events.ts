import { ClimateEvent, ComparisonOperator, TimeSeriesDataPoint } from '../../types/climate';

/**
 * Checks if a value satisfies the comparison against the threshold.
 */
export function satisfiesCondition(
  value: number,
  threshold: number,
  operator: ComparisonOperator
): boolean {
  switch (operator) {
    case '>=':
      return value >= threshold;
    case '>':
      return value > threshold;
    case '<=':
      return value <= threshold;
    case '<':
      return value < threshold;
    default:
      return value >= threshold;
  }
}

/**
 * Finds climate events (rainfall runs, temperature spikes, etc.) based on threshold,
 * comparison operator, and allowable internal break days according to the DPR specification.
 *
 * @param series Array of consecutive daily time series points
 * @param threshold Numerical cutoff
 * @param operator Comparison operator ('>=', '>', '<=', '<')
 * @param maxBreak Maximum allowed non-qualifying days within a run
 */
export function findEvents(
  series: TimeSeriesDataPoint[],
  threshold: number,
  operator: ComparisonOperator = '>=',
  maxBreak: number = 1
): ClimateEvent[] {
  if (!series || series.length === 0) return [];

  const events: ClimateEvent[] = [];
  let startIndex: number | null = null;
  let lastQualifyingIndex: number | null = null;
  let gap = 0;

  const closeEvent = (startIdx: number, lastQualIdx: number) => {
    const eventPoints = series.slice(startIdx, lastQualIdx + 1);
    if (eventPoints.length === 0) return;

    const startPoint = series[startIdx];
    const endPoint = series[lastQualIdx];
    
    // Total days in the span
    const cumulativeDays = lastQualIdx - startIdx + 1;
    
    // Count internal non-qualifying days inside the event span
    let internalBreaks = 0;
    let totalVal = 0;
    let maxVal = -Infinity;

    for (let i = startIdx; i <= lastQualIdx; i++) {
      const p = series[i];
      totalVal += p.value;
      if (p.value > maxVal) maxVal = p.value;
      if (!satisfiesCondition(p.value, threshold, operator)) {
        internalBreaks++;
      }
    }

    const roundedTotal = Math.round(totalVal * 10) / 10;
    const avgDaily = cumulativeDays > 0 ? Math.round((roundedTotal / cumulativeDays) * 10) / 10 : 0;

    events.push({
      id: `${startPoint.refGrid}_${startPoint.date}_${endPoint.date}`,
      startDate: startPoint.date,
      endDate: endPoint.date,
      totalValue: roundedTotal,
      unit: startPoint.unit || 'mm',
      lat: startPoint.lat,
      lon: startPoint.lon,
      refGrid: startPoint.refGrid,
      cumulativeDays,
      breakDays: internalBreaks,
      threshold,
      operator,
      variable: startPoint.variable,
      avgDailyValue: avgDaily,
      maxDailyValue: Math.round(maxVal * 10) / 10,
    });
  };

  for (let i = 0; i < series.length; i++) {
    const point = series[i];
    const satisfies = satisfiesCondition(point.value, threshold, operator);

    if (satisfies) {
      if (startIndex === null) {
        startIndex = i;
      }
      lastQualifyingIndex = i;
      gap = 0;
    } else {
      if (startIndex !== null) {
        gap += 1;
        if (gap > maxBreak) {
          if (lastQualifyingIndex !== null) {
            closeEvent(startIndex, lastQualifyingIndex);
          }
          startIndex = null;
          lastQualifyingIndex = null;
          gap = 0;
        }
      }
    }
  }

  // Close active event at end of series
  if (startIndex !== null && lastQualifyingIndex !== null) {
    closeEvent(startIndex, lastQualifyingIndex);
  }

  return events;
}
