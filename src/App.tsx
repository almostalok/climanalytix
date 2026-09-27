import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ClimateProvider } from './store/ClimateContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './features/dashboard/DashboardPage';
import { RainfallLayout } from './features/rainfall/RainfallLayout';
import { EventAnalyzerPage as RainEventPage } from './features/rainfall/EventAnalyzerPage';
import { YearlyCountsPage as RainYearlyPage } from './features/rainfall/YearlyCountsPage';
import { TrendPage as RainTrendPage } from './features/rainfall/TrendPage';
import { VisualizationPage as RainVizPage } from './features/rainfall/VisualizationPage';

import { TemperatureLayout } from './features/temperature/TemperatureLayout';
import { TempEventAnalyzerPage } from './features/temperature/TempEventAnalyzerPage';
import { HotDaysPage } from './features/temperature/HotDaysPage';
import { TempVisualizationPage } from './features/temperature/TempVisualizationPage';

import { CropDashboardPage } from './features/crop/CropDashboardPage';
import { SettingsPage } from './features/settings/SettingsPage';

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
