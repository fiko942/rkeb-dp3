import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'apps', 'web');
const RELEASE_ROOT = path.join(ROOT, 'release');
const RELEASE_NAME = 'rkeb-dp3-production';
const RELEASE_DIR = path.join(RELEASE_ROOT, RELEASE_NAME);
const ZIP_PATH = path.join(RELEASE_ROOT, `${RELEASE_NAME}.zip`);

const TOTAL_STEPS = 8;
let currentStep = 0;

function progress(label) {
  currentStep += 1;
  const width = 28;
  const ratio = currentStep / TOTAL_STEPS;
  const filled = Math.round(width * ratio);
  const bar = `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
  process.stdout.write(`\n[${bar}] ${Math.round(ratio * 100)}% - ${label}\n`);
}

async function runCommand(label, command, args, cwd, extraEnv = {}) {
  process.stdout.write(`[log] ${label}\n`);
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...extraEnv },
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with code ${code}`));
    });
  });
}

function parseDatabaseUrl() {
  const envPath = path.join(WEB, '.env');
  if (!existsSync(envPath)) {
    return null;
  }
  const content = readFileSync(envPath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .map((v) => v.trim())
    .find((v) => v.startsWith('DATABASE_URL='));
  if (!line) return null;
  return line.split('=')[1]?.replace(/^['\"]|['\"]$/g, '') ?? null;
}

async function copyDirIfExists(source, destination) {
  if (!existsSync(source)) return;
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true });
}

function readWebPackage() {
  const pkgPath = path.join(WEB, 'package.json');
  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

async function main() {
  progress('Build Next.js production bundle');
  await runCommand('next build', 'npm', ['run', 'build', '--workspace', 'web'], ROOT);

  progress('Prepare release directory');
  await fs.mkdir(RELEASE_ROOT, { recursive: true });
  await fs.rm(RELEASE_DIR, { recursive: true, force: true });
  await fs.rm(ZIP_PATH, { force: true });
  await fs.mkdir(RELEASE_DIR, { recursive: true });

  progress('Copy .next build output (without cache)');
  await copyDirIfExists(path.join(WEB, '.next'), path.join(RELEASE_DIR, '.next'));
  await fs.rm(path.join(RELEASE_DIR, '.next', 'cache'), { recursive: true, force: true });
  await fs.rm(path.join(RELEASE_DIR, '.next', 'standalone'), { recursive: true, force: true });

  progress('Copy runtime assets and Prisma schema');
  await copyDirIfExists(path.join(WEB, 'public'), path.join(RELEASE_DIR, 'public'));
  await copyDirIfExists(path.join(WEB, 'prisma'), path.join(RELEASE_DIR, 'prisma'));
  await fs.rm(path.join(RELEASE_DIR, 'prisma', 'dev.db'), { force: true });
  await fs.rm(path.join(RELEASE_DIR, 'prisma', 'dev.db-journal'), { force: true });

  progress('Attach runtime database snapshot');
  const dbDir = path.join(RELEASE_DIR, 'data');
  await fs.mkdir(dbDir, { recursive: true });
  const dbUrl = parseDatabaseUrl();
  if (dbUrl?.startsWith('file:')) {
    const dbPathRaw = dbUrl.replace('file:', '');
    const dbPath = path.isAbsolute(dbPathRaw) ? dbPathRaw : path.resolve(WEB, dbPathRaw);
    if (existsSync(dbPath)) {
      await fs.copyFile(dbPath, path.join(dbDir, 'dev.db'));
    }
  }

  progress('Generate release package.json and main.js');
  const webPkg = readWebPackage();
  const releasePackageJson = {
    name: 'rkeb-dp3-production',
    version: '1.0.0',
    private: true,
    scripts: {
      start: 'node main.js',
      postinstall: 'prisma generate --schema prisma/schema.prisma'
    },
    dependencies: {
      next: webPkg.dependencies.next,
      react: webPkg.dependencies.react,
      'react-dom': webPkg.dependencies['react-dom'],
      '@prisma/client': webPkg.dependencies['@prisma/client'],
      prisma: webPkg.devDependencies.prisma
    }
  };

  const mainJs = `const { spawn } = require('node:child_process');\nconst { copyFileSync, existsSync, mkdirSync } = require('node:fs');\nconst { pathToFileURL } = require('node:url');\nconst path = require('node:path');\n\nprocess.env.NODE_ENV = 'production';\nprocess.env.PORT = process.env.PORT || '34546';\nprocess.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';\n\nif (!process.env.DATABASE_URL) {\n  const bundledDb = path.resolve(__dirname, 'data', 'dev.db');\n  const tmpBase = process.env.TMPDIR || '/tmp';\n  const runtimeDir = path.join(tmpBase, 'rkeb-dp3-runtime');\n  const runtimeDb = path.join(runtimeDir, 'dev.db');\n\n  if (existsSync(bundledDb)) {\n    mkdirSync(runtimeDir, { recursive: true });\n    copyFileSync(bundledDb, runtimeDb);\n    process.env.DATABASE_URL = pathToFileURL(runtimeDb).href;\n  }\n}\n\nif (!process.env.DATABASE_URL) {\n  process.env.DATABASE_URL = 'file:./data/dev.db';\n}\n\nconsole.log('Starting rkeb-dp3 on port ' + process.env.PORT);\n\nconst nextBin = require.resolve('next/dist/bin/next');\nconst child = spawn(process.execPath, [nextBin, 'start', '-p', process.env.PORT, '-H', process.env.HOSTNAME], {\n  cwd: __dirname,\n  env: process.env,\n  stdio: 'inherit'\n});\n\nchild.on('exit', (code) => process.exit(code ?? 1));\n`;

  await fs.writeFile(
    path.join(RELEASE_DIR, 'package.json'),
    `${JSON.stringify(releasePackageJson, null, 2)}\n`,
    'utf8'
  );
  await fs.writeFile(path.join(RELEASE_DIR, 'main.js'), mainJs, 'utf8');
  await fs.writeFile(
    path.join(RELEASE_DIR, 'DEPLOY.txt'),
    [
      'Install dependencies first: npm install --omit=dev',
      'Run app: node main.js',
      'Default port: 34546'
    ].join('\n') + '\n',
    'utf8'
  );

  progress('Clean metadata files and create zip artifact');
  await runCommand('cleanup metadata files', 'find', ['.', '-name', '._*', '-type', 'f', '-delete'], RELEASE_DIR);
  await runCommand(
    'zip artifact',
    'zip',
    ['-X', '-rq', `${RELEASE_NAME}.zip`, RELEASE_NAME],
    RELEASE_ROOT,
    { COPYFILE_DISABLE: 'true', COPY_EXTENDED_ATTRIBUTES_DISABLE: 'true' }
  );

  progress('Done');
  process.stdout.write(`\n[done] Artifact ready: ${ZIP_PATH}\n`);
  process.stdout.write('[done] VPS run steps: unzip -> npm install --omit=dev -> node main.js\n');
}

main().catch((error) => {
  process.stderr.write(`\n[error] ${error.message}\n`);
  process.exit(1);
});
