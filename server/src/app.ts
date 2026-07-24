import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import meetingRouter from './routes/meeting.routes.js';
import recordingRouter from './routes/recording.routes.js';
import transcriptRouter from './routes/transcript.routes.js';
import summaryRouter from './routes/summary.routes.js';
import searchRouter from './routes/search.routes.js';
import vaultRouter from './routes/vault.routes.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded recording files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/meetings', meetingRouter);
app.use('/api/v1/recordings', recordingRouter);
app.use('/api/v1/transcripts', transcriptRouter);
app.use('/api/v1/summaries', summaryRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/vault', vaultRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'NexaMeet API Backend',
    version: '0.1.0',
    status: 'online',
    healthCheck: '/api/v1/health',
    authAPI: '/api/v1/auth',
    meetingsAPI: '/api/v1/meetings',
    recordingsAPI: '/api/v1/recordings',
    transcriptsAPI: '/api/v1/transcripts',
    summariesAPI: '/api/v1/summaries',
    searchAPI: '/api/v1/search',
    vaultAPI: '/api/v1/vault/status'
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
