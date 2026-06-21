import type { IncomingMessage, ServerResponse } from 'http';
import { registerRoute } from '../router/index.ts';
import { client } from '../config/database.ts';

function send(res: ServerResponse, status: number, data: unknown) {
  console.log(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function healthCheck({ res }: { res: ServerResponse }) {
  send(res, 200, { status: 'ok', uptime: process.uptime() });
}

export async function readinessCheck({ res }: { res: ServerResponse }) {
  try {
    await client`SELECT 1`;
    send(res, 200, { status: 'ready', database: 'connected' });
  } catch (err) {
    send(res, 503, { status: 'not ready', database: 'disconnected' });
  }
}

registerRoute('GET', '/api/health', healthCheck);
registerRoute('GET', '/api/health/ready', readinessCheck);

