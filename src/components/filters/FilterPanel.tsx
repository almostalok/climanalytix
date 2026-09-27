import React, { useMemo } from 'react';
import { useClimate } from '../../store/ClimateContext';
import { ClimateVariable, ComparisonOperator } from '../../types/climate';
import { MapPin, Calendar, Sliders, RotateCcw, Play, Check } from 'lucide-react';

interface FilterPanelProps {
  variable: ClimateVariable;
  onAnalyze?: () => void;
  showCriteria?: boolean;
  isStale?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  variable,
  onAnalyze,
  showCriteria = true,
  isStale = false,
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
    tempThreshold,
    setTempThreshold,
    tempBreakDays,
    setTempBreakDays,
    resetFilters,
    selectedDataset,
    setSelectedDataset,
    manifest,
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

  return (
    <div className="ca-card" style={{ marginBottom: 24 }}>
      <div className="ca-card-header" style={{ background: '#F8F9FA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#111827' }}>
          <Sliders size={16} color="#1E40AF" />
          <span>Observational Filter Panel</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isStale && (
            <span
              style={{
                fontSize: 11,
                color: '#B45309',
                background: '#FEF3C7',
                padding: '2px 8px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              ● Parameters modified — Click Analyze
            </span>
          )}

          {/* Dataset Switcher in filter header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ color: '#667085', fontWeight: 500 }}>Source:</span>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value as any)}
              className="ca-select"
              style={{ height: 28, padding: '0 8px', fontSize: 12, width: 'auto', fontWeight: 600 }}
            >
              {manifest.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} ({m.resolution})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="ca-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Section 1: Location */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#374151' }}>
              <MapPin size={14} color="#1E40AF" />
              <span>GEOGRAPHICAL SELECTION</span>
            </div>

            {/* Region / Point Toggle */}
            <div
              style={{
                display: 'inline-flex',
                background: '#F1F5F9',
                borderRadius: 6,
                padding: 2,
              }}
            >
              <button
                type="button"
                onClick={() => setLocationMode('region')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  background: locationMode === 'region' ? '#FFFFFF' : 'transparent',
                  color: locationMode === 'region' ? '#1E40AF' : '#64748B',
                  boxShadow: locationMode === 'region' ? 'var(--shadow-subtle)' : 'none',
                }}
              >
                Region Mode
              </button>
              <button
                type="button"
                onClick={() => setLocationMode('point')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  background: locationMode === 'point' ? '#FFFFFF' : 'transparent',
                  color: locationMode === 'point' ? '#1E40AF' : '#64748B',
                  boxShadow: locationMode === 'point' ? 'var(--shadow-subtle)' : 'none',
                }}
              >
                Point Mode (Lat/Lon)
              </button>
            </div>
          </div>

          {locationMode === 'region' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                  State
                </label>
                <select
                  value={selectedStateId}
                  onChange={(e) => setSelectedStateId(e.target.value)}
                  className="ca-select"
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
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                  District
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  disabled={!selectedStateId}
                  className="ca-select"
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
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                  Sub-district / Block
                </label>
                <select
                  value={selectedBlockId}
                  onChange={(e) => setSelectedBlockId(e.target.value)}
                  disabled={!selectedDistrictId}
                  className="ca-select"
                >
                  <option value="">Select Block</option>
                  {blocks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                  Latitude (°N)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={pointLat}
                  onChange={(e) => setPointLat(parseFloat(e.target.value) || 0)}
                  className="ca-input"
                  placeholder="28.5355"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                  Longitude (°E)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={pointLon}
                  onChange={(e) => setPointLon(parseFloat(e.target.value) || 0)}
                  className="ca-input"
                  placeholder="77.3910"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    // Quick pre-fill Dadri / NCR sample
                    setPointLat(28.5355);
                    setPointLon(77.391);
                  }}
                  className="ca-btn ca-btn-secondary"
                  style={{ width: '100%', height: 36, fontSize: 12 }}
                >
                  Snap to NCR Sample
                </button>
              </div>
            </div>
          )}

          {/* Grid snap status indicator */}
          <div
            style={{
              marginTop: 10,
              padding: '6px 12px',
              background: '#F8F9FA',
              border: '1px solid #E4E7EC',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <span>
                <strong>Nearest Grid:</strong> {resolvedGridCell.lat.toFixed(2)}°N / {resolvedGridCell.lon.toFixed(2)}°E
              </span>
              <span>
                <strong>Ref Grid:</strong>{' '}
                <code style={{ fontFamily: 'var(--font-mono)', color: '#1E40AF' }}>{resolvedGridCell.id}</code>
              </span>
            </div>
            <span style={{ color: '#667085', fontSize: 11 }}>Resolution: {resolvedGridCell.resolution}°</span>
          </div>
        </div>

        {/* Section 2: Date & Criteria */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {/* Start Date */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              min="1979-01-01"
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="ca-input"
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max="2026-12-31"
              onChange={(e) => setEndDate(e.target.value)}
              className="ca-input"
            />
          </div>

          {/* Criteria Threshold */}
          {showCriteria && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                Threshold ({unit})
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <select className="ca-select" style={{ width: 80 }} value=">=" disabled>
                  <option value=">=">&gt;=</option>
                </select>
                <input
                  type="number"
                  value={isRain ? rainThreshold : tempThreshold}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    if (isRain) setRainThreshold(v);
                    else setTempThreshold(v);
                  }}
                  className="ca-input"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          )}

          {/* Criteria Break Days */}
          {showCriteria && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 4 }}>
                Break Days (Tolerance)
              </label>
              <input
                type="number"
                value={isRain ? rainBreakDays : tempBreakDays}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10) || 0;
                  if (isRain) setRainBreakDays(v);
                  else setTempBreakDays(v);
                }}
                className="ca-input"
                min="0"
                max="10"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <button
            type="button"
            onClick={resetFilters}
            className="ca-btn ca-btn-secondary"
            style={{ fontSize: 12, gap: 6 }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            className="ca-btn ca-btn-primary"
            style={{ padding: '8px 24px', fontWeight: 600, fontSize: 13, gap: 8 }}
          >
            <Play size={14} fill="#FFFFFF" />
            <span>ANALYZE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
