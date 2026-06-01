import type { IncomingMessage, ServerResponse } from 'node:http';

export type Handler = (ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  body: unknown;
}) => Promise<void>;

export type Route = {
  method: string;
  path: string;
  segments: string[];
  handler: Handler;
};

