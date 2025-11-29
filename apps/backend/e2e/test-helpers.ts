import { AppDataSource } from '@po/backend/core';
import { config } from 'dotenv';
import { Application } from 'express';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

import { createApp } from '../src/main';

export interface BackendTestContext {
  app: Application;
  dataSource: DataSource;
}

async function setupTestDatabase(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }

  // Override AppDataSource options for testing
  Object.assign(AppDataSource.options, {
    host: process.env['PG_TEST_HOST'] || 'localhost',
    port: parseInt(process.env['PG_TEST_PORT'] || '5433', 10),
    username: process.env['PG_TEST_USER'] || 'postgres',
    password: process.env['PG_TEST_PASSWORD'] || 'postgres',
    database: process.env['PG_TEST_DATABASE'] || 'app_test',
    synchronize: true,
    dropSchema: true,
    logging: false,
  });

  await AppDataSource.initialize();

  return AppDataSource;
}

/**
 * Setup test environment before all tests
 * Uses the ACTUAL production app from main.ts with test database
 */
export async function setupTestEnvironment(): Promise<BackendTestContext> {
  // Load test environment variables FIRST
  const envPath = resolve(process.cwd(), '.env.test');
  config({ path: envPath });

  // Setup test database (overrides AppDataSource before app is created)
  const dataSource = await setupTestDatabase();

  // Use the ACTUAL production app
  const app = createApp();

  return { app, dataSource };
}

export async function teardownTestEnvironment(
  context: BackendTestContext,
): Promise<void> {
  if (context.dataSource?.isInitialized) {
    await context.dataSource.destroy();
  }
}

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  if (!dataSource?.isInitialized) {
    return;
  }

  const entities = dataSource.entityMetadatas;

  // Clear tables in reverse order to handle foreign key constraints
  for (const entity of entities.reverse()) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
}
