import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAuth } from '../../middleware/auth';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

dashboardRouter.get('/summary', async (_req, res, next) => {
  try {
    const [totalHorses, active, resting, retired, sold, pendingReminders] = await Promise.all([
      prisma.horse.count(),
      prisma.horse.count({ where: { status: 'ACTIVE' } }),
      prisma.horse.count({ where: { status: 'RESTING' } }),
      prisma.horse.count({ where: { status: 'RETIRED' } }),
      prisma.horse.count({ where: { status: 'SOLD' } }),
      prisma.reminder.count({ where: { status: 'PENDING' } }),
    ]);

    const upcoming = await prisma.reminder.findMany({
      where: { status: 'PENDING', dueAt: { lte: new Date(Date.now() + 30 * 24 * 3600 * 1000) } },
      include: { horse: { select: { id: true, name: true } } },
      orderBy: { dueAt: 'asc' },
      take: 10,
    });

    res.json({
      totals: { totalHorses, active, resting, retired, sold, pendingReminders },
      upcoming,
    });
  } catch (e) { next(e); }
});
