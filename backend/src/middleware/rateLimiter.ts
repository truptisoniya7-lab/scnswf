import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';
import { env } from '../config/env';

const isDevOrTest = env.NODE_ENV === 'development' || env.NODE_ENV === 'test';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 10000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'throttled', 'Request was throttled. Expected available in 15 minutes.');
  },
});

export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'throttled', 'Too many submissions from this IP. Please try again later.');
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 1000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'throttled', 'Too many login attempts. Please try again later.');
  },
});
