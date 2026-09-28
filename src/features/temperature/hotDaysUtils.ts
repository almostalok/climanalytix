/**
 * Resolves the observation date for GIS map visualization in the Hot Days module.
 * Prioritizes user's explicit selection, then the peak temperature day among detected hot days,
 * falling back to the start date of the analysis range.
 */
export function resolveHotDaysMapDate(
  startDate: string,
  endDate: string,
  hotDays: { date: string; temperature: number }[],
  explicitMapDate?: string
): string {
  // If the user picked an explicit map date within the active analysis range, use it
  if (explicitMapDate && explicitMapDate >= startDate && explicitMapDate <= endDate) {
    return explicitMapDate;
  }

  // If hot days were detected, default map to the peak extreme temperature date
  if (hotDays && hotDays.length > 0) {
    let maxTemp = -Infinity;
    let peakDate = hotDays[0].date;
    for (const d of hotDays) {
      if (d.temperature > maxTemp) {
        maxTemp = d.temperature;
        peakDate = d.date;
      }
    }
    return peakDate;
  }

  // Fallback to start date
  return startDate;
}
