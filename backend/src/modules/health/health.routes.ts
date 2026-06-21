import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const healthRouter = Router();
healthRouter.use(requireAuth);

const vetSchema = z.object({
  horseId: z.string(),
  visitDate: z.string().datetime(),
  vetName: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  medication: z.string().optional(),
  cost: z.number().optional(),
  notes: z.string().optional(),
});

healthRouter.get('/vet', async (req, res, next) => {
  try {
    const { horseId } = req.query as { horseId?: string };
    const records = await prisma.veterinaryRecord.findMany({
      where: horseId ? { horseId } : {},
      orderBy: { visitDate: 'desc' },
    });
    res.json(records);
  } catch (e) { next(e); }
});

healthRouter.post('/vet', async (req, res, next) => {
  try {
    const data = vetSchema.parse(req.body);
    const rec = await prisma.veterinaryRecord.create({
      data: { ...data, visitDate: new Date(data.visitDate) },
    });
    res.status(201).json(rec);
  } catch (e) { next(e); }
});

const vaccSchema = z.object({
  horseId: z.string(),
  vaccineName: z.string(),
  givenAt: z.string().datetime(),
  nextDueAt: z.string().datetime().optional(),
  vetName: z.string().optional(),
  cost: z.number().optional(),
  notes: z.string().optional(),
});

healthRouter.get('/vaccinations', async (req, res, next) => {
  try {
    const { horseId } = req.query as { horseId?: string };
    const records = await prisma.vaccination.findMany({
      where: horseId ? { horseId } : {},
      orderBy: { givenAt: 'desc' },
    });
    res.json(records);
  } catch (e) { next(e); }
});

healthRouter.post('/vaccinations', async (req, res, next) => {
  try {
    const data = vaccSchema.parse(req.body);
    const rec = await prisma.vaccination.create({
      data: {
        ...data,
        givenAt: new Date(data.givenAt),
        nextDueAt: data.nextDueAt ? new Date(data.nextDueAt) : undefined,
      },
    });
    if (data.nextDueAt) {
      await prisma.reminder.create({
        data: {
          horseId: data.horseId,
          type: 'VACCINATION',
          title: `Vaccination due: ${data.vaccineName}`,
          dueAt: new Date(data.nextDueAt),
        },
      });
    }
    res.status(201).json(rec);
  } catch (e) { next(e); }
});

const dewormSchema = z.object({
  horseId: z.string(),
  product: z.string(),
  dose: z.string().optional(),
  givenAt: z.string().datetime(),
  nextDueAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

healthRouter.get('/deworming', async (req, res, next) => {
  try {
    const { horseId } = req.query as { horseId?: string };
    const records = await prisma.dewormingRecord.findMany({
      where: horseId ? { horseId } : {},
      orderBy: { givenAt: 'desc' },
    });
    res.json(records);
  } catch (e) { next(e); }
});

healthRouter.post('/deworming', async (req, res, next) => {
  try {
    const data = dewormSchema.parse(req.body);
    const rec = await prisma.dewormingRecord.create({
      data: {
        ...data,
        givenAt: new Date(data.givenAt),
        nextDueAt: data.nextDueAt ? new Date(data.nextDueAt) : undefined,
      },
    });
    res.status(201).json(rec);
  } catch (e) { next(e); }
});
