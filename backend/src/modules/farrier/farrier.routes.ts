import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const farrierRouter = Router();
farrierRouter.use(requireAuth);

const schema = z.object({
  horseId: z.string(),
  farrierName: z.string().optional(),
  visitDate: z.string().datetime(),
  serviceType: z.string().optional(),
  cost: z.number().optional(),
  nextDueAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  cycleWeeks: z.number().int().min(1).max(20).optional(),
});

farrierRouter.get('/', async (req, res, next) => {
  try {
    const { horseId } = req.query as { horseId?: string };
    const records = await prisma.farrierRecord.findMany({
      where: horseId ? { horseId } : {},
      orderBy: { visitDate: 'desc' },
    });
    res.json(records);
  } catch (e) { next(e); }
});

farrierRouter.post('/', async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const visitDate = new Date(data.visitDate);
    const cycleWeeks = data.cycleWeeks ?? 7;
    const nextDueAt = data.nextDueAt
      ? new Date(data.nextDueAt)
      : new Date(visitDate.getTime() + cycleWeeks * 7 * 24 * 3600 * 1000);

    const rec = await prisma.farrierRecord.create({
      data: {
        horseId: data.horseId,
        farrierName: data.farrierName,
        visitDate,
        serviceType: data.serviceType,
        cost: data.cost,
        nextDueAt,
        notes: data.notes,
      },
    });

    await prisma.reminder.create({
      data: {
        horseId: data.horseId,
        type: 'FARRIER',
        title: 'Farrier visit due',
        dueAt: nextDueAt,
      },
    });

    res.status(201).json(rec);
  } catch (e) { next(e); }
});
