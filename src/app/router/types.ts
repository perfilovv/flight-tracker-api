import type { IncomingMessage, ServerResponse } from 'node:http';

export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  params?: Record<string, string>,
) => void | Promise<void>;

export type Route = {
  method: string;
  path: string;
  segments: string[];
  handler: Handler;
};

