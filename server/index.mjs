// Serves the built app (dist/) to the local network so a phone on the same
// Wi-Fi can open it. No framework: node:http is all this needs, and keeping
// dependencies pure JS lets the same node_modules work from Windows and WSL.
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { networkInterfaces, release } from 'node:os';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const PORT = Number(process.env.PORT) || 5180;
// Settings and today's place, kept on this computer so they survive a change of
// address, a cleared browser, or a different phone. Single user: one file.
const DATA_DIR = resolve(fileURLToPath(new URL('../data', import.meta.url)));
const STORE = join(DATA_DIR, 'store.json');

function readStore() {
  try {
    return JSON.parse(readFileSync(STORE, 'utf8'));
  } catch {
    return {};
  }
}

function writeStore(obj) {
  mkdirSync(DATA_DIR, { recursive: true });
  const tmp = STORE + '.tmp';
  writeFileSync(tmp, JSON.stringify(obj, null, 2));
  renameSync(tmp, STORE);
}

function handleApi(req, res, pathname) {
  if (pathname !== '/api/store') {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    return;
  }
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(readStore()));
    return;
  }
  if (req.method === 'PUT') {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (c) => {
      body += c;
      if (body.length > 64_000) req.destroy();
    });
    req.on('end', () => {
      try {
        const patch = JSON.parse(body);
        if (!patch || typeof patch !== 'object' || Array.isArray(patch)) throw new Error();
        writeStore({ ...readStore(), ...patch });
        res.writeHead(204).end();
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Expected a JSON object');
      }
    });
    return;
  }
  res.writeHead(405).end();
}


const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('No build found. From WSL, in this folder, run:  npm run build');
  process.exit(1);
}

const isFile = (p) => existsSync(p) && statSync(p).isFile();

const server = createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname);
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  let file = normalize(join(DIST, pathname));
  if (file !== DIST && !file.startsWith(DIST + sep)) {
    res.writeHead(403).end();
    return;
  }
  if (!isFile(file)) {
    // A missing asset is a real 404; any other path is the app itself.
    if (extname(pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
      return;
    }
    file = join(DIST, 'index.html');
  }
  const hashed = file.startsWith(join(DIST, 'assets') + sep);
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    'Content-Length': statSync(file).size,
    'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  if (req.method === 'HEAD') res.end();
  else createReadStream(file).pipe(res);
});

server.on('error', (err) => {
  console.error(err.code === 'EADDRINUSE' ? `Port ${PORT} is in use. Set PORT to another number.` : err);
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', async () => {
  const lan = Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => `http://${n.address}:${PORT}`);
  // Home Wi-Fi addresses first; virtual adapters (WSL, Hyper-V, VPN) are usually 172.x / 10.x
  lan.sort((a, b) => Number(b.includes('//192.168.')) - Number(a.includes('//192.168.')));

  console.log(`\nRosary is running.\n\n  This computer:  http://localhost:${PORT}`);
  for (const url of lan) console.log(`  On your phone:  ${url}`);

  if (/microsoft/i.test(release())) {
    console.log(
      '\nThis is running inside WSL, whose network a phone cannot reach.\n' +
        'To use it on your phone, run start.bat from Windows instead.',
    );
  } else if (lan.length) {
    try {
      const { default: qr } = await import('qrcode-terminal');
      console.log(`\nScan to open ${lan[0]}\n`);
      qr.generate(lan[0], { small: true });
    } catch {
      // QR is a convenience only
    }
    console.log('Phone and computer must be on the same Wi-Fi. If Windows asks, allow Node on private networks.');
  }
  console.log('\nPress Ctrl+C to stop.');
});
