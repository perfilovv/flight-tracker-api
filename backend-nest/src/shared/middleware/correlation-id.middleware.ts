import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

declare module 'express' {
  interface Request {
    correlationId: string;
  }
}

declare module 'http' {
  interface IncomingMessage {
    correlationId?: string;
  }
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req as any).id || randomUUID();
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    next();
  }
}
