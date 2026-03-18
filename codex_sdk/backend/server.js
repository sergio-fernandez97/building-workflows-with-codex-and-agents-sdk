// Bug Busters minimal backend (Node.js >= 18, no deps)
// Endpoints:
//  - GET  /health  -> { status: 'ok' }
//  - GET  /scores  -> { scores: [ {name, score, ts} ] } (top 10 by score desc)
//  - POST /scores  -> accepts JSON { name, score } and returns 201 with saved object
// CORS enabled for GET, POST, OPTIONS. In-memory storage only (max 100 entries).

const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

/** @type {{name:string, score:number, ts:number}[]} */
const store = [];
const MAX_STORE = 100;

function setCORS(res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJSON(res, statusCode, obj){
  const body = JSON.stringify(obj);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  setCORS(res);
  res.end(body);
}

function notFound(res){ sendJSON(res, 404, { error: 'Not found' }); }

function sortTop10(){
  return [...store].sort((a,b) => b.score - a.score).slice(0, 10);
}

function isValidName(name){
  return typeof name === 'string' && /^[A-Za-z0-9 _-]{2,12}$/.test(name);
}
function isValidScore(score){
  return Number.isFinite(score) && Number.isInteger(score) && score >= 0;
}

function log(req, status){
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url} -> ${status}`);
}

const server = http.createServer((req, res) => {
  setCORS(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    return res.end();
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;

  // Routing
  if (req.method === 'GET' && path === '/health') {
    sendJSON(res, 200, { status: 'ok' });
    return log(req, 200);
  }

  if (req.method === 'GET' && path === '/scores') {
    sendJSON(res, 200, { scores: sortTop10() });
    return log(req, 200);
  }

  if (req.method === 'POST' && path === '/scores') {
    // Collect JSON body
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', chunk => { raw += chunk; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        sendJSON(res, 400, { error: 'Invalid JSON' });
        return log(req, 400);
      }

      const name = data?.name;
      const score = Number(data?.score);
      if (!isValidName(name)) {
        sendJSON(res, 400, { error: 'Invalid name (2–12 chars: letters/digits/space/-/_)' });
        return log(req, 400);
      }
      if (!isValidScore(score)) {
        sendJSON(res, 400, { error: 'Invalid score (integer >= 0)' });
        return log(req, 400);
      }

      const saved = { name, score, ts: Date.now() };
      store.push(saved);
      // Cap store length
      if (store.length > MAX_STORE) store.splice(0, store.length - MAX_STORE);

      sendJSON(res, 201, { ok: true, saved });
      return log(req, 201);
    });
    return; // will respond asynchronously
  }

  // Default 404
  notFound(res); log(req, 404);
});

server.listen(PORT, HOST, () => {
  console.log(`Bug Busters backend listening on http://${HOST}:${PORT}`);
});
