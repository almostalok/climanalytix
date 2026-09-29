import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Crop Dashboard Integration Compliance', () => {
  const topbarPath = path.resolve(__dirname, '../../../components/layout/Topbar.tsx');
  const dashboardPath = path.resolve(__dirname, '../../dashboard/DashboardPage.tsx');
  const cropPagePath = path.resolve(__dirname, '../CropDashboardPage.tsx');

  const topbarContent = fs.readFileSync(topbarPath, 'utf-8');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
  const cropPageContent = fs.readFileSync(cropPagePath, 'utf-8');

  it('renders Crop Dashboard link in Topbar without Phase 2 badge', () => {
    expect(topbarContent).not.toContain('PHASE 2');
    expect(topbarContent).toContain('/crop-dashboard');
  });

  it('renders Crop Analytics card in Dashboard without Phase 2 / MVP preview labels', () => {
    expect(dashboardContent).not.toContain('PHASE 2 PREVIEW');
    expect(dashboardContent).toContain('Explore Crop Analytics');
  });

  it('renders CropDashboardPage without Phase 2 / MVP disclaimer banner', () => {
    expect(cropPageContent).not.toContain('PHASE 2 PREVIEW');
    expect(cropPageContent).not.toContain('Non-Contractual MVP Scope');
    expect(cropPageContent).not.toContain('Crop intelligence capabilities are planned for a subsequent release');
  });
});
