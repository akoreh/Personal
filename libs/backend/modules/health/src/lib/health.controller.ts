import { Request, Response } from 'express';

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };

      res.json(health);
    } catch (error) {
      console.error(error);

      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      });
    }
  }
}
