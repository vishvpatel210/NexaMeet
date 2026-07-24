import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'NexaMeet Express API Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};
