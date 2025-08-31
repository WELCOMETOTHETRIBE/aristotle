import { z } from "zod";

export const env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters").optional(),
  OPENAI_API_KEY: z.string().optional(),
  RAILWAY_TOKEN: z.string().optional(),
  RAILWAY_PROJECT_ID: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Aristotle"),
  NEXT_PUBLIC_DEFAULT_VOICE: z.string().default("alloy"),
  FEATURE_FLAGS: z.object({
    ENABLE_DEVELOPER_FEEDBACK: z.coerce.boolean().default(false),
    ENABLE_WIDGET_INTEGRITY: z.coerce.boolean().default(true),
    ENABLE_BREATHWORK_AUDIO: z.coerce.boolean().default(true),
  }).default({}),
}).parse(process.env);

export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

// Validate required environment variables at runtime only
if (typeof window === 'undefined' && isProd && !env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in production");
}

if (typeof window === 'undefined' && isProd && !env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

export default env; 