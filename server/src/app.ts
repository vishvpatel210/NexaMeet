import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/health', healthRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'NexaMeet API Backend',
    version: '0.1.0',
    status: 'online',
    healthCheck: '/api/v1/health'
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
