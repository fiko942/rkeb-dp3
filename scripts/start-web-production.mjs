import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const serverPath = path.join(root, 'apps', 'web', '.next', 'standalone', 'apps', 'web', 'server.js');

if (!existsSync(serverPath)) {
  process.stderr.write('Build belum tersedia. Jalankan: npm run build\\n');
  process.exit(1);
}

process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '34546';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

await import(serverPath);
