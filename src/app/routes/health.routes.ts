import type { IncomingMessage, ServerResponse } from 'http';
import { registerRoute } from '../router/index.ts';

export function healthHandler(_req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  res.end(
    JSON.stringify({
      status: 'ok',
    }),
  );
}

registerRoute('GET', '/api/health', healthHandler);

