// Bug Busters backend – minimal Node http server (no frameworks)
// Endpoints:
//  - GET  /health  -> { status: 'ok' }
//  - GET  /scores  -> { scores: [ { name, score, ts } ] } (top 10)
//  - POST /scores  -> accepts { name<=20, score>=0 integer } returns created entry
// CORS: allow *; handle OPTIONS preflight for GET/POST

const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3000);

/** In-memory storage */
const MAX_KEEP = 100; // cap recent scores to avoid unbounded growth
/** @type {{name:string, score:number, ts:number}[]} */
let SCORES = [];

function json(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    // CORS headers
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function text(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(String(data));
}

function ok(res, data) { json(res, 200, data); }
function created(res, data) { json(res, 201, data); }
function badRequest(res, msg) { json(res, 400, { error: msg || 'Bad Request' }); }
function notFound(res) { json(res, 404, { error: 'Not Found' }); }

function sortTop10(scores) {
  return scores
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score; // desc by score
      return a.ts - b.ts; // asc by time
    })
    .slice(0, 10);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      chunks.push(c);
      size += c.length;
      if (size > 1e6) {
        // Prevent too-large bodies (~1MB)
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        const data = raw ? JSON.parse(raw) : {};
        resolve(data);
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Routing
  if (req.method === 'GET' && pathname === '/health') {
    return ok(res, { status: 'ok' });
  }
  if (req.method === 'GET' && pathname === '/scores') {
    const top = sortTop10(SCORES);
    return ok(res, { scores: top });
  }
  if (req.method === 'POST' && pathname === '/scores') {
    try {
      const data = await readBody(req);
      let name = typeof data.name === 'string' ? data.name.trim() : '';
      const score = Number.isInteger(data.score) ? data.score : NaN;

      if (!name) name = 'Player';
      if (name.length > 20) name = name.slice(0, 20);
      if (!Number.isInteger(score) || score < 0) {
        return badRequest(res, 'Invalid score');
      }

      const entry = { name, score, ts: Date.now() };
      SCORES.push(entry);
      if (SCORES.length > MAX_KEEP) SCORES = SCORES.slice(-MAX_KEEP);

      return created(res, entry);
    } catch (err) {
      return badRequest(res, err.message || 'Invalid payload');
    }
  }

  return notFound(res);
});

server.listen(PORT, () => {
  console.log(`Bug Busters backend listening on http://localhost:${PORT}`);
});
