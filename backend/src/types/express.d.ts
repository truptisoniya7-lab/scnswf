import { Role } from './index';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
