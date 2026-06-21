import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const competitionsRouter = Router();
competitionsRouter.use(requireAuth);

const compSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  level: z.string().optional(),
  registrationDue: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const resultSchema = z.object({
  competitionId: z.string(),
  horseId: z.string(),
  riderName: z.string().optional(),
  event: z.string().optional(),
  placement: z.number().int().optional(),
  score: z.number().optional(),
  prizeAmount: z.number().optional(),
  notes: z.string().optional(),
});

competitionsRouter.get('/', async (_req, res, next) => {
  try {
    const comps = await prisma.competition.findMany({
      orderBy: { startDate: 'desc' },
      include: { results: { include: { horse: { select: { id: true, name: true } } } } },
    });
    res.json(comps);
  } catch (e) { next(e); }
});

competitionsRouter.post('/', async (req, res, next) => {
  try {
    const data = compSchema.parse(req.body);
    const comp = await prisma.competition.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        registrationDue: data.registrationDue ? new Date(data.registrationDue) : undefined,
      },
    });
    res.status(201).json(comp);
  } catch (e) { next(e); }
});

competitionsRouter.post('/results', async (req, res, next) => {
  try {
    const data = resultSchema.parse(req.body);
    const result = await prisma.competitionResult.create({ data });
    res.status(201).json(result);
  } catch (e) { next(e); }
});
