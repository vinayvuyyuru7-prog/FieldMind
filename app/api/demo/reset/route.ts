import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Execute database seed to restore baseline PUMP-042 hero machine state
    await execAsync('npx ts-node prisma/seed.ts', { cwd: process.cwd() });
    
    return NextResponse.json({
      message: 'Demo state successfully reset to hero baseline for PUMP-042.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error resetting demo:', error);
    return NextResponse.json({ error: error.message || 'Failed to reset demo state' }, { status: 500 });
  }
}
