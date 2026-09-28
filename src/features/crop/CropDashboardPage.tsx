import React, { useState } from 'react';
import {
  ShieldAlert,
  CloudRain,
  Sprout,
  Calendar,
  BarChart3,
  TrendingUp,
  History,
  Sun,
  Wind,
  Layers,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  CheckCircle2,
  FileText,
  Building2,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CropModuleDef {
  id: string;
  pageIndex: number;
  title: string;
  category: string;
  accent: string;
  description: string;
  stats: { label: string; value: string }[];
  visualTag: string;
}

export const CropDashboardPage: React.FC = () => {
  // Page mode: 'cover' (Page 1) | 'contents' (Page 2) | 'module' (Page 3-13)
  const [currentView, setCurrentView] = useState<'cover' | 'contents' | 'module'>('cover');
  const [activeModuleId, setActiveModuleId] = useState<string>('district_insurer');
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);

  // Filters within interactive module view
  const [selectedYear, setSelectedYear] = useState<string>('2024-25');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedInsurer, setSelectedInsurer] = useState<string>('All Insurers');
  const [selectedScheme, setSelectedScheme] = useState<string>('PMFBY');
  const [viewType, setViewType] = useState<'graph' | 'table'>('graph');
  const [metricMode, setMetricMode] = useState<'premium' | 'sum_insured'>('premium');

  const modules: CropModuleDef[] = [
    {
      id: 'district_insurer',
      pageIndex: 3,
      title: 'District & Insurer Wise',
      category: 'Coverage & Underwriting',
      accent: '#2563EB',
      description: 'District level insurance enrollment, sum insured, and insurer market allocations under PMFBY.',
      stats: [{ label: 'Districts', value: '718' }, { label: 'Insurers', value: '18 Active' }],
      visualTag: 'Insurance Coverage Maps',
    },
    {
      id: 'rainfall_insurer',
      pageIndex: 4,
      title: 'Rainfall Analysis (Insurer Wise)',
      category: 'Weather Risk',
      accent: '#0284C7',
      description: 'Historical precipitation flux correlated to specific insurer portfolios across major agro-climatic zones.',
      stats: [{ label: 'Grid Res', value: '0.25° IMD' }, { label: 'Deficit Alert', value: '-20% Baseline' }],
      visualTag: 'Rainfall Departure Maps',
    },
    {
      id: 'rainfall_sowing',
      pageIndex: 5,
      title: 'Rainfall & Sowing Progress',
      category: 'Agro-Meteorology',
      accent: '#059669',
      description: 'Tracking monsoon onset, initial 50mm moisture accumulation, and sowing window progression.',
      stats: [{ label: 'Window', value: 'Jun – Aug' }, { label: 'Moisture Trigger', value: '50 mm' }],
      visualTag: 'Rainfall vs Sowing Curves',
    },
    {
      id: 'crop_sowing_status',
      pageIndex: 6,
      title: 'Crop Sowing Status',
      category: 'Operational Monitoring',
      accent: '#10B981',
      description: 'Real-time and historical sowing acreage reports across Kharif, Rabi, and Zaid crop seasons.',
      stats: [{ label: 'Key Crops', value: 'Paddy, Cotton, Soy' }, { label: 'Normal Area', value: '5-Yr Avg' }],
      visualTag: 'Acreage Time Series',
    },
    {
      id: 'crop_calendar',
      pageIndex: 7,
      title: 'Crop Sowing & Harvest Calendar',
      category: 'Phenology & Calendar',
      accent: '#7C3AED',
      description: 'Detailed crop stage timelines from vegetative growth to flowering, maturity, and harvesting.',
      stats: [{ label: 'Stages', value: '5 Pheno Stages' }, { label: 'States', value: '36 States / UTs' }],
      visualTag: 'Duration Matrix Windows',
    },
    {
      id: 'crop_yield_climatology',
      pageIndex: 8,
      title: 'Crop Yield & Climatology',
      category: 'Yield & Production',
      accent: '#D97706',
      description: 'Historical crop cutting experiment (CCE) yield baselines cross-referenced with climate indices.',
      stats: [{ label: 'Timeseries', value: '2000–2025' }, { label: 'Metric', value: 'Threshold Yield' }],
      visualTag: 'CCE vs SST Anomalies',
    },
    {
      id: 'crop_apr',
      pageIndex: 9,
      title: 'Crop Wise APR (%)',
      category: 'Actuarial Pricing',
      accent: '#DC2626',
      description: 'Actuarial Premium Rate (APR) evaluation, burning cost analysis, and pure risk rate benchmarks.',
      stats: [{ label: 'Rate Band', value: '1.5% – 24.0%' }, { label: 'Model', value: 'Burn Cost' }],
      visualTag: 'APR Rate Matrix Heatmap',
    },
    {
      id: 'previous_year_coverage',
      pageIndex: 10,
      title: 'Previous Year Coverage',
      category: 'Historical Enrollment',
      accent: '#475569',
      description: 'Multi-year historical coverage analytics, sum insured shifts, and farmer participation trends.',
      stats: [{ label: 'Range', value: '2016–2025' }, { label: 'Split', value: 'Loanee / Non-Loanee' }],
      visualTag: 'Multi-Year Claims & GP',
    },
    {
      id: 'drought_analysis',
      pageIndex: 11,
      title: 'Drought Analysis (1901–2020)',
      category: 'Long-term Hazards',
      accent: '#EA580C',
      description: '120-year meteorological and agricultural drought severity analysis using standardized indices (SPI & SPEI).',
      stats: [{ label: 'Record', value: '120 Years' }, { label: 'Indices', value: 'SPI-1, SPI-3, SPEI-6' }],
      visualTag: 'Centennial SPI Maps',
    },
    {
      id: 'cyclone_analysis',
      pageIndex: 12,
      title: 'Cyclone Analysis',
      category: 'Severe Hazards',
      accent: '#0891B2',
      description: 'Historical tropical cyclone tracks, landfall locations, sustained wind speeds, and coastal inundation.',
      stats: [{ label: 'Basins', value: 'BoB & Arabian Sea' }, { label: 'Scale', value: 'IMD Wind Scale' }],
      visualTag: 'Track Footprints & Rain',
    },
    {
      id: 'climate_drivers',
      pageIndex: 13,
      title: 'Climate drivers and Yield variation - State level Analysis',
      category: 'Teleconnections',
      accent: '#4F46E5',
      description: 'Ocean-atmosphere teleconnections including ENSO (El Niño / La Niña) and Indian Ocean Dipole (IOD).',
      stats: [{ label: 'Indices', value: 'Niño 3.4 & DMI' }, { label: 'Impact', value: 'State Yield Deficit' }],
      visualTag: 'ENSO Phase Correlation',
    },
  ];

  const currentModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  const insurerMarketData = [
    { name: 'Agriculture Insurance Co. (AIC)', premium: 4820, share: 38.6, color: '#2563EB' },
    { name: 'HDFC ERGO General', premium: 2450, share: 19.6, color: '#10B981' },
    { name: 'Bajaj Allianz General', premium: 1890, share: 15.1, color: '#F59E0B' },
    { name: 'ICICI Lombard', premium: 1420, share: 11.4, color: '#8B5CF6' },
    { name: 'SBI General Insurance', premium: 1120, share: 9.0, color: '#EC4899' },
    { name: 'Others (Private Consortium)', premium: 780, share: 6.3, color: '#64748B' },
  ];

  const districtCoverageData = [
    { district: 'Gautam Buddha Nagar', sumInsured: 1450, grossPremium: 188.5, farmers: 64200, claimRatio: 42.1 },
    { district: 'Bulandshahr', sumInsured: 2180, grossPremium: 283.4, farmers: 98400, claimRatio: 51.4 },
    { district: 'Aligarh', sumInsured: 1940, grossPremium: 252.2, farmers: 87100, claimRatio: 38.9 },
    { district: 'Mathura', sumInsured: 2420, grossPremium: 314.6, farmers: 112000, claimRatio: 64.2 },
    { district: 'Agra', sumInsured: 1810, grossPremium: 235.3, farmers: 79500, claimRatio: 47.8 },
    { district: 'Meerut', sumInsured: 1650, grossPremium: 214.5, farmers: 71300, claimRatio: 36.5 },
  ];

  return (
    <div
      style={{
        width: '100%',
        minHeight: '780px',
        background: '#0B1E36', // Dark teal-navy background matching ClimAnalytix
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ============================================================== */}
      {/* PHASE 2 PREVIEW MANDATORY DISCLAIMER BANNER                   */}
      {/* ============================================================== */}
      <div
        style={{
          background: '#FEF3C7',
          borderBottom: '1px solid #FDE68A',
          padding: '10px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#92400E',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              background: '#D97706',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              letterSpacing: '0.04em',
            }}
          >
            PHASE 2 PREVIEW
          </span>
          <span>
            <strong>Notice:</strong> Crop intelligence capabilities are planned for a subsequent release and are not part of the current MVP. All displayed agro-insurance yields, loss ratios, and drought matrices are demonstrator / preview models.
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#B45309', fontWeight: 600 }}>Non-Contractual MVP Scope</span>
      </div>

      {/* ============================================================== */}
      {/* 1. TOP POWERBI-STYLE HEADER BAR                                */}
      {/* ============================================================== */}
      <div
        style={{
          background: '#081728',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {currentView !== 'contents' && (
            <button
              onClick={() => setCurrentView('contents')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 6,
                padding: '6px 12px',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              title="Return to 11 Modules Contents Grid"
            >
              <LayoutGrid size={14} />
              <span>Contents</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.01em' }}>
              Crop Insurance Dashboard
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#FBBF24',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              PHASE 2
            </span>
            {currentView === 'module' && (
              <>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
                <span style={{ fontSize: 14, color: '#F1F5F9', fontWeight: 600 }}>
                  {currentModule.title}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Howden Climate Intelligence Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            HOWDEN CLIMATE INTELLIGENCE
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN BODY: VIEW SWITCHER (COVER / CONTENTS / MODULE)        */}
      {/* ============================================================== */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* VIEW A: COVER PRESENTATION (Exact Page 1 on ClimAnalytix) */}
        {currentView === 'cover' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '60px 48px',
              background: 'radial-gradient(circle at 80% 20%, #173B63 0%, #081C30 70%)',
              color: '#FFFFFF',
              position: 'relative',
              minHeight: '660px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#38BDF8',
                  marginBottom: 20,
                }}
              >
                In-Season Agriculture & Weather Analytics
              </div>

              <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, maxWidth: 800, margin: 0 }}>
                Crop Insurance Dashboard
              </h1>
              <p
                style={{
                  fontSize: 18,
                  color: '#94A3B8',
                  maxWidth: 680,
                  marginTop: 16,
                  lineHeight: 1.6,
                }}
              >
                Comprehensive spatial intelligence on crop insurance coverage, sowing progress, rainfall departure, and historical drought/cyclone risk patterns across India.
              </p>
            </div>

            {/* Bottom Section with Solid Green START Button matching reference */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: 32,
              }}
            >
              <div style={{ display: 'flex', gap: 32, fontSize: 13, color: '#94A3B8' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>11 Modules</div>
                  <div>Underwriting & Agro-Met</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>718 Districts</div>
                  <div>Pan-India Granularity</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF' }}>1901 – 2026</div>
                  <div>Historical Climatology</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentView('contents');
                  setShowWelcomeModal(true);
                }}
                style={{
                  background: '#16A34A', // Exact green START button on ClimAnalytix
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  padding: '14px 44px',
                  fontSize: 18,
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#15803D')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#16A34A')}
              >
                <span>START</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* VIEW B: CONTENTS 11-MODULE GRID (Exact Page 2 on ClimAnalytix) */}
        {currentView === 'contents' && (
          <div style={{ flex: 1, padding: '24px 32px', position: 'relative' }}>
            {/* Contents Title Header */}
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Contents
                </h2>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>
                  Select any module below to launch its interactive analytical dashboard
                </span>
              </div>

              <button
                onClick={() => setCurrentView('cover')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 6,
                  padding: '6px 12px',
                  color: '#94A3B8',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                ← Cover Slide
              </button>
            </div>

            {/* 4-Column Grid of 11 Modules + Disclaimer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {modules.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveModuleId(m.id);
                    setCurrentView('module');
                  }}
                  style={{
                    background: '#0D2744',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: 150,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38BDF8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#38BDF8',
                          background: 'rgba(56, 189, 248, 0.12)',
                          padding: '2px 6px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {m.category}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                        P.{m.pageIndex}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.35 }}>
                      {m.title}
                    </h3>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{m.visualTag}</span>
                    <ArrowRight size={13} color="#38BDF8" />
                  </div>
                </div>
              ))}

              {/* Disclaimer Card matching reference */}
              <div
                style={{
                  background: 'rgba(13, 39, 68, 0.5)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: 10,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: '#64748B',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Data Citations & Sources</div>
                IMD Gridded High-Resolution Lattice, PMFBY Dashboard, Dept. of Agriculture & Farmers Welfare, Copernicus C3S Reanalysis.
              </div>
            </div>

            {/* WELCOME MODAL OVERLAY (Exact ClimAnalytix) */}
            {showWelcomeModal && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(8, 23, 40, 0.85)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    background: '#0D2744',
                    border: '1px solid #38BDF8',
                    borderRadius: 12,
                    maxWidth: 580,
                    width: '100%',
                    padding: '28px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                    color: '#FFFFFF',
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() => setShowWelcomeModal(false)}
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#38BDF8', margin: '0 0 14px 0' }}>
                    About This Dashboard
                  </h3>

                  <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6, marginBottom: 12 }}>
                    This Agriculture & Weather dashboard provides detailed information about in-season coverage of different Crop Insurance schemes, Sowing progress, rainfall analysis, historical flood, drought pattern & other related insights.
                  </p>

                  <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 12 }}>
                    Additionally, the dashboard helps you analyze the historical coverage & performance of crop insurance schemes for respective Year, Season, State and implementing insurer.
                  </p>

                  <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                    The all-in-one dashboard uses different portals/reports (for source data) clubbed with the analytical expertise of our in-house team and presents a comprehensive analysis/summary to keep the user updated throughout the season/year.
                  </p>

                  <button
                    onClick={() => setShowWelcomeModal(false)}
                    style={{
                      background: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 24px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Explore Contents
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW C: INTERACTIVE MODULE DEEP DIVE (Exact ClimAnalytix Module Experience) */}
        {currentView === 'module' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
            {/* Top Interactive Module Controls Bar */}
            <div
              style={{
                background: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                padding: '12px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {/* Year Dropdown */}
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    YEAR
                  </span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="ca-select"
                    style={{ height: 32, fontSize: 12, width: 'auto', fontWeight: 600 }}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2021-22">2021-22</option>
                  </select>
                </div>

                {/* Season Dropdown */}
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    SEASON
                  </span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="ca-select"
                    style={{ height: 32, fontSize: 12, width: 'auto', fontWeight: 600 }}
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Commercial">Commercial/Horticulture</option>
                  </select>
                </div>

                {/* State Dropdown */}
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    STATE
                  </span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="ca-select"
                    style={{ height: 32, fontSize: 12, width: 'auto', fontWeight: 600 }}
                  >
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                {/* Insurer Dropdown */}
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    INSURER
                  </span>
                  <select
                    value={selectedInsurer}
                    onChange={(e) => setSelectedInsurer(e.target.value)}
                    className="ca-select"
                    style={{ height: 32, fontSize: 12, width: 'auto', fontWeight: 600 }}
                  >
                    <option value="All Insurers">All Insurers</option>
                    <option value="AIC">AIC of India</option>
                    <option value="HDFC ERGO">HDFC ERGO</option>
                    <option value="Bajaj Allianz">Bajaj Allianz</option>
                    <option value="ICICI Lombard">ICICI Lombard</option>
                  </select>
                </div>

                {/* Scheme Dropdown */}
                <div>
                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    SCHEME
                  </span>
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="ca-select"
                    style={{ height: 32, fontSize: 12, width: 'auto', fontWeight: 600 }}
                  >
                    <option value="PMFBY">PMFBY</option>
                    <option value="RWBCIS">RWBCIS</option>
                  </select>
                </div>
              </div>

              {/* View Switches matching ClimAnalytix */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Graphical vs Table */}
                <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2 }}>
                  <button
                    onClick={() => setViewType('graph')}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      background: viewType === 'graph' ? '#FFFFFF' : 'transparent',
                      color: viewType === 'graph' ? '#2563EB' : '#64748B',
                      boxShadow: viewType === 'graph' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    Graphical View
                  </button>
                  <button
                    onClick={() => setViewType('table')}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      background: viewType === 'table' ? '#FFFFFF' : 'transparent',
                      color: viewType === 'table' ? '#2563EB' : '#64748B',
                      boxShadow: viewType === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    Table View
                  </button>
                </div>

                {/* Gross Premium vs Sum Insured */}
                <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 6, padding: 2 }}>
                  <button
                    onClick={() => setMetricMode('premium')}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      background: metricMode === 'premium' ? '#FFFFFF' : 'transparent',
                      color: metricMode === 'premium' ? '#2563EB' : '#64748B',
                      boxShadow: metricMode === 'premium' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    Gross Premium
                  </button>
                  <button
                    onClick={() => setMetricMode('sum_insured')}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      background: metricMode === 'sum_insured' ? '#FFFFFF' : 'transparent',
                      color: metricMode === 'sum_insured' ? '#2563EB' : '#64748B',
                      boxShadow: metricMode === 'sum_insured' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    Sum Insured
                  </button>
                </div>
              </div>
            </div>

            {/* Module Analytical Content */}
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Summary Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Total Gross Premium</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#2563EB', marginTop: 2 }}>₹ 12,480 Cr</div>
                  <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>+8.4% YoY Growth</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Total Sum Insured</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>₹ 84,250 Cr</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Across all implementing clusters</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Farmer Applications</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginTop: 2 }}>2.41 Crore</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>74% Loanee, 26% Non-Loanee</div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Area Insured (GCA)</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706', marginTop: 2 }}>18.6 M Ha</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Coverage: 44.2% Gross Cropped</div>
                </div>
              </div>

              {/* View Rendering: Graphical vs Table */}
              {viewType === 'graph' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
                  {/* Left: Insurer Market Share Bar Chart */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                      Insurer Wise Premium Underwriting ({selectedYear})
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
                      Gross Premium (₹ Cr) allocated per implementing general insurer
                    </div>

                    <div style={{ height: 280, width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={insurerMarketData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} unit=" Cr" />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} width={160} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const item = payload[0].payload;
                                return (
                                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
                                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                                    <div style={{ color: '#2563EB', marginTop: 2 }}>Premium: ₹ {item.premium} Cr ({item.share}%)</div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="premium" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20}>
                            {insurerMarketData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right: Market Share Donut Chart */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '18px' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                      Market Allocation (%)
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
                      Insurer concentration across {selectedState}
                    </div>

                    <div style={{ height: 280, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={insurerMarketData}
                            dataKey="share"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={2}
                          >
                            {insurerMarketData.map((entry, index) => (
                              <Cell key={`slice-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any, name: any) => [`${value}% Share`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                /* Table View */
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                  <table className="ca-table">
                    <thead>
                      <tr>
                        <th>District / Cluster</th>
                        <th style={{ textAlign: 'right' }}>Sum Insured (₹ Cr)</th>
                        <th style={{ textAlign: 'right' }}>Gross Premium (₹ Cr)</th>
                        <th style={{ textAlign: 'right' }}>Farmer Applications</th>
                        <th style={{ textAlign: 'right' }}>Claims Ratio (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {districtCoverageData.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{row.district}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹ {row.sumInsured} Cr</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#2563EB' }}>
                            ₹ {row.grossPremium} Cr
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{row.farmers.toLocaleString()}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: row.claimRatio > 50 ? '#DC2626' : '#16A34A' }}>
                            {row.claimRatio}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM POWERBI-STYLE NAVIGATION BAR (Exact ClimAnalytix)    */}
      {/* ============================================================== */}
      <div
        style={{
          background: '#071524',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#94A3B8',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              if (currentView === 'module') setCurrentView('contents');
              else if (currentView === 'contents') setCurrentView('cover');
            }}
            disabled={currentView === 'cover'}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentView === 'cover' ? '#475569' : '#FFFFFF',
              cursor: currentView === 'cover' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          <span>
            {currentView === 'cover'
              ? '1 of 12'
              : currentView === 'contents'
              ? '2 of 12'
              : `${currentModule.pageIndex} of 12`}
          </span>

          <button
            onClick={() => {
              if (currentView === 'cover') setCurrentView('contents');
              else if (currentView === 'contents') {
                setActiveModuleId(modules[0].id);
                setCurrentView('module');
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>

          <span style={{ marginLeft: 12, color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
          <span style={{ marginLeft: 12, color: '#E2E8F0', fontWeight: 600 }}>
            {currentView === 'cover'
              ? 'Crop Insurance Dashboard (Cover)'
              : currentView === 'contents'
              ? 'Contents (11 Analytics Modules)'
              : currentModule.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Source: PMFBY, IMD 0.25° Gridded, DA&FW</span>
          <span style={{ color: '#38BDF8', fontWeight: 600 }}>ClimAnalytix Intelligence Suite</span>
        </div>
      </div>
    </div>
  );
};
