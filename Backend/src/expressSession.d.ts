import {SessionData} from 'express-session'

declare module 'express-session'{
    interface SessionData {
      userSessionObj?: {
        userId: number,
      };
    }
  }


declare global {
    namespace Express {
        interface Request {
            userId?: number; // Add user to the Request interface
        }
    }
}