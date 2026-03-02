import { spawn } from 'child_process';
import { resolve } from 'path';

const projectDir = '/vercel/share/v0-project';
const vitestBin = resolve(projectDir, 'node_modules', '.bin', 'vitest');

const child = spawn(vitestBin, ['run', '--reporter=verbose'], {
  cwd: projectDir,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, FORCE_COLOR: '0' },
});

let output = '';

child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  output += data.toString();
});

child.on('close', (code) => {
  console.log(output);
  console.log('Exit code:', code);
});
