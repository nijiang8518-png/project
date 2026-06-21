import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const trainingRouter = Router();
trainingRouter.use(requireAuth);

const schema = z.object({
  horseId: z.string(),
  date: z.string().datetime(),
  discipline: z.string().optional(),
  durationMin: z.number().int().optional(),
  intensity: z.string().optional(),
  riderName: z.string().optional(),
  notes: z.string().optional(),
});

trainingRouter.get('/', async (req, res, next) => {
  try {
    const { horseId } = req.query as { horseId?: string };
    const logs = await prisma.trainingLog.findMany({
      where: horseId ? { horseId } : {},
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch (e) { next(e); }
});

trainingRouter.post('/', async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const log = await prisma.trainingLog.create({
      data: { ...data, date: new Date(data.date) },
    });
    res.status(201).json(log);
  } catch (e) { next(e); }
});
