import { NextResponse } from 'next/server';
import { MachineService } from '@/services/machineService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const location = searchParams.get('location') || undefined;

    const machines = await MachineService.getAllMachines({ search, status, location });
    return NextResponse.json(machines);
  } catch (error: any) {
    console.error('Error fetching machines:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch machines' }, { status: 500 });
  }
}
