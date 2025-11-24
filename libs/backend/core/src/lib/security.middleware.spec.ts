import { NextFunction, Request, Response } from 'express';
import * as httpMocks from 'node-mocks-http';

import {
  preventInjection,
  sanitizeInput,
  securityLogger,
  validateRequestSize,
} from './security.middleware';

describe('Security Middleware', () => {
  let req: httpMocks.MockRequest<Request>;
  let res: httpMocks.MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('sanitizeInput', () => {
    test('should sanitize string values in request body', () => {
      req.body = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com  ',
      };

      sanitizeInput(req, res, next);

      expect(req.body.name).not.toContain('<script>');
      expect(req.body.email).toBe('test@example.com');
      expect(next).toHaveBeenCalled();
    });

    test('should sanitize nested objects', () => {
      req.body = {
        user: {
          name: '<b>Bold</b>',
          address: {
            street: '<i>Italic</i>',
          },
        },
      };

      sanitizeInput(req, res, next);

      expect(req.body.user.name).not.toContain('<b>');
      expect(req.body.user.address.street).not.toContain('<i>');
      expect(next).toHaveBeenCalled();
    });

    test('should sanitize arrays', () => {
      req.body = {
        tags: ['<script>alert(1)</script>', 'normal', '<img src=x>'],
      };

      sanitizeInput(req, res, next);

      expect(req.body.tags[0]).not.toContain('<script>');
      expect(req.body.tags[1]).toBe('normal');
      expect(req.body.tags[2]).not.toContain('<img');
      expect(next).toHaveBeenCalled();
    });

    test('should sanitize query parameters', () => {
      req.query = {
        search: '<script>evil</script>',
        page: '1',
      };

      sanitizeInput(req, res, next);

      expect(req.query['search']).not.toContain('<script>');
      expect(req.query['page']).toBe('1');
      expect(next).toHaveBeenCalled();
    });

    test('should handle empty body and query', () => {
      sanitizeInput(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should preserve non-string values', () => {
      req.body = {
        count: 42,
        active: true,
        data: null,
        items: undefined,
      };

      sanitizeInput(req, res, next);

      expect(req.body.count).toBe(42);
      expect(req.body.active).toBe(true);
      expect(req.body.data).toBe(null);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateRequestSize', () => {
    test('should allow requests within size limit', () => {
      req.headers['content-length'] = '1024';

      validateRequestSize(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.statusCode).not.toBe(413);
    });

    test('should reject requests exceeding size limit', () => {
      req.headers['content-length'] = '11000000'; // 11MB

      validateRequestSize(req, res, next);

      expect(res.statusCode).toBe(413);
      expect(res._getJSONData()).toEqual({
        errorCode: 'PayloadTooLarge',
        errorMessage: 'Request payload too large',
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle missing content-length header', () => {
      validateRequestSize(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.statusCode).not.toBe(413);
    });

    test('should handle invalid content-length header', () => {
      req.headers['content-length'] = 'invalid';

      validateRequestSize(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('preventInjection', () => {
    test('should block SQL injection in body', () => {
      req.body = {
        query: 'SELECT * FROM users WHERE id = 1 OR 1=1--',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        errorCode: 'SuspiciousInput',
        errorMessage: 'Request contains potentially malicious content',
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should block NoSQL injection patterns in body', () => {
      req.body = {
        filter: '$where: function() { return true; }',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should block XSS attempts in body', () => {
      req.body = {
        comment: '<script>alert("xss")</script>',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should block iframe injection', () => {
      req.body = {
        content: '<iframe src="evil.com"></iframe>',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should block javascript: protocol', () => {
      req.body = {
        link: 'javascript:alert(1)',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should block event handlers', () => {
      req.body = {
        html: '<div onclick="alert(1)">Click</div>',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should block injection in query parameters', () => {
      req.query = {
        search: 'test DROP TABLE users',
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().errorMessage).toContain('Query contains');
      expect(next).not.toHaveBeenCalled();
    });

    test('should block injection in nested objects', () => {
      req.body = {
        user: {
          profile: {
            bio: 'Normal text DELETE FROM accounts',
          },
        },
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should block injection in arrays', () => {
      req.body = {
        items: ['safe', 'SELECT * FROM passwords', 'also safe'],
      };

      preventInjection(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow safe input', () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a normal message',
      };

      preventInjection(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.statusCode).not.toBe(400);
    });

    test('should handle empty body and query', () => {
      preventInjection(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('securityLogger', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    test('should log suspicious user agents', () => {
      req.headers['user-agent'] = 'malicious bot crawler';
      (req as any).path = '/api/users';
      req.method = 'GET';

      securityLogger(req, res, next);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '⚠️  Suspicious request detected:',
        expect.objectContaining({
          userAgent: 'malicious bot crawler',
          path: '/api/users',
          method: 'GET',
        }),
      );
      expect(next).toHaveBeenCalled();
    });

    test('should call next without errors', () => {
      securityLogger(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should not log normal user agents', () => {
      req.headers['user-agent'] = 'Mozilla/5.0 (normal browser)';

      securityLogger(req, res, next);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('should handle missing user agent', () => {
      securityLogger(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should detect scraper patterns', () => {
      req.headers['user-agent'] = 'web scraper tool';

      securityLogger(req, res, next);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    test('should detect hack/exploit patterns', () => {
      req.headers['user-agent'] = 'exploit scanner';

      securityLogger(req, res, next);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
