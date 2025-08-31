import { env } from './env';

export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  version: process.env.npm_package_version || '0.1.0',
  description: 'Ancient Wisdom Wellness System',
  isProd: env.NODE_ENV === "production",
  isDev: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
  logLevel: env.LOG_LEVEL,
  port: env.PORT,
  featureFlags: env.FEATURE_FLAGS,
  
  // App constants
  constants: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_UPLOAD_FILES: 5,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,
  },
  
  // Security settings
  security: {
    JWT_EXPIRES_IN: '24h',
    PASSWORD_MIN_LENGTH: 8,
    SESSION_SECRET: env.JWT_SECRET,
  },
  
  // Database settings
  database: {
    url: env.DATABASE_URL,
    maxConnections: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  
  // External services
  services: {
    openai: {
      apiKey: env.OPENAI_API_KEY,
      model: 'gpt-4',
      maxTokens: 2000,
    },
    railway: {
      token: env.RAILWAY_TOKEN,
      projectId: env.RAILWAY_PROJECT_ID,
    },
  },
} as const;

export default appConfig; 