import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import {
  Bell,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'LU';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          height: '100%',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: ClimAnalytix Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink
            to="/dashboard"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none',
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#2563EB',
                letterSpacing: '-0.02em',
              }}
            >
              Clim
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#16A34A',
                letterSpacing: '-0.02em',
              }}
            >
              Analytix
            </span>
          </NavLink>
        </div>

        {/* Center: Centered Desktop Navigation Links (Exact ClimAnalytix) */}
        <nav
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
          className="ca-topbar-nav-desktop"
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `ca-nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#2563EB' : '#4B5563',
              transition: 'color 0.15s ease',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/rainfall/events"
            className={({ isActive }) => `ca-nav-link ${location.pathname.startsWith('/rainfall') ? 'active' : ''}`}
            style={() => {
              const active = location.pathname.startsWith('/rainfall');
              return {
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? '#2563EB' : '#4B5563',
                transition: 'color 0.15s ease',
              };
            }}
          >
            Rainfall Analysis
          </NavLink>

          <NavLink
            to="/temperature/events"
            className={({ isActive }) => `ca-nav-link ${location.pathname.startsWith('/temperature') ? 'active' : ''}`}
            style={() => {
              const active = location.pathname.startsWith('/temperature');
              return {
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? '#2563EB' : '#4B5563',
                transition: 'color 0.15s ease',
              };
            }}
          >
            Temperature Analysis
          </NavLink>

          <NavLink
            to="/crop-dashboard"
            className={({ isActive }) => `ca-nav-link ${location.pathname.startsWith('/crop') ? 'active' : ''}`}
            style={() => {
              const active = location.pathname.startsWith('/crop');
              return {
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? '#2563EB' : '#4B5563',
                transition: 'color 0.15s ease',
              };
            }}
          >
            Crop Dashboard
          </NavLink>
        </nav>

        {/* Right Section: Notification Bell & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Notification Bell */}
          <button
            onClick={() => alert('No new notifications. All weather and observational feeds are operational.')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.15s ease',
            }}
            title="Notifications"
          >
            <Bell size={19} />
            <span
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                background: '#EF4444',
                borderRadius: '50%',
                border: '1.5px solid #FFFFFF',
              }}
            />
          </button>

          {/* User Avatar Circle */}
          <div ref={userRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              title="User Account"
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
                }}
              >
                {initials}
              </div>
              <ChevronDown size={14} color="#6B7280" />
            </button>

            {userMenuOpen && (
              <div
                className="ca-floating-menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 12px)',
                  width: 220,
                  background: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                  padding: '8px',
                  zIndex: 1100,
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #F3F4F6', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{user?.email}</div>
                  <div style={{ fontSize: 11, color: '#2563EB', marginTop: 2, fontWeight: 600 }}>
                    {user?.organization}
                  </div>
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
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  className="ca-dropdown-item"
                >
                  <Settings size={14} />
                  <span>Settings</span>
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
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  className="ca-dropdown-item"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{
              display: 'none',
              width: 34,
              height: 34,
              borderRadius: 6,
              border: '1px solid #E5E7EB',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4B5563',
              background: '#FFFFFF',
              cursor: 'pointer',
            }}
            className="ca-mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="ca-mobile-dropdown"
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            background: '#FFFFFF',
            borderBottom: '1px solid #E5E7EB',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <NavLink to="/dashboard" className="ca-mobile-link">Home</NavLink>
          <NavLink to="/rainfall/events" className="ca-mobile-link">Rainfall Analysis</NavLink>
          <NavLink to="/temperature/events" className="ca-mobile-link">Temperature Analysis</NavLink>
          <NavLink to="/crop-dashboard" className="ca-mobile-link">Crop Dashboard</NavLink>
          <NavLink to="/settings" className="ca-mobile-link">Settings</NavLink>
        </div>
      )}
    </header>
  );
};
