import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudRain,
  Thermometer,
  Sprout,
  Settings,
  ChevronDown,
  ChevronRight,
  Activity,
  CalendarDays,
  TrendingUp,
  MapPin,
  Flame,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Keep groups expanded by default
  const [rainOpen, setRainOpen] = useState(true);
  const [tempOpen, setTempOpen] = useState(true);

  const isRainActive = location.pathname.startsWith('/rainfall');
  const isTempActive = location.pathname.startsWith('/temperature');

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            zIndex: 150,
            display: 'none',
          }}
          className="ca-sidebar-backdrop"
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width, 250px)',
          background: '#FFFFFF',
          borderRight: '1px solid var(--border-default, #E4E7EC)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 160,
          transition: 'transform 200ms ease',
          flexShrink: 0,
        }}
        className={`ca-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Top: Logo & Title */}
        <div>
          <div
            style={{
              height: 'var(--header-height, 64px)',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-default, #E4E7EC)',
            }}
          >
            <NavLink to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: '#1E40AF',
                  borderRadius: 6,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                }}
              >
                CA
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', letterSpacing: '0.04em' }}>
                  CLIMATE
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1E40AF', letterSpacing: '0.08em' }}>
                  ANALYTICS
                </div>
              </div>
            </NavLink>

            <button
              onClick={onClose}
              style={{
                display: 'none',
                color: '#667085',
                padding: 4,
              }}
              className="ca-sidebar-close"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Overview */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `ca-nav-item ${isActive ? 'active' : ''}`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                color: '#4B5563',
                transition: 'background 120ms ease, color 120ms ease',
              }}
            >
              <LayoutDashboard size={17} />
              <span>Overview</span>
            </NavLink>

            {/* Rainfall Analysis Section */}
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setRainOpen(!rainOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isRainActive ? '#1E40AF' : '#111827',
                  borderRadius: 6,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CloudRain size={17} color={isRainActive ? '#0284C7' : '#4B5563'} />
                  <span>Rainfall Analysis</span>
                </div>
                {rainOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {rainOpen && (
                <div style={{ paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                  <NavLink
                    to="/rainfall/events"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <Activity size={14} />
                    <span>Event Analyzer</span>
                  </NavLink>
                  <NavLink
                    to="/rainfall/yearly"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <CalendarDays size={14} />
                    <span>Yearly Counts</span>
                  </NavLink>
                  <NavLink
                    to="/rainfall/trend"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <TrendingUp size={14} />
                    <span>Rainfall Trend</span>
                  </NavLink>
                  <NavLink
                    to="/rainfall/visualization"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <MapPin size={14} />
                    <span>Visualization</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Temperature Analysis Section */}
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setTempOpen(!tempOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isTempActive ? '#EA580C' : '#111827',
                  borderRadius: 6,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Thermometer size={17} color={isTempActive ? '#EA580C' : '#4B5563'} />
                  <span>Temperature</span>
                </div>
                {tempOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {tempOpen && (
                <div style={{ paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                  <NavLink
                    to="/temperature/events"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <Activity size={14} />
                    <span>Event Analyzer</span>
                  </NavLink>
                  <NavLink
                    to="/temperature/hot-days"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <Flame size={14} />
                    <span>Hot Days</span>
                  </NavLink>
                  <NavLink
                    to="/temperature/visualization"
                    className={({ isActive }) => `ca-subnav-item ${isActive ? 'active' : ''}`}
                  >
                    <MapPin size={14} />
                    <span>Visualization</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Crop Dashboard (Phase 2) */}
            <div style={{ marginTop: 8 }}>
              <NavLink
                to="/crop-dashboard"
                className={({ isActive }) => `ca-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#4B5563',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sprout size={17} />
                  <span>Crop Dashboard</span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    background: '#F3F4F6',
                    color: '#6B7280',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  Phase 2
                </span>
              </NavLink>
            </div>

            {/* Settings */}
            <div style={{ marginTop: 4 }}>
              <NavLink
                to="/settings"
                className={({ isActive }) => `ca-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#4B5563',
                }}
              >
                <Settings size={17} />
                <span>Settings</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom Status & Version */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border-default, #E4E7EC)',
            background: '#F8F9FA',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#065F46', fontWeight: 500 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block',
              }}
            />
            <span>Systems operational</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: '#667085' }}>
            <span>Version</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>v0.1.0-demo</span>
          </div>
        </div>
      </aside>
    </>
  );
};
