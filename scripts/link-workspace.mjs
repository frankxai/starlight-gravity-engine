// Zero-install workspace linker.
// Creates node_modules/@starlight-gravity/core as a directory junction (Windows)
// or symlink (POSIX) so `@starlight-gravity/core` resolves without a package
// install. This lets the CLI and tests run against source on a memory-
// constrained machine where a full `pnpm install` is unsafe. CI still runs a
// real install; this is purely a local convenience.
import { mkdirSync, symlinkSync, existsSync, lstatSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scope = join(root, 'node_modules', '@starlight-gravity');
const link = join(scope, 'core');
const target = join(root, 'packages', 'core');

mkdirSync(scope, { recursive: true });

if (existsSync(link)) {
  // Already linked (junction, symlink, or a real install). Nothing to do.
  process.exit(0);
}

const type = process.platform === 'win32' ? 'junction' : 'dir';
try {
  symlinkSync(target, link, type);
  console.log(`Linked @starlight-gravity/core -> ${target} (${type})`);
} catch (err) {
  if (err && err.code === 'EEXIST') process.exit(0);
  console.error('Failed to link workspace core:', err.message);
  process.exit(1);
}

// Sanity: confirm it points somewhere real.
if (!existsSync(join(link, 'package.json'))) {
  console.error('Link created but core/package.json not reachable.');
  process.exit(1);
}
void lstatSync;
