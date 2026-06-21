import { PrismaClient, Role, Sex, HorseStatus, ReminderType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@equine.local' },
    update: {},
    create: {
      email: 'admin@equine.local',
      name: 'Administrator',
      role: Role.ADMIN,
      passwordHash: adminPass,
    },
  });

  const owner = await prisma.owner.upsert({
    where: { id: 'seed-owner-1' },
    update: {},
    create: {
      id: 'seed-owner-1',
      name: 'Jane Rider',
      email: 'jane@example.com',
      phone: '+1-555-0100',
    },
  });

  const horse = await prisma.horse.upsert({
    where: { id: 'seed-horse-1' },
    update: {},
    create: {
      id: 'seed-horse-1',
      name: 'Thunder',
      chipId: 'CHIP-0001',
      dateOfBirth: new Date('2017-04-12'),
      sex: Sex.GELDING,
      breed: 'Warmblood',
      color: 'Bay',
      heightCm: 168,
      weightKg: 540,
      sireName: 'Stormrider',
      damName: 'Lightning Lady',
      stableLocation: 'Barn A — Stall 3',
      status: HorseStatus.ACTIVE,
      ownerId: owner.id,
      managerId: admin.id,
    },
  });

  await prisma.vaccination.create({
    data: {
      horseId: horse.id,
      vaccineName: 'Tetanus',
      givenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300),
      nextDueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      vetName: 'Dr. Smith',
    },
  });

  await prisma.farrierRecord.create({
    data: {
      horseId: horse.id,
      farrierName: 'Mike Hoof',
      visitDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
      serviceType: 'trim',
      cost: 80,
      nextDueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
    },
  });

  await prisma.reminder.create({
    data: {
      horseId: horse.id,
      type: ReminderType.VACCINATION,
      title: 'Tetanus booster due',
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  console.log('Seed complete. Login: admin@equine.local / admin123');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
