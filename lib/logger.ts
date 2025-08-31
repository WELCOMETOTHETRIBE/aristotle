import pino from 'pino';
import { env } from './config/env';

// Create the base logger
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
  base: { 
    service: "aristotle", 
    version: process.env.npm_package_version || '0.1.0',
    env: env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
});

// Request-scoped logger with request ID
export const createRequestLogger = (requestId?: string) => {
  return logger.child({ requestId: requestId || 'unknown' });
};

// Error logger with additional context
export const errorLogger = {
  log: (error: Error, context?: Record<string, any>) => {
    logger.error({
      err: error,
      message: error.message,
      stack: error.stack,
      ...context,
    });
  },
  
  // Log API errors with request context
  api: (error: Error, req: any, context?: Record<string, any>) => {
    logger.error({
      err: error,
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      ...context,
    });
  },
};

// Performance logger
export const perfLogger = {
  start: (operation: string, context?: Record<string, any>) => {
    const start = Date.now();
    return {
      end: (result?: any) => {
        const duration = Date.now() - start;
        logger.info({
          operation,
          duration,
          result,
          ...context,
        });
      },
    };
  },
};

// Database logger
export const dbLogger = {
  query: (query: string, params: any[], duration: number) => {
    logger.debug({
      type: 'db_query',
      query,
      params,
      duration,
    });
  },
  
  error: (error: Error, query?: string) => {
    logger.error({
      type: 'db_error',
      err: error,
      query,
    });
  },
};

export default logger; 