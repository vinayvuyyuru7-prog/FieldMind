import { NextResponse } from 'next/server';
import { MachineService } from '@/services/machineService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const machine = await MachineService.getMachineById(params.id);
    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }
    return NextResponse.json(machine);
  } catch (error: any) {
    console.error('Error fetching machine detail:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch machine detail' }, { status: 500 });
  }
}
