import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { readdirSync } from 'fs';

const cwd = '/vercel/share/v0-project';

// Check available package managers
const managers = ['pnpm', 'npm', 'yarn', 'bun'];
for (const mgr of managers) {
  try {
    const version = execSync(`which ${mgr} 2>/dev/null`).toString().trim();
    console.log(`${mgr} found at: ${version}`);
  } catch {
    console.log(`${mgr}: not found`);
  }
}

// Check /usr/local/lib/node_modules contents
try {
  const globalModules = readdirSync('/usr/local/lib/node_modules');
  console.log('\n/usr/local/lib/node_modules:', globalModules.join(', '));
} catch (e) {
  console.log('Cannot read /usr/local/lib/node_modules');
}

// Check /usr/lib/node_modules contents  
try {
  const globalModules2 = readdirSync('/usr/lib/node_modules');
  console.log('/usr/lib/node_modules:', globalModules2.join(', '));
} catch (e) {
  console.log('Cannot read /usr/lib/node_modules');
}

// Check for lockfiles
console.log('\npnpm-lock.yaml exists:', existsSync(`${cwd}/pnpm-lock.yaml`));
console.log('package-lock.json exists:', existsSync(`${cwd}/package-lock.json`));
console.log('yarn.lock exists:', existsSync(`${cwd}/yarn.lock`));
console.log('bun.lockb exists:', existsSync(`${cwd}/bun.lockb`));
