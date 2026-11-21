import { Role, SystemRole } from './index';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        userId: string;
        email: string;
        role: Role;
        systemRole?: SystemRole;
        name?: string;
      };
    }
  }
}

export {};
