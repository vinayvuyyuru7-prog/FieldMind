import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analyticsService';
import { MachineService } from '@/services/machineService';

export async function GET() {
  try {
    const analytics = await AnalyticsService.getAnalyticsOverview();
    const stats = await MachineService.getDashboardStats();
    return NextResponse.json({ ...analytics, stats });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}
