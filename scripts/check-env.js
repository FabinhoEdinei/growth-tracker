import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

const projectDir = '/vercel/share/v0-project';

// Check node_modules
const nodeModules = resolve(projectDir, 'node_modules');
console.log('node_modules exists:', existsSync(nodeModules));

// Check .bin
const binDir = resolve(nodeModules, '.bin');
console.log('.bin exists:', existsSync(binDir));

if (existsSync(binDir)) {
  const bins = readdirSync(binDir);
  console.log('.bin contents:', bins.join(', '));
}

// Check vitest in node_modules
const vitestDir = resolve(nodeModules, 'vitest');
console.log('vitest dir exists:', existsSync(vitestDir));

// Check which node
console.log('process.execPath:', process.execPath);
console.log('PATH:', process.env.PATH);

// Try to find pnpm/npm global
const globalModules = [
  '/usr/local/lib/node_modules',
  '/usr/lib/node_modules',
  resolve(process.env.HOME || '', '.npm', 'node_modules'),
];

for (const gm of globalModules) {
  console.log(`${gm} exists:`, existsSync(gm));
}
