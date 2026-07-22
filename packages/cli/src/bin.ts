#!/usr/bin/env node
/** Executable entry point. Runs on Node 22+ directly from TypeScript source. */
import { run } from './cli.ts';

const code = await run(process.argv.slice(2));
process.exit(code);
