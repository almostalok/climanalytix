import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { useClimate } from '../../store/ClimateContext';
import { Bell, User, LogOut, Settings as SettingsIcon, Menu, Database, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { selectedDataset, setSelectedDataset, manifest } = useClimate();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Generate breadcrumb / title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'Dashboard Overview';
    if (path.startsWith('/rainfall/events')) return 'Rainfall / Event Analyzer';
    if (path.startsWith('/rainfall/yearly')) return 'Rainfall / Yearly Event Counts';
    if (path.startsWith('/rainfall/trend')) return 'Rainfall / Trend Analysis';
    if (path.startsWith('/rainfall/visualization')) return 'Rainfall / Synchronized GIS Maps';
    if (path.startsWith('/rainfall')) return 'Rainfall Analysis';
    if (path.startsWith('/temperature/events')) return 'Temperature / Event Analyzer';
    if (path.startsWith('/temperature/hot-days')) return 'Temperature / Hot Days Analysis';
    if (path.startsWith('/temperature/visualization')) return 'Temperature / Synchronized GIS Maps';
    if (path.startsWith('/temperature')) return 'Temperature Analysis';
    if (path.startsWith('/crop-dashboard')) return 'Crop Risk & Intelligence (Phase 2)';
    if (path.startsWith('/settings')) return 'Platform Settings';
    return 'Climate Analytics';
  };

  return (
    <header
      style={{
        height: 'var(--header-height, 64px)',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-default, #E4E7EC)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 6,
            border: '1px solid #E4E7EC',
            color: '#4B5563',
          }}
          className="ca-btn-secondary"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>{getPageTitle()}</h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Global Dataset Switcher Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F8F9FA',
            border: '1px solid #E4E7EC',
            borderRadius: 6,
            padding: '2px 4px',
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px', color: '#667085' }}>
            <Database size={13} />
            <span style={{ fontWeight: 500 }}>Dataset:</span>
          </div>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value as any)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 12,
              fontWeight: 600,
              color: '#1E40AF',
              outline: 'none',
              cursor: 'pointer',
              paddingRight: 6,
            }}
          >
            {manifest.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} ({m.resolution})
              </option>
            ))}
          </select>
        </div>

        {/* Data Freshness Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: 4,
            fontSize: 12,
            color: '#065F46',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10B981',
              display: 'inline-block',
            }}
          />
          <span>1979–2026 Live</span>
        </div>

        {/* Notifications Icon (Visual-only per spec) */}
        <button
          aria-label="System notifications"
          style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            border: '1px solid #E4E7EC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#667085',
            position: 'relative',
          }}
          onClick={() => alert('No active system alerts. All climate reanalysis data pipelines operating normally.')}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              background: '#3B82F6',
              borderRadius: '50%',
            }}
          />
        </button>

        {/* User Profile dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 8px',
              borderRadius: 6,
              border: '1px solid #E4E7EC',
              background: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1E40AF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                {user?.name || 'Analyst'}
              </span>
              <span style={{ fontSize: 11, color: '#667085', lineHeight: 1.1 }}>
                {user?.role || 'Lead Scientist'}
              </span>
            </div>
            <ChevronDown size={14} color="#667085" />
          </button>

          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                width: 210,
                background: '#FFFFFF',
                border: '1px solid #E4E7EC',
                borderRadius: 8,
                boxShadow: 'var(--shadow-dropdown)',
                padding: '6px',
                zIndex: 200,
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#667085' }}>{user?.email}</div>
                <div style={{ fontSize: 11, color: '#1E40AF', marginTop: 2 }}>{user?.organization}</div>
              </div>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/settings');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: 13,
                  color: '#374151',
                  borderRadius: 4,
                  textAlign: 'left',
                }}
                className="ca-btn-hover"
              >
                <SettingsIcon size={14} />
                <span>Account Settings</span>
              </button>

              <button
                onClick={async () => {
                  setUserMenuOpen(false);
                  await logout();
                  navigate('/login');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '8px 10px',
                  fontSize: 13,
                  color: '#DC2626',
                  borderRadius: 4,
                  textAlign: 'left',
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
