#!/usr/bin/env node
/** Executable entry point. Runs on Node 22+ directly from TypeScript source. */
import { ensureCoreLinked } from './bootstrap.ts';

// Ensure `@starlight-gravity/core` resolves before the CLI (which imports it
// statically) is loaded — makes a fresh clone runnable with zero install.
ensureCoreLinked();

const { run } = await import('./cli.ts');
const code = await run(process.argv.slice(2));
process.exit(code);
