/**
 * @module @infrastructure/http/DevGameServer
 *
 * Local development HTTP server exposing the application facade and static UI.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ValidationError } from '../../common/errors/ValidationError.js';
import type { GameSession } from '../../application/facade/GameSession.js';

/** MIME types for static UI assets. */
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/** Configuration for {@link DevGameServer}. */
export type DevGameServerOptions = {
  readonly session: GameSession;
  readonly webRoot: string;
  readonly host?: string;
  readonly port?: number;
};

/**
 * Serves the browser UI shell and JSON API routes for local development.
 */
export class DevGameServer {
  readonly #session: GameSession;
  readonly #webRoot: string;
  readonly #host: string;
  readonly #port: number;

  /**
   * @param options - Session facade, static asset root and listen options.
   */
  constructor(options: DevGameServerOptions) {
    this.#session = options.session;
    this.#webRoot = options.webRoot;
    this.#host = options.host ?? '127.0.0.1';
    this.#port = options.port ?? 3000;
  }

  /** Starts listening for browser requests. */
  listen(): Promise<{ readonly host: string; readonly port: number }> {
    const server = createServer((request, response) => {
      void this.#handleRequest(request, response);
    });

    return new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(this.#port, this.#host, () => {
        resolve({ host: this.#host, port: this.#port });
      });
    });
  }

  async #handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    try {
      const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

      if (url.pathname.startsWith('/api/')) {
        await this.#handleApi(request, response, url.pathname);
        return;
      }

      await this.#handleStatic(response, url.pathname);
    } catch {
      this.#sendJson(response, 500, { error: 'Internal server error.' });
    }
  }

  async #handleApi(
    request: IncomingMessage,
    response: ServerResponse,
    pathname: string,
  ): Promise<void> {
    if (request.method === 'GET' && pathname === '/api/dashboard') {
      this.#respondWithResult(response, this.#session.getDashboard());
      return;
    }

    if (request.method === 'POST' && pathname === '/api/session/new') {
      const body = await this.#readJson<{ readonly name?: string }>(request);
      this.#respondWithResult(response, this.#session.startNewGame(body?.name));
      return;
    }

    if (request.method === 'POST' && pathname === '/api/simulation/tick') {
      this.#respondWithResult(response, this.#session.tick());
      return;
    }

    if (request.method === 'POST' && pathname === '/api/buildings/place') {
      const body = await this.#readJson<{
        readonly buildingTypeId?: string;
        readonly name?: string;
        readonly x?: number;
        readonly y?: number;
      }>(request);

      if (
        body?.buildingTypeId === undefined ||
        body.name === undefined ||
        body.x === undefined ||
        body.y === undefined
      ) {
        this.#sendJson(response, 400, { error: 'Missing building placement fields.' });
        return;
      }

      this.#respondWithResult(
        response,
        this.#session.placeBuilding({
          buildingTypeId: body.buildingTypeId,
          name: body.name,
          x: body.x,
          y: body.y,
        }),
      );
      return;
    }

    if (request.method === 'POST' && pathname === '/api/market/sell') {
      const body = await this.#readJson<{
        readonly resourceId?: string;
        readonly amount?: number;
      }>(request);

      if (body?.resourceId === undefined || body.amount === undefined) {
        this.#sendJson(response, 400, { error: 'Missing market sell fields.' });
        return;
      }

      this.#respondWithResult(
        response,
        this.#session.sellResource({
          resourceId: body.resourceId,
          amount: body.amount,
        }),
      );
      return;
    }

    this.#sendJson(response, 404, { error: 'Route not found.' });
  }

  async #handleStatic(response: ServerResponse, pathname: string): Promise<void> {
    const webRoot = path.resolve(this.#webRoot);
    const safePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.resolve(webRoot, safePath);

    if (filePath !== webRoot && !filePath.startsWith(`${webRoot}${path.sep}`)) {
      this.#sendJson(response, 403, { error: 'Forbidden.' });
      return;
    }

    try {
      const content = await readFile(filePath);
      const extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream',
      });
      response.end(content);
    } catch {
      this.#sendJson(response, 404, { error: 'Asset not found.' });
    }
  }

  async #readJson<T>(request: IncomingMessage): Promise<T | undefined> {
    const chunks: Buffer[] = [];

    for await (const chunk of request) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    if (chunks.length === 0) {
      return undefined;
    }

    const raw = Buffer.concat(chunks).toString('utf8');

    if (raw.trim().length === 0) {
      return undefined;
    }

    return JSON.parse(raw) as T;
  }

  #respondWithResult<T>(
    response: ServerResponse,
    result: { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: ValidationError },
  ): void {
    if (result.ok) {
      this.#sendJson(response, 200, { ok: true, data: result.value });
      return;
    }

    this.#sendJson(response, 400, { ok: false, error: result.error.message });
  }

  #sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
    response.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(JSON.stringify(payload));
  }
}
