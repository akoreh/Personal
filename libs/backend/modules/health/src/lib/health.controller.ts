import { AppDataSource } from '@po/backend/core';
import { Request, Response } from 'express';

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      const isDatabaseConnected =
        AppDataSource.isInitialized && (await this.checkDatabaseConnection());

      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: isDatabaseConnected ? 'connected' : 'disconnected',
      };

      res.json(health);
    } catch (error) {
      console.error(error);

      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: 'Health check failed',
      });
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await AppDataSource.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
