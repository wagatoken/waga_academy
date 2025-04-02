import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | { id: number; role: string }; // Add the `user` property
    }
  }
}