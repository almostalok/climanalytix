import React, { useMemo } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { ClimateVariable, ComparisonOperator } from '../../types/climate';
import { Filter, RotateCcw, Map, MapPin, Check, ArrowRight } from 'lucide-react';

interface FilterSidebarProps {
  variable: ClimateVariable;
  onApply?: () => void;
  showCriteria?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  variable,
  onApply,
  showCriteria = true,
}) => {
  const {
    locationMode,
    setLocationMode,
    regions,
    selectedStateId,
    setSelectedStateId,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedBlockId,
    setSelectedBlockId,
    pointLat,
    setPointLat,
    pointLon,
    setPointLon,
    resolvedGridCell,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    rainThreshold,
    setRainThreshold,
    rainBreakDays,
    setRainBreakDays,
    cumulativeDays,
    setCumulativeDays,
    comparisonOperator,
    setComparisonOperator,
    tempThreshold,
    setTempThreshold,
    tempBreakDays,
    setTempBreakDays,
    resetFilters,
    triggerAnalysis,
    hasAppliedFilters,
  } = useClimate();

  const isRain = variable === 'rainfall';
  const unit = isRain ? 'mm' : '°C';

  // Cascading regions
  const states = useMemo(() => regions.filter((r) => r.type === 'state'), [regions]);
  const districts = useMemo(
    () => (selectedStateId ? regions.filter((r) => r.type === 'district' && r.parentId === selectedStateId) : []),
    [regions, selectedStateId]
  );
  const blocks = useMemo(
    () => (selectedDistrictId ? regions.filter((r) => r.type === 'block' && r.parentId === selectedDistrictId) : []),
    [regions, selectedDistrictId]
  );

  // Validation rules matching ClimAnalytix
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (locationMode === 'region') {
      if (!selectedStateId) errs.push('State must be selected.');
      if (!selectedDistrictId) errs.push('District must be selected.');
      if (!selectedBlockId) errs.push('Sub District must be selected.');
    } else {
      if (!pointLat || !pointLon) errs.push('Valid Latitude and Longitude must be provided.');
    }
    return errs;
  }, [locationMode, selectedStateId, selectedDistrictId, selectedBlockId, pointLat, pointLon]);

  const isValid = validationErrors.length === 0;

  const handleApply = () => {
    if (!isValid) return;
    triggerAnalysis();
    if (onApply) onApply();
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 12,
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Filter size={16} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Filters</span>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 8px',
            fontSize: 12,
            color: '#6B7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            borderRadius: 4,
          }}
          title="Reset to default filters"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Mode Toggle: Region vs Points (Exact ClimAnalytix UI) */}
      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Mode
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#F3F4F6',
            padding: 3,
            borderRadius: 6,
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setLocationMode('region')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: locationMode === 'region' ? '#FFFFFF' : 'transparent',
              color: locationMode === 'region' ? '#2563EB' : '#6B7280',
              boxShadow: locationMode === 'region' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Map size={14} />
            <span>Region</span>
          </button>

          <button
            type="button"
            onClick={() => setLocationMode('point')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              background: locationMode === 'point' ? '#FFFFFF' : 'transparent',
              color: locationMode === 'point' ? '#2563EB' : '#6B7280',
              boxShadow: locationMode === 'point' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <MapPin size={14} />
            <span>Points</span>
          </button>
        </div>
      </div>

      {/* Region Mode Dropdowns */}
      {locationMode === 'region' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              State
            </label>
            <select
              value={selectedStateId}
              onChange={(e) => setSelectedStateId(e.target.value)}
              className="ca-select"
              style={{ width: '100%', height: 36, fontSize: 13 }}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              District/County
            </label>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              disabled={!selectedStateId}
              className="ca-select"
              style={{ width: '100%', height: 36, fontSize: 13 }}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Sub District/Block
            </label>
            <select
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              disabled={!selectedDistrictId}
              className="ca-select"
              style={{ width: '100%', height: 36, fontSize: 13 }}
            >
              <option value="">Select Sub District</option>
              {blocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Latitude (°N)
            </label>
            <input
              type="number"
              step="0.0001"
              value={pointLat}
              onChange={(e) => setPointLat(parseFloat(e.target.value) || 0)}
              className="ca-input"
              style={{ width: '100%', height: 36, fontSize: 13 }}
              placeholder="28.5355"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              Longitude (°E)
            </label>
            <input
              type="number"
              step="0.0001"
              value={pointLon}
              onChange={(e) => setPointLon(parseFloat(e.target.value) || 0)}
              className="ca-input"
              style={{ width: '100%', height: 36, fontSize: 13 }}
              placeholder="77.3910"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setPointLat(28.5355);
              setPointLon(77.391);
            }}
            className="ca-btn ca-btn-secondary"
            style={{ width: '100%', height: 32, fontSize: 11 }}
          >
            Snap to NCR Sample (Dadri)
          </button>
        </div>
      )}

      {/* Date Range Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4, borderTop: '1px solid #F3F4F6' }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Date Range
        </label>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            min="1979-01-01"
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ca-input"
            style={{ width: '100%', height: 36, fontSize: 13 }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max="2026-12-31"
            onChange={(e) => setEndDate(e.target.value)}
            className="ca-input"
            style={{ width: '100%', height: 36, fontSize: 13 }}
          />
        </div>
      </div>

      {/* Criteria Section (Threshold & Parameters) */}
      {showCriteria && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4, borderTop: '1px solid #F3F4F6' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
              {isRain ? 'Rainfall Threshold (mm)' : 'Temperature Threshold (°C)'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 6 }}>
              <select
                value={comparisonOperator}
                onChange={(e) => setComparisonOperator(e.target.value as ComparisonOperator)}
                className="ca-select"
                style={{ height: 36, fontSize: 12 }}
              >
                <option value=">=">equal & above (≥)</option>
                <option value=">">strictly above (&gt;)</option>
                <option value="<=">equal & below (≤)</option>
                <option value="<">strictly below (&lt;)</option>
              </select>
              <input
                type="number"
                value={isRain ? rainThreshold : tempThreshold}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  if (isRain) setRainThreshold(val);
                  else setTempThreshold(val);
                }}
                className="ca-input"
                style={{ height: 36, fontSize: 13 }}
                min="0"
                max={isRain ? 500 : 60}
              />
            </div>
          </div>

          {/* Parameters: Break Days & Cumulative Days */}
          <div style={{ display: 'grid', gridTemplateColumns: isRain ? '1fr 1fr' : '1fr', gap: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                Break Days
              </label>
              <input
                type="number"
                value={isRain ? rainBreakDays : tempBreakDays}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  if (isRain) setRainBreakDays(val);
                  else setTempBreakDays(val);
                }}
                className="ca-input"
                style={{ width: '100%', height: 36, fontSize: 13 }}
                min="0"
                max="10"
              />
            </div>

            {isRain && (
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                  Cumulative Days
                </label>
                <input
                  type="number"
                  value={cumulativeDays}
                  onChange={(e) => setCumulativeDays(parseInt(e.target.value, 10) || 1)}
                  className="ca-input"
                  style={{ width: '100%', height: 36, fontSize: 13 }}
                  min="1"
                  max="30"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Apply Button */}
      <div style={{ paddingTop: 8 }}>
        <button
          type="button"
          onClick={handleApply}
          disabled={!isValid}
          style={{
            width: '100%',
            height: 40,
            background: isValid ? '#2563EB' : '#93C5FD',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: isValid ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: isValid ? '0 1px 2px rgba(37, 99, 235, 0.2)' : 'none',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (isValid) e.currentTarget.style.background = '#1D4ED8';
          }}
          onMouseLeave={(e) => {
            if (isValid) e.currentTarget.style.background = '#2563EB';
          }}
        >
          <span>Apply Filters</span>
          <ArrowRight size={15} />
        </button>

        {/* Validation Errors List (Exact ClimAnalytix) */}
        {!isValid && (
          <div style={{ marginTop: 12, padding: '4px 2px', fontSize: 12, color: '#DC2626' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Please fix the errors below before applying filters.
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Nearest Grid Resolution status (Only shown after valid selection or filter applied) */}
      {hasAppliedFilters && (
        <div
          style={{
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 11,
            color: '#4B5563',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#1F2937' }}>Grid Center:</span>
            <span>{resolvedGridCell.lat.toFixed(2)}°N, {resolvedGridCell.lon.toFixed(2)}°E</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#1F2937' }}>Ref Grid ID:</span>
            <code style={{ color: '#2563EB', fontWeight: 600 }}>{resolvedGridCell.id}</code>
          </div>
        </div>
      )}
    </div>
  );
};
