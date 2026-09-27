import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useClimate } from '../../store/ClimateContext';
import { User, Sliders, Database, Info, ShieldCheck, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedDataset, setSelectedDataset, manifest } = useClimate();

  const [name, setName] = useState(user?.name || 'Climate Analyst');
  const [email] = useState(user?.email || 'analyst@climanalytics.in');
  const [defaultMapView, setDefaultMapView] = useState('india-central');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>
          Platform Settings
        </h2>
        <p style={{ fontSize: 14, color: '#667085', margin: 0 }}>
          Manage your analyst profile, default observational preferences, and workspace configuration.
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 16px',
            borderRadius: 6,
            fontSize: 13,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Check size={16} color="#10B981" />
          <span>Preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: Profile */}
        <div className="ca-card">
          <div className="ca-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} color="#1E40AF" />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Analyst Profile</h3>
            </div>
            <span style={{ fontSize: 11, color: '#667085' }}>RBAC: {user?.role || 'Lead Scientist'}</span>
          </div>

          <div className="ca-card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ca-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 6 }}>
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="ca-input"
                style={{ background: '#F9FAFB', color: '#6B7280' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 6 }}>
                Organization
              </label>
              <input
                type="text"
                value={user?.organization || 'National Climate Data Observatory'}
                disabled
                className="ca-input"
                style={{ background: '#F9FAFB', color: '#6B7280' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Preferences */}
        <div className="ca-card">
          <div className="ca-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sliders size={16} color="#1E40AF" />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Analytics Preferences</h3>
            </div>
          </div>

          <div className="ca-card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 6 }}>
                Default Reanalysis Dataset
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as any)}
                className="ca-select"
              >
                {manifest.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4B5563', marginBottom: 6 }}>
                Default Map Extent
              </label>
              <select
                value={defaultMapView}
                onChange={(e) => setDefaultMapView(e.target.value)}
                className="ca-select"
              >
                <option value="india-central">India Subcontinent (22.5°N, 79.5°E)</option>
                <option value="north-india">North India (Gangetic Plains)</option>
                <option value="south-india">Peninsular India (Deccan)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Application & Data Info */}
        <div className="ca-card">
          <div className="ca-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={16} color="#1E40AF" />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Application & Data Information</h3>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                background: '#F1F5F9',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              v0.1.0-demo
            </span>
          </div>

          <div className="ca-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: '#4B5563' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
              <span>Climate Engine Architecture:</span>
              <strong style={{ color: '#111827' }}>Deterministic Observational TypeScript Runtime</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
              <span>Temporal Resolution:</span>
              <strong style={{ color: '#111827' }}>Daily (1979 - 2026)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 8 }}>
              <span>Spatial Lattice Resolution:</span>
              <strong style={{ color: '#111827' }}>0.25° (~27.75 km at equator)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Target Production Pipeline:</span>
              <strong style={{ color: '#1E40AF' }}>Python xarray &rarr; Cloudflare R2 &rarr; Cloudflare Worker</strong>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="ca-btn ca-btn-primary" style={{ padding: '9px 24px', fontWeight: 600 }}>
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
};
