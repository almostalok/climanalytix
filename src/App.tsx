import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ClimateProvider } from './store/ClimateContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './features/dashboard/DashboardPage';

// Route-level code splitting for heavy sub-modules
const RainfallLayout = React.lazy(() => import('./features/rainfall/RainfallLayout').then((m) => ({ default: m.RainfallLayout })));
const RainEventPage = React.lazy(() => import('./features/rainfall/EventAnalyzerPage').then((m) => ({ default: m.EventAnalyzerPage })));
const RainYearlyPage = React.lazy(() => import('./features/rainfall/YearlyCountsPage').then((m) => ({ default: m.YearlyCountsPage })));
const RainTrendPage = React.lazy(() => import('./features/rainfall/TrendPage').then((m) => ({ default: m.TrendPage })));
const RainVizPage = React.lazy(() => import('./features/rainfall/VisualizationPage').then((m) => ({ default: m.VisualizationPage })));

const TemperatureLayout = React.lazy(() => import('./features/temperature/TemperatureLayout').then((m) => ({ default: m.TemperatureLayout })));
const TempEventAnalyzerPage = React.lazy(() => import('./features/temperature/TempEventAnalyzerPage').then((m) => ({ default: m.TempEventAnalyzerPage })));
const HotDaysPage = React.lazy(() => import('./features/temperature/HotDaysPage').then((m) => ({ default: m.HotDaysPage })));
const TempVisualizationPage = React.lazy(() => import('./features/temperature/TempVisualizationPage').then((m) => ({ default: m.TempVisualizationPage })));

const CropDashboardPage = React.lazy(() => import('./features/crop/CropDashboardPage').then((m) => ({ default: m.CropDashboardPage })));
const SettingsPage = React.lazy(() => import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const PageLoadingFallback: React.FC = () => (
  <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748B', fontSize: 14 }}>
    Loading analytics view...
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClimateProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected application shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Rainfall Module */}
              <Route path="rainfall" element={<RainfallLayout />}>
                <Route index element={<Navigate to="/rainfall/events" replace />} />
                <Route path="events" element={<RainEventPage />} />
                <Route path="yearly" element={<RainYearlyPage />} />
                <Route path="trend" element={<RainTrendPage />} />
                <Route path="visualization" element={<RainVizPage />} />
              </Route>

              {/* Temperature Module */}
              <Route path="temperature" element={<TemperatureLayout />}>
                <Route index element={<Navigate to="/temperature/events" replace />} />
                <Route path="events" element={<TempEventAnalyzerPage />} />
                <Route path="hot-days" element={<HotDaysPage />} />
                <Route path="visualization" element={<TempVisualizationPage />} />
              </Route>

              {/* Crop Intelligence Phase 2 placeholder */}
              <Route path="crop-dashboard" element={<CropDashboardPage />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsPage />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </ClimateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
