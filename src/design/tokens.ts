/**
 * Climate Analytics - Centralized Design Tokens
 * Institutional, scientific, data-first design system.
 */

export const tokens = {
  colors: {
    bg: {
      primary: '#F7F8FA',
      surface: '#FFFFFF',
      surfaceSubtle: '#F8F9FA',
      surfaceRaised: '#FFFFFF',
      hover: '#F1F5F9',
      active: '#E2E8F0',
      backdrop: 'rgba(15, 23, 42, 0.45)',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      muted: '#6B7280',
      light: '#9CA3AF',
      inverse: '#FFFFFF',
      accent: '#1E40AF',
    },
    border: {
      default: '#E4E7EC',
      subtle: '#EEF2F6',
      strong: '#D0D5DD',
      focus: '#2563EB',
    },
    brand: {
      primary: '#1E40AF', // Deep Scientific Blue
      primaryHover: '#1D4ED8',
      primaryActive: '#172554',
      primaryLight: '#EFF6FF',
      secondary: '#0F766E', // Institutional Teal
    },
    rainfall: {
      primary: '#0284C7',
      light: '#E0F2FE',
      border: '#BAE6FD',
      dark: '#0369A1',
      deep: '#0C4A6E',
      gradient: ['#F0F9FF', '#BAE6FD', '#38BDF8', '#0284C7', '#0369A1', '#082F49'],
    },
    temperature: {
      primary: '#EA580C',
      light: '#FFEDD5',
      border: '#FED7AA',
      dark: '#C2410C',
      hot: '#DC2626',
      extreme: '#991B1B',
      gradient: ['#FFFBEB', '#FDE68A', '#F97316', '#EA580C', '#DC2626', '#7F1D1D'],
    },
    anomaly: {
      positiveExtreme: '#DC2626', // Warm / heavy excess
      positiveModerate: '#F97316',
      positiveSlight: '#FBBF24',
      neutral: '#E5E7EB',
      negativeSlight: '#93C5FD',
      negativeModerate: '#3B82F6',
      negativeExtreme: '#1D4ED8', // Cool / deficit
    },
    status: {
      successBg: '#ECFDF5',
      successText: '#065F46',
      successBorder: '#A7F3D0',
      warningBg: '#FFFBEB',
      warningText: '#92400E',
      warningBorder: '#FDE68A',
      errorBg: '#FEF2F2',
      errorText: '#991B1B',
      errorBorder: '#FECACA',
      infoBg: '#EFF6FF',
      infoText: '#1E40AF',
      infoBorder: '#BFDBFE',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: {
      display: '32px',
      pageTitle: '26px',
      sectionTitle: '18px',
      subSection: '15px',
      body: '14px',
      table: '13px',
      metadata: '12px',
      caption: '11px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.6,
    },
  },
  spacing: {
    xxs: '2px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px',
  },
  radius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    subtle: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
    card: '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)',
    dropdown: '0 4px 6px -1px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
    modal: '0 20px 25px -5px rgba(16, 24, 40, 0.1), 0 8px 10px -6px rgba(16, 24, 40, 0.08)',
  },
  layout: {
    sidebarWidth: '250px',
    sidebarCollapsedWidth: '64px',
    headerHeight: '64px',
    contentMaxWidth: '1440px',
    contentPadding: '28px',
  },
  zIndex: {
    base: 1,
    header: 100,
    sidebar: 200,
    dropdown: 500,
    modalBackdrop: 900,
    modal: 1000,
    tooltip: 1100,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
} as const;

export type DesignTokens = typeof tokens;
