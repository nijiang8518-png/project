import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const remindersRouter = Router();
remindersRouter.use(requireAuth);

const schema = z.object({
  horseId: z.string().optional(),
  type: z.enum(['VACCINATION', 'DEWORMING', 'FARRIER', 'VET_FOLLOWUP', 'COMPETITION', 'OTHER']),
  title: z.string(),
  dueAt: z.string().datetime(),
  notes: z.string().optional(),
});

remindersRouter.get('/', async (req, res, next) => {
  try {
    const { horseId, status } = req.query as { horseId?: string; status?: string };
    const reminders = await prisma.reminder.findMany({
      where: {
        ...(horseId ? { horseId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: { horse: { select: { id: true, name: true } } },
      orderBy: { dueAt: 'asc' },
    });
    res.json(reminders);
  } catch (e) { next(e); }
});

remindersRouter.get('/upcoming', async (_req, res, next) => {
  try {
    const horizon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const list = await prisma.reminder.findMany({
      where: { status: 'PENDING', dueAt: { lte: horizon } },
      include: { horse: { select: { id: true, name: true } } },
      orderBy: { dueAt: 'asc' },
    });
    res.json(list);
  } catch (e) { next(e); }
});

remindersRouter.post('/', async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const r = await prisma.reminder.create({ data: { ...data, dueAt: new Date(data.dueAt) } });
    res.status(201).json(r);
  } catch (e) { next(e); }
});

remindersRouter.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body as { status?: 'PENDING' | 'DONE' | 'SNOOZED' | 'CANCELLED' };
    const r = await prisma.reminder.update({ where: { id: req.params.id }, data: { status } });
    res.json(r);
  } catch (e) { next(e); }
});
