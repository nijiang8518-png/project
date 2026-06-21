import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/auth.routes';
import { horsesRouter } from './modules/horses/horses.routes';
import { healthRouter } from './modules/health/health.routes';
import { farrierRouter } from './modules/farrier/farrier.routes';
import { trainingRouter } from './modules/training/training.routes';
import { competitionsRouter } from './modules/competitions/competitions.routes';
import { remindersRouter } from './modules/reminders/reminders.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'equine-api' }));

app.use('/api/auth', authRouter);
app.use('/api/horses', horsesRouter);
app.use('/api/health-records', healthRouter);
app.use('/api/farrier', farrierRouter);
app.use('/api/training', trainingRouter);
app.use('/api/competitions', competitionsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/dashboard', dashboardRouter);

try {
  const openapi = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));
} catch {
  // openapi file optional in dev
}

app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`🐎 Equine API listening on http://localhost:${PORT}`);
});
