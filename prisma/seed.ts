import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FieldMind Database Seed...');

  // Clean existing tables
  await prisma.memoryItem.deleteMany();
  await prisma.maintenanceEvent.deleteMany();
  await prisma.replacementHistory.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.observation.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.part.deleteMany();
  await prisma.technician.deleteMany();

  // 1. Seed Technicians
  const techniciansData = [
    { name: 'Ravi Patel', role: 'Senior Vibration Specialist', experienceYears: 12 },
    { name: 'Sarah Jenkins', role: 'Lead Mechanical Engineer', experienceYears: 15 },
    { name: 'Marcus Vance', role: 'Maintenance Technician', experienceYears: 7 },
    { name: 'Elena Rostova', role: 'Reliability Engineer', experienceYears: 10 },
    { name: 'David Kim', role: 'Field Technician', experienceYears: 4 },
    { name: 'Carlos Mendez', role: 'Hydraulic Specialist', experienceYears: 9 },
  ];

  const technicians = [];
  for (const tech of techniciansData) {
    const created = await prisma.technician.create({ data: tech });
    technicians.push(created);
  }

  const primaryTech = technicians[0]; // Ravi Patel
  const secondaryTech = technicians[1]; // Sarah Jenkins

  // 2. Seed Parts
  const partsData = [
    { partNumber: 'SKF-6314-2RS', partName: 'Deep Groove Ball Bearing (Drive End)', manufacturer: 'SKF', category: 'BEARINGS' },
    { partNumber: 'NSK-7312-BEP', partName: 'Angular Contact Ball Bearing', manufacturer: 'NSK', category: 'BEARINGS' },
    { partNumber: 'CHEST-880-SEAL', partName: 'Single Mechanical Cartridge Seal', manufacturer: 'Chesterton', category: 'SEALS' },
    { partNumber: 'FLOW-IMP-220', partName: 'Bronze Closed Impeller (220mm)', manufacturer: 'AquaFlow', category: 'IMPELLERS' },
    { partNumber: 'SIEM-MOT-45KW', partName: '45kW 3-Phase Induction Motor', manufacturer: 'Siemens', category: 'MOTORS' },
    { partNumber: 'FLEX-COUP-110', partName: 'Flexible Elastomeric Coupling', manufacturer: 'Lovejoy', category: 'COUPLINGS' },
    { partNumber: 'VALV-CHECK-8IN', partName: '8-inch Swing Check Valve', manufacturer: 'Flowserve', category: 'VALVES' },
  ];

  const partsMap: Record<string, any> = {};
  for (const part of partsData) {
    const created = await prisma.part.create({ data: part });
    partsMap[part.partNumber] = created;
  }

  // 3. Seed Hero Machine PUMP-042
  console.log('⚡ Seeding Hero Machine PUMP-042...');
  const heroMachine = await prisma.machine.create({
    data: {
      assetTag: 'PUMP-042',
      name: 'Centrifugal Feed Water Pump PUMP-042',
      model: 'AquaFlow MX-200',
      manufacturer: 'AquaFlow Systems',
      location: 'Plant 2 / Production Line 4',
      installationDate: new Date('2022-03-15'),
      operatingHours: 8421,
      status: 'CRITICAL',
      lastMaintenanceDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      currentIssue: 'Severe drive-end vibration (7.6 mm/s) under 85% operating load',
      incidentCount: 3,
    },
  });

  // Hero Incident #1: High Vibration (180 days ago) - Temporary fix alignment
  const dateInc1 = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const inc1 = await prisma.incident.create({
    data: {
      machineId: heroMachine.id,
      incidentNumber: 'INC-2026-042-01',
      reportedAt: dateInc1,
      severity: 'MEDIUM',
      description: 'Elevated vibration detected during routine monitoring on Production Line 4.',
      symptoms: JSON.stringify(['high vibration', 'slight temperature rise']),
      measurements: JSON.stringify({ vibration: '5.2 mm/s', load: '75%', temperature: '68°C' }),
      initialDiagnosis: 'Suspected shaft misalignment after thermal expansion',
      status: 'RECURRED',
      resolvedAt: new Date(dateInc1.getTime() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  const interv1 = await prisma.intervention.create({
    data: {
      incidentId: inc1.id,
      machineId: heroMachine.id,
      technicianId: primaryTech.id,
      type: 'ALIGNMENT',
      description: 'Performed laser shaft alignment adjustment between motor and pump drive coupling.',
      partsUsed: JSON.stringify([]),
      startedAt: new Date(dateInc1.getTime() + 4 * 60 * 60 * 1000),
      completedAt: new Date(dateInc1.getTime() + 8 * 60 * 60 * 1000),
      result: 'TEMPORARY_IMPROVEMENT',
      notes: 'Initial post-alignment vibration dropped to 3.1 mm/s, but problem re-emerged within 4 days under full load.',
    },
  });

  await prisma.outcome.create({
    data: {
      incidentId: inc1.id,
      interventionId: interv1.id,
      machineId: heroMachine.id,
      resolved: false,
      resolutionNotes: 'Alignment adjustment yielded temporary relief (4 days). Root cause was drive-end bearing wear under high load.',
      finalDiagnosis: 'Drive-end bearing race spalling caused recurring misalignment under load',
      timeUntilRecurrence: 4,
    },
  });

  // Hero Incident #2: High Vibration + Abnormal Noise (150 days ago) - Bearing replacement (SUCCESSFUL)
  const dateInc2 = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000);
  const inc2 = await prisma.incident.create({
    data: {
      machineId: heroMachine.id,
      incidentNumber: 'INC-2026-042-02',
      reportedAt: dateInc2,
      severity: 'HIGH',
      description: 'High vibration returned with noticeable drive-end grinding noise under high load condition.',
      symptoms: JSON.stringify(['high vibration', 'abnormal noise', 'high-load condition']),
      measurements: JSON.stringify({ vibration: '7.4 mm/s', load: '85%', soundLevel: '92 dBA' }),
      initialDiagnosis: 'Drive-end bearing wear spalling under heavy radial load',
      status: 'RESOLVED',
      resolvedAt: new Date(dateInc2.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  const interv2 = await prisma.intervention.create({
    data: {
      incidentId: inc2.id,
      machineId: heroMachine.id,
      technicianId: primaryTech.id,
      type: 'BEARING_REPLACEMENT',
      description: 'Replaced drive-end bearing with SKF-6314-2RS, repacked high-temp synthetic grease, verified precision alignment.',
      partsUsed: JSON.stringify(['SKF-6314-2RS']),
      startedAt: new Date(dateInc2.getTime() + 6 * 60 * 60 * 1000),
      completedAt: new Date(dateInc2.getTime() + 14 * 60 * 60 * 1000),
      result: 'SUCCESSFUL',
      notes: 'Vibration dropped drastically from 7.4 mm/s to 2.1 mm/s. Operation smooth and quiet.',
    },
  });

  await prisma.outcome.create({
    data: {
      incidentId: inc2.id,
      interventionId: interv2.id,
      machineId: heroMachine.id,
      resolved: true,
      resolutionNotes: 'Drive-end bearing replacement completely resolved vibration for 146 days of continuous operation.',
      finalDiagnosis: 'Drive-end bearing inner race spalling resolved by replacement with SKF-6314-2RS',
      replacedComponent: 'SKF-6314-2RS Deep Groove Ball Bearing',
      timeUntilRecurrence: 146,
    },
  });

  await prisma.replacementHistory.create({
    data: {
      machineId: heroMachine.id,
      incidentId: inc2.id,
      partId: partsMap['SKF-6314-2RS'].id,
      replacementDate: dateInc2,
      technicianId: primaryTech.id,
      outcome: 'SUCCESSFUL',
    },
  });

  // Hero Incident #3 (Active Current Incident): 4 days ago - High vibration under high load
  const dateInc3 = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
  const inc3 = await prisma.incident.create({
    data: {
      machineId: heroMachine.id,
      incidentNumber: 'INC-2026-042-03',
      reportedAt: dateInc3,
      severity: 'HIGH',
      description: 'High vibration detected under 85% operating load during peak production run.',
      symptoms: JSON.stringify(['high vibration', 'abnormal noise', 'high-load condition']),
      measurements: JSON.stringify({ vibration: '7.6 mm/s', load: '85%', temperature: '74°C' }),
      initialDiagnosis: 'Unconfirmed drive-end vibration under heavy load',
      status: 'OPEN',
    },
  });

  await prisma.observation.create({
    data: {
      incidentId: inc3.id,
      machineId: heroMachine.id,
      technicianId: secondaryTech.id,
      observation: 'Vibration escalates significantly when load rises above 80%. Drive end casing feels unusually hot.',
      measurement: 7.6,
      unit: 'mm/s',
      context: '85% Operating Load',
    },
  });

  // Seed Timeline Events for PUMP-042
  await prisma.maintenanceEvent.createMany({
    data: [
      { machineId: heroMachine.id, eventType: 'INSTALLATION', description: 'Commissioning of AquaFlow MX-200 pump on Production Line 4', date: new Date('2022-03-15') },
      { machineId: heroMachine.id, eventType: 'ROUTINE_INSPECTION', description: '6-month preventive maintenance and vibration baseline check', date: new Date('2022-09-15') },
      { machineId: heroMachine.id, eventType: 'INCIDENT', description: 'Incident #INC-2026-042-01: Elevated vibration detected', date: dateInc1, incidentId: inc1.id, technicianId: primaryTech.id },
      { machineId: heroMachine.id, eventType: 'INTERVENTION', description: 'Alignment adjustment performed (Temporary 4-day improvement)', date: dateInc1, incidentId: inc1.id, technicianId: primaryTech.id },
      { machineId: heroMachine.id, eventType: 'INCIDENT', description: 'Incident #INC-2026-042-02: High vibration and drive-end noise returned', date: dateInc2, incidentId: inc2.id, technicianId: primaryTech.id },
      { machineId: heroMachine.id, eventType: 'INTERVENTION', description: 'Drive-end bearing replacement with SKF-6314-2RS (Resolved for 146 days)', date: dateInc2, incidentId: inc2.id, technicianId: primaryTech.id },
      { machineId: heroMachine.id, eventType: 'INCIDENT', description: 'Current Incident #INC-2026-042-03: High vibration under 85% load', date: dateInc3, incidentId: inc3.id, technicianId: secondaryTech.id },
    ],
  });

  // Seed Hindsight Memory Items for PUMP-042
  await prisma.memoryItem.createMany({
    data: [
      {
        hindsightId: 'mem-p042-01',
        machineId: heroMachine.id,
        incidentId: inc1.id,
        category: 'INTERVENTION_OUTCOME',
        content: 'PUMP-042 experienced high vibration (5.2 mm/s). Technician Ravi performed shaft alignment adjustment, which yielded only TEMPORARY IMPROVEMENT. The vibration returned after 4 days under full load.',
        outcomeType: 'TEMPORARY_IMPROVEMENT',
        source: 'Incident #INC-2026-042-01',
      },
      {
        hindsightId: 'mem-p042-02',
        machineId: heroMachine.id,
        incidentId: inc2.id,
        category: 'INTERVENTION_OUTCOME',
        content: 'PUMP-042 experienced severe high-load vibration (7.4 mm/s) and grinding noise. Replaced drive-end bearing with SKF-6314-2RS. Vibration reduced to 2.1 mm/s. SUCCESSFUL resolution with no recurrence for 146 days.',
        outcomeType: 'SUCCESSFUL',
        source: 'Incident #INC-2026-042-02',
      },
      {
        hindsightId: 'mem-p042-03',
        machineId: heroMachine.id,
        incidentId: inc2.id,
        category: 'HISTORICAL_PATTERN',
        content: 'PUMP-042 vibration issues are strongly coupled with >80% operating load. Alignment alone is insufficient; drive-end bearing wear is the established historical failure mode for high-load vibration.',
        outcomeType: 'SUCCESSFUL',
        source: 'Aggregated Maintenance Experience',
      },
    ],
  });

  // 4. Seed 49 Other Machines + Incidents + Interventions + Memory Items
  console.log('🏭 Seeding 49 additional industrial pumps and relational records...');
  const pumpModels = ['AquaFlow MX-200', 'HydroMax 500', 'FlowMaster X', 'TitanPump 3000', 'CentriMax C4'];
  const locations = ['Plant 1 / Line 1', 'Plant 1 / Line 2', 'Plant 2 / Line 1', 'Plant 2 / Line 3', 'Plant 3 / Line 1', 'Plant 3 / Line 2'];
  const statuses = ['OPERATIONAL', 'OPERATIONAL', 'OPERATIONAL', 'WARNING', 'MAINTENANCE'];

  for (let i = 1; i <= 49; i++) {
    if (i === 42) continue; // PUMP-042 is already created as the hero machine
    const pad = i.toString().padStart(3, '0');
    const assetTag = `PUMP-${pad}`;
    const model = pumpModels[i % pumpModels.length];
    const location = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    const hours = 2000 + (i * 147) % 15000;

    const m = await prisma.machine.create({
      data: {
        assetTag,
        name: `Industrial Pump ${assetTag}`,
        model,
        manufacturer: model.split(' ')[0] + ' Corp',
        location,
        installationDate: new Date(Date.now() - (300 + i * 20) * 24 * 60 * 60 * 1000),
        operatingHours: hours,
        status,
        lastMaintenanceDate: new Date(Date.now() - (i * 3) * 24 * 60 * 60 * 1000),
        currentIssue: status === 'WARNING' ? 'Minor mechanical seal weeping' : status === 'MAINTENANCE' ? 'Routine overhaul' : null,
        incidentCount: (i % 4) + 1,
      },
    });

    // Seed 1-2 incidents for each machine
    const incDate = new Date(Date.now() - (40 + i * 2) * 24 * 60 * 60 * 1000);
    const inc = await prisma.incident.create({
      data: {
        machineId: m.id,
        incidentNumber: `INC-2026-${pad}-01`,
        reportedAt: incDate,
        severity: i % 2 === 0 ? 'MEDIUM' : 'LOW',
        description: `Routine maintenance incident recorded for ${assetTag}.`,
        symptoms: JSON.stringify(['leakage', 'low pressure']),
        measurements: JSON.stringify({ pressure: '3.2 bar', temp: '55°C' }),
        initialDiagnosis: 'Mechanical seal flush line blockage',
        status: 'RESOLVED',
        resolvedAt: new Date(incDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
    });

    const interv = await prisma.intervention.create({
      data: {
        incidentId: inc.id,
        machineId: m.id,
        technicianId: technicians[i % technicians.length].id,
        type: 'SEAL_REPLACEMENT',
        description: 'Replaced mechanical seal and flushed seal chamber.',
        partsUsed: JSON.stringify(['CHEST-880-SEAL']),
        startedAt: incDate,
        completedAt: new Date(incDate.getTime() + 4 * 60 * 60 * 1000),
        result: 'SUCCESSFUL',
        notes: 'Replaced seal. Pressure restored to baseline.',
      },
    });

    await prisma.outcome.create({
      data: {
        incidentId: inc.id,
        interventionId: interv.id,
        machineId: m.id,
        resolved: true,
        resolutionNotes: 'Seal replacement successful. Operational stability confirmed.',
        finalDiagnosis: 'Mechanical seal face degradation',
        replacedComponent: 'CHEST-880-SEAL Mechanical Seal',
        timeUntilRecurrence: 220,
      },
    });

    await prisma.memoryItem.create({
      data: {
        hindsightId: `mem-${pad}-01`,
        machineId: m.id,
        incidentId: inc.id,
        category: 'INTERVENTION_OUTCOME',
        content: `${assetTag} experienced seal weeping and low pressure. Replaced mechanical seal with CHEST-880-SEAL. SUCCESSFUL outcome with pressure restored.`,
        outcomeType: 'SUCCESSFUL',
        source: `Incident #INC-2026-${pad}-01`,
      },
    });
  }

  console.log('✅ Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
