import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  JWT_SECRET: z.string().default('scnswf-jwt-secret-key-development-2026-secure'),
  JWT_REFRESH_SECRET: z.string().default('scnswf-jwt-refresh-secret-key-development-2026-secure'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  DEFAULT_ADMIN_EMAIL: z.string().email().default('admin@scnswf.org'),
  DEFAULT_ADMIN_PASSWORD: z.string().default('AdminSecure@2026'),
  DATA_STORE: z.enum(['local', 'firebase']).default('local'),
  FIREBASE_PROJECT_ID: z.string().default('project-ngo-scnswf'),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_DATABASE_URL: z.string().optional(),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Environment configuration error');
  }
  return {
    ...parsed.data,
    corsOrigins: parsed.data.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  };
};

export const env = parseEnv();
