import { ErrorCode } from '@po/shared/enums';

import {
  BackendTestContext,
  clearDatabase,
  setupTestEnvironment,
  teardownTestEnvironment,
} from './test-helpers';

import request = require('supertest');

describe('Auth E2E', () => {
  let context: BackendTestContext;

  beforeAll(async () => {
    context = await setupTestEnvironment();
  });

  afterAll(async () => {
    await teardownTestEnvironment(context);
  });

  beforeEach(async () => {
    await clearDatabase(context.dataSource);
  });

  test.todo('Rate Limiting');

  describe('POST /api/v1/auth/register', () => {
    const validPayload = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    test('should register a new user with valid credentials', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send(validPayload)
        .expect(201);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          id: expect.any(String),
          email: validPayload.email,
        },
      });
    });

    test('should reject registration with missing email', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ password: validPayload.password })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.MissingEmail);
    });

    test('should reject registration with invalid email format', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: 'invalid-email', password: validPayload.password })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.InvalidEmail);
    });

    test('should reject registration with missing password', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.MissingPassword);
    });

    test('should reject registration with weak password (too short)', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email, password: 'Short1!' })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.WeakPassword);
    });

    test('should reject registration with password missing uppercase', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email, password: 'test123!@#' })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.WeakPassword);
    });

    test('should reject registration with password missing lowercase', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email, password: 'TEST123!@#' })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.WeakPassword);
    });

    test('should reject registration with password missing number', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email, password: 'TestTest!@#' })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.WeakPassword);
    });

    test('should reject registration with password missing special character', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email, password: 'TestTest123' })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.WeakPassword);
    });

    test('should reject duplicate email registration', async () => {
      await request(context.app)
        .post('/api/v1/auth/register')
        .send(validPayload)
        .expect(201);

      const response = await request(context.app)
        .post('/api/v1/auth/register')
        .send({ email: validPayload.email, password: 'Different123!@#' })
        .expect(409);

      expect(response.body.errorCode).toBe(ErrorCode.UserExists);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    beforeEach(async () => {
      await request(context.app)
        .post('/api/v1/auth/register')
        .send(credentials);
    });

    test('should login with valid credentials', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: {
          id: expect.any(String),
          email: credentials.email,
        },
      });
    });

    test('should reject login with missing email', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/login')
        .send({ password: credentials.password })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.MissingEmail);
    });

    test('should reject login with invalid email format', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/login')
        .send({ email: 'invalid-email', password: credentials.password })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.InvalidEmail);
    });

    test('should reject login with missing password', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/login')
        .send({ email: credentials.email })
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.MissingPassword);
    });

    test('should reject login with incorrect password', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/login')
        .send({ email: credentials.email, password: 'WrongPassword123!@#' })
        .expect(401);

      expect(response.body.errorCode).toBe(ErrorCode.InvalidCredentials);
    });

    test('should reject login with non-existent email', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'Test123!@#' })
        .expect(401);

      expect(response.body.errorCode).toBe(ErrorCode.InvalidCredentials);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    let validRefreshToken: string;

    beforeEach(async () => {
      const registerResponse = await request(context.app)
        .post('/api/v1/auth/register')
        .send(credentials);

      validRefreshToken = registerResponse.body.refreshToken;
    });

    test('should refresh tokens with valid refresh token', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: validRefreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    test('should reject refresh with missing token', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.errorCode).toBe(ErrorCode.MissingToken);
    });

    test('should reject refresh with invalid token format', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token-format' })
        .expect(401);

      expect(response.body.errorCode).toBe(ErrorCode.InvalidToken);
    });

    test('should reject refresh with malformed JWT', async () => {
      const response = await request(context.app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'not.a.valid.jwt' })
        .expect(401);

      expect(response.body.errorCode).toBe(ErrorCode.InvalidToken);
    });

    test('should return new tokens that are different from old ones', async () => {
      const firstResponse = await request(context.app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: validRefreshToken })
        .expect(200);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const secondResponse = await request(context.app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: firstResponse.body.refreshToken })
        .expect(200);

      expect(secondResponse.body.accessToken).not.toBe(
        firstResponse.body.accessToken,
      );
      expect(secondResponse.body.refreshToken).not.toBe(
        firstResponse.body.refreshToken,
      );
    });
  });
});
