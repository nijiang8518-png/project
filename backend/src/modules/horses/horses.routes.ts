import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const horsesRouter = Router();
horsesRouter.use(requireAuth);

const horseSchema = z.object({
  name: z.string().min(1),
  chipId: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  sex: z.enum(['STALLION', 'MARE', 'GELDING']).optional(),
  breed: z.string().optional(),
  color: z.string().optional(),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  sireName: z.string().optional(),
  damName: z.string().optional(),
  stableLocation: z.string().optional(),
  status: z.enum(['ACTIVE', 'RESTING', 'RETIRED', 'SOLD']).optional(),
  ownerId: z.string().optional(),
  photoUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

horsesRouter.get('/', async (_req, res, next) => {
  try {
    const horses = await prisma.horse.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(horses);
  } catch (e) { next(e); }
});

horsesRouter.get('/:id', async (req, res, next) => {
  try {
    const horse = await prisma.horse.findUnique({
      where: { id: req.params.id },
      include: {
        owner: true,
        vaccinations: { orderBy: { givenAt: 'desc' } },
        dewormings: { orderBy: { givenAt: 'desc' } },
        farrierRecords: { orderBy: { visitDate: 'desc' } },
        vetRecords: { orderBy: { visitDate: 'desc' } },
        trainingLogs: { orderBy: { date: 'desc' }, take: 20 },
        reminders: { where: { status: 'PENDING' }, orderBy: { dueAt: 'asc' } },
      },
    });
    if (!horse) return res.status(404).json({ error: 'Not found' });
    res.json(horse);
  } catch (e) { next(e); }
});

horsesRouter.post('/', async (req, res, next) => {
  try {
    const data = horseSchema.parse(req.body);
    const horse = await prisma.horse.create({
      data: { ...data, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined },
    });
    res.status(201).json(horse);
  } catch (e) { next(e); }
});

horsesRouter.put('/:id', async (req, res, next) => {
  try {
    const data = horseSchema.partial().parse(req.body);
    const horse = await prisma.horse.update({
      where: { id: req.params.id },
      data: { ...data, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined },
    });
    res.json(horse);
  } catch (e) { next(e); }
});

horsesRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.horse.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) { next(e); }
});
