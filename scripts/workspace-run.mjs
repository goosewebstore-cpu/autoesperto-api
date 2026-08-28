import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const [targetDir, ...cmdArgs] = process.argv.slice(2);

if (!targetDir || cmdArgs.length === 0) {
  console.error('Usage: node scripts/workspace-run.mjs <target-dir> <command> [...args]');
  process.exit(1);
}

const resolvedCwd = path.resolve(process.cwd(), targetDir);
const fullCmd = cmdArgs.join(' ');

// Clean npm internal lifecycle variables so child npm processes don't get confused
const cleanEnv = { ...process.env };
for (const key of Object.keys(cleanEnv)) {
  if (key.startsWith('npm_lifecycle_') || key === 'npm_command' || key === 'npm_config_argv') {
    delete cleanEnv[key];
  }
}

const child = spawn(fullCmd, {
  cwd: resolvedCwd,
  stdio: 'inherit',
  shell: true,
  env: cleanEnv,
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (err) => {
  console.error(`Failed to start subprocess: ${err.message}`);
  process.exit(1);
});
