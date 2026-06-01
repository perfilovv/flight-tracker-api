import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Handler, Route } from './types.ts';
import { parseBody } from '../../shared/utils/parseBody.ts';

const routes: Route[] = [];

function normalizePath(path: string) {
  return path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);
}

export function registerRoute(method: string, path: string, handler: Handler) {
  routes.push({
    method: method.toUpperCase(),
    path,
    segments: normalizePath(path),
    handler,
  });
}

function matchRoute(routeSegments: string[], urlSegments: string[]) {
  if (routeSegments.length !== urlSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const urlSegment = urlSegments[i];

    if (routeSegment.startsWith(':')) {
      const paramName = routeSegment.slice(1);

      params[paramName] = decodeURIComponent(urlSegment);

      continue;
    }

    if (routeSegment !== urlSegment) {
      return null;
    }
  }

  return params;
}

export async function handleRoute(req: IncomingMessage, res: ServerResponse) {
  const pathname = req.url?.split('?')[0] || '/';

  const urlSegments = normalizePath(pathname);

  for (const route of routes) {
    if (route.method !== req.method) {
      continue;
    }

    const params = matchRoute(route.segments, urlSegments);

    if (!params) {
      continue;
    }

    const body = await parseBody(req);
    await route.handler({ req, res, params, body });

    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json',
  });

  res.end(
    JSON.stringify({
      error: 'Route not found',
    }),
  );
}

