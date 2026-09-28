import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Crop Dashboard Phase 2 Specification Compliance', () => {
  const topbarPath = path.resolve(__dirname, '../../../components/layout/Topbar.tsx');
  const dashboardPath = path.resolve(__dirname, '../../dashboard/DashboardPage.tsx');
  const cropPagePath = path.resolve(__dirname, '../CropDashboardPage.tsx');

  const topbarContent = fs.readFileSync(topbarPath, 'utf-8');
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
  const cropPageContent = fs.readFileSync(cropPagePath, 'utf-8');

  it('labels Crop Dashboard with PHASE 2 badge in Topbar', () => {
    expect(topbarContent).toContain('PHASE 2');
    expect(topbarContent).toContain('/crop-dashboard');
  });

  it('labels Crop Analytics with PHASE 2 PREVIEW badge in Dashboard', () => {
    expect(dashboardContent).toContain('PHASE 2 PREVIEW');
    expect(dashboardContent).toContain('Explore Crop Analytics (Phase 2)');
  });

  it('includes mandatory Phase 2 disclaimer banner in CropDashboardPage', () => {
    expect(cropPageContent).toContain('PHASE 2 PREVIEW');
    expect(cropPageContent).toContain('Crop intelligence capabilities are planned for a subsequent release and are not part of the current MVP');
    expect(cropPageContent).toContain('Non-Contractual MVP Scope');
  });
});
