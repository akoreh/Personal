import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

/**
 * Input sanitization middleware to prevent common security vulnerabilities
 */
export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Recursively sanitize object properties
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove potentially dangerous characters and scripts
      return validator.escape(obj.trim());
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * Middleware to validate request size and prevent DoS attacks
 */
export const validateRequestSize = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    res.status(413).json({
      errorCode: 'PayloadTooLarge',
      errorMessage: 'Request payload too large',
    });
    return;
  }

  next();
};

/**
 * Middleware to prevent common injection attacks
 */
export const preventInjection = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const checkForInjection = (str: string): boolean => {
    const sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|#|\/\*|\*\/)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    ];

    const nosqlInjectionPatterns = [
      /\$where/gi,
      /\$regex/gi,
      /\$ne/gi,
      /\$in/gi,
      /\$nin/gi,
      /\$exists/gi,
    ];

    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    return [
      ...sqlInjectionPatterns,
      ...nosqlInjectionPatterns,
      ...xssPatterns,
    ].some((pattern) => pattern.test(str));
  };

  const validateObject = (obj: any): boolean => {
    if (typeof obj === 'string') {
      return checkForInjection(obj);
    } else if (Array.isArray(obj)) {
      return obj.some(validateObject);
    } else if (obj && typeof obj === 'object') {
      return Object.values(obj).some(validateObject);
    }
    return false;
  };

  // Check request body for injection attempts
  if (req.body && validateObject(req.body)) {
    res.status(400).json({
      errorCode: 'SuspiciousInput',
      errorMessage: 'Request contains potentially malicious content',
    });
    return;
  }

  // Check query parameters for injection attempts
  if (req.query && validateObject(req.query)) {
    res.status(400).json({
      errorCode: 'SuspiciousInput',
      errorMessage: 'Query contains potentially malicious content',
    });
    return;
  }

  next();
};

/**
 * Middleware to log security events
 */
export const securityLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const userAgent = req.get('User-Agent') || 'unknown';
  const ip = req.ip || req.connection.remoteAddress;

  // Log suspicious patterns
  const suspiciousPatterns = [
    /bot|crawl|spider|scraper/gi,
    /hack|exploit|attack/gi,
    /sql|injection|xss/gi,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
    console.warn(`⚠️  Suspicious request detected:`, {
      ip,
      userAgent,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Log failed auth attempts
  res.on('finish', () => {
    if (req.path.includes('/auth/') && res.statusCode >= 400) {
      console.warn(`🚨 Failed auth attempt:`, {
        ip,
        path: req.path,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
      });
    }
  });

  next();
};
