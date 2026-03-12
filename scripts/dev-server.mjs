import { spawn } from 'node:child_process';

const port = process.env.PORT || '34546';
const env = { ...process.env, PORT: port, HOSTNAME: process.env.HOSTNAME || '0.0.0.0' };

const child = spawn('npm', ['run', 'dev', '--workspace', 'web'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32'
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
