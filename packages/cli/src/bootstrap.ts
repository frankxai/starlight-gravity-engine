/**
 * Zero-setup bootstrap for run-from-source use.
 *
 * The CLI imports `@starlight-gravity/core` by package name. On a fresh clone
 * with no `pnpm install`, that bare specifier will not resolve. Rather than
 * make the user run a link step, `bin.ts` calls this first: it creates the one
 * workspace symlink (a junction on Windows) the resolver needs — but only if
 * core does not already resolve (so an installed or already-linked setup is
 * left untouched). No downloads, no dependencies; pure Node built-ins.
 */
import { mkdirSync, symlinkSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function ensureCoreLinked(): void {
  // If the package already resolves (installed, or previously linked), do nothing.
  try {
    import.meta.resolve('@starlight-gravity/core');
    return;
  } catch {
    // Not resolvable yet — fall through and create the local link.
  }

  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
  const scope = join(repoRoot, 'node_modules', '@starlight-gravity');
  const link = join(scope, 'core');
  const target = join(repoRoot, 'packages', 'core');

  // Only attempt the link when this really is the source checkout.
  if (!existsSync(join(target, 'package.json'))) return;

  try {
    mkdirSync(scope, { recursive: true });
    if (!existsSync(link)) {
      symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
    }
  } catch {
    // Best effort. If linking fails, the static import in cli.ts will surface a
    // clear resolution error — no worse than before, and never a silent crash.
  }
}
