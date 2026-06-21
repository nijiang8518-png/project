import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'ValidationError', details: err.issues });
  }
  const e = err as { status?: number; message?: string };
  const status = e.status ?? 500;
  console.error('[error]', e);
  res.status(status).json({ error: e.message ?? 'Internal Server Error' });
}
