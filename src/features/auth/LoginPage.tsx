import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('lokesh.upreti@howdengroup.com');
  const [password, setPassword] = useState('Lokesh@80198');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 50%, #ECFDF5 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* Left branding pane */}
        <div style={{ padding: '20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#1D4ED8', letterSpacing: '-0.02em' }}>
              Clim
            </span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#10B981', letterSpacing: '-0.02em' }}>
              Analytix
            </span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 16 }}>
            Historical Weather Data & Climate Risk Intelligence
          </h1>

          <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.6, marginBottom: 28 }}>
            Access historical rainfall and temperature insights, Crop Analytics across India. Discover climate risk
            exposure with high-resolution observational maps and analytics.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
              <span>Gridded IMD & ERA5 Reanalysis Datasets</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              <span>State, District & Block-level Observation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#334155' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
              <span>Synchronized Actual, Normal & Anomaly GIS Maps</span>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
            padding: '40px 36px',
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13, color: '#64748B' }}>
              Please enter your institutional credentials to log in.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email Field with Icon */}
            <div>
              <label
                htmlFor="login-email"
                style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                >
                  <Mail size={16} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                  className="ca-input"
                  style={{ paddingLeft: 38, borderRadius: 8, height: 42 }}
                />
              </div>
            </div>

            {/* Password Field with Icon and Eye toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label
                  htmlFor="login-password"
                  style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been dispatched to your institutional address.');
                  }}
                  style={{ fontSize: 12, color: '#2563EB', fontWeight: 500 }}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                >
                  <Lock size={16} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="ca-input"
                  style={{ paddingLeft: 38, paddingRight: 38, borderRadius: 8, height: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Login button matching ClimAnalytix */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="ca-btn ca-btn-primary"
              style={{
                width: '100%',
                height: 44,
                borderRadius: 8,
                background: '#1D4ED8',
                fontSize: 14,
                fontWeight: 600,
                marginTop: 6,
                gap: 8,
              }}
            >
              {isSubmitting ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Login to know your Climate Risk Exposure</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748B' }}>
            <span>Don't have an account? </span>
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                alert('Please contact your institutional enterprise administrator to request access.');
              }}
              style={{ color: '#2563EB', fontWeight: 600 }}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
