import { User } from "@prisma/client";
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: User; 
    }
  }
}