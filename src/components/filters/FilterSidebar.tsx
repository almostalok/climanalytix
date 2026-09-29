import React, { useMemo } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { ClimateVariable, ComparisonOperator, NormalPeriod } from '../../types/climate';
import { Filter, RotateCcw, Map, MapPin, Calendar, X, ArrowRight } from 'lucide-react';

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
    pointLat,
    setPointLat,
    pointLon,
    setPointLon,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    rainThreshold,
    setRainThreshold,
    comparisonOperator,
    setComparisonOperator,
    tempThreshold,
    setTempThreshold,
    normalPeriod,
    setNormalPeriod,
    resetFilters,
    triggerAnalysis,
  } = useClimate();

  const isRain = variable === 'rainfall';

  // Cascading states & districts
  const states = useMemo(() => regions.filter((r) => r.type === 'state'), [regions]);
  const districts = useMemo(
    () => (selectedStateId ? regions.filter((r) => r.type === 'district' && r.parentId === selectedStateId) : []),
    [regions, selectedStateId]
  );

  // Validation
  const validationErrors = useMemo(() => {
    const errs: string[] = [];
    if (locationMode === 'region') {
      if (!selectedStateId) errs.push('State must be selected.');
    } else {
      if (!pointLat || !pointLon) errs.push('Valid Latitude and Longitude must be provided.');
    }
    return errs;
  }, [locationMode, selectedStateId, pointLat, pointLon]);

  const isValid = validationErrors.length === 0;

  const handleApply = () => {
    if (!isValid) return;
    triggerAnalysis();
    if (onApply) onApply();
  };

  const selectedDistrictName = useMemo(() => {
    const found = districts.find((d) => d.id === selectedDistrictId);
    return found ? found.name : '';
  }, [districts, selectedDistrictId]);

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
      {/* Header matching reference platform */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 10,
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={18} color="#2563EB" />
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Filters</span>
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

      {/* Mode Toggle: Region vs Points (Exact style in screenshot) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setLocationMode('region')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 6,
            border: locationMode === 'region' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
            cursor: 'pointer',
            background: locationMode === 'region' ? '#EFF6FF' : '#FFFFFF',
            color: locationMode === 'region' ? '#2563EB' : '#4B5563',
            transition: 'all 0.15s ease',
          }}
        >
          <Map size={16} color={locationMode === 'region' ? '#2563EB' : '#6B7280'} />
          <span>Region</span>
        </button>

        <button
          type="button"
          onClick={() => setLocationMode('point')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 6,
            border: locationMode === 'point' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
            cursor: 'pointer',
            background: locationMode === 'point' ? '#EFF6FF' : '#FFFFFF',
            color: locationMode === 'point' ? '#2563EB' : '#4B5563',
            transition: 'all 0.15s ease',
          }}
        >
          <MapPin size={16} color={locationMode === 'point' ? '#2563EB' : '#EF4444'} />
          <span>Points</span>
        </button>
      </div>

      {/* Region Mode Dropdowns */}
      {locationMode === 'region' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* State */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
              State
            </label>
            <select
              value={selectedStateId}
              onChange={(e) => setSelectedStateId(e.target.value)}
              className="ca-select"
              style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* District/County with Clearable tag matching screenshot */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
              District/County
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                disabled={!selectedStateId}
                className="ca-select"
                style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6, paddingRight: selectedDistrictId ? 30 : 12 }}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Clear button if district selected */}
              {selectedDistrictId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDistrictId('');
                  }}
                  style={{
                    position: 'absolute',
                    right: 28,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#E5E7EB',
                    border: 'none',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#4B5563',
                    padding: 0,
                  }}
                  title="Clear district"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
              Latitude (°N)
            </label>
            <input
              type="number"
              step="0.0001"
              value={pointLat}
              onChange={(e) => setPointLat(parseFloat(e.target.value) || 0)}
              className="ca-input"
              style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
              placeholder="18.0500"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
              Longitude (°E)
            </label>
            <input
              type="number"
              step="0.0001"
              value={pointLon}
              onChange={(e) => setPointLon(parseFloat(e.target.value) || 0)}
              className="ca-input"
              style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
              placeholder="82.2500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setPointLat(18.05);
              setPointLon(82.25);
            }}
            className="ca-btn ca-btn-secondary"
            style={{ width: '100%', height: 34, fontSize: 11 }}
          >
            Snap to ASR Sample (AP)
          </button>
        </div>
      )}

      {/* Start Date */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
          Start Date
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="date"
            value={startDate}
            min="1979-01-01"
            max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ca-input"
            style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
          />
        </div>
      </div>

      {/* End Date */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
          End Date
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max="2026-12-31"
            onChange={(e) => setEndDate(e.target.value)}
            className="ca-input"
            style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
          />
        </div>
      </div>

      {/* Normal Period (years) - Exactly as in reference screenshot */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
          Normal Period (years)
        </label>
        <select
          value={normalPeriod}
          onChange={(e) => setNormalPeriod(parseInt(e.target.value, 10) as NormalPeriod)}
          className="ca-select"
          style={{ width: '100%', height: 38, fontSize: 13, borderRadius: 6 }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      {/* Rainfall Threshold (mm) / Temperature Threshold (°C) - Exactly as in screenshot */}
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 5 }}>
          {isRain ? 'Rainfall Threshold (mm)' : 'Temperature Threshold (°C)'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 6 }}>
          <select
            value={comparisonOperator}
            onChange={(e) => setComparisonOperator(e.target.value as ComparisonOperator)}
            className="ca-select"
            style={{ height: 38, fontSize: 12, borderRadius: 6 }}
          >
            <option value=">=">equal & above</option>
            <option value=">">strictly above</option>
            <option value="<=">equal & below</option>
            <option value="<">strictly below</option>
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
            style={{ height: 38, fontSize: 13, borderRadius: 6 }}
            min="0"
          />
        </div>
      </div>

      {/* Main Apply Button matching reference screenshot */}
      <div style={{ paddingTop: 4 }}>
        <button
          type="button"
          onClick={handleApply}
          disabled={!isValid}
          style={{
            width: '100%',
            height: 42,
            background: isValid ? '#2563EB' : '#93C5FD',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
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
        </button>

        {!isValid && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#DC2626' }}>
            {validationErrors.join(' ')}
          </div>
        )}
      </div>
    </div>
  );
};
