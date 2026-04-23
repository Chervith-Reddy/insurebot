import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import claimRoutes from './routes/claimRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req: Request, _res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'InsureBot API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║        InsureBot API Server              ║
║  Running on http://localhost:${PORT}        ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(25)}║
╚══════════════════════════════════════════╝
    `);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
