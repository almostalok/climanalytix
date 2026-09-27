import React from 'react';
import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';
import { Footer } from './Footer';

export const AppShell: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary, #F7F8FA)',
        paddingTop: 64, // Space for the fixed navbar
      }}
    >
      {/* Fixed Navbar with centered navigation */}
      <Topbar />

      {/* Main Content Area matching ClimAnalytix clean layout */}
      <main
        style={{
          flex: 1,
          padding: '24px 24px 48px 24px',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
