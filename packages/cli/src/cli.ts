/**
 * Argument parsing and command dispatch. `run()` is pure-ish: it takes argv and
 * an injectable IO bag (clock, stdin, writer) and returns an exit code, so the
 * whole CLI is testable without spawning a process.
 */
import { parseArgs } from 'node:util';
import { resolve, join } from 'node:path';
import { GravityStore } from '@starlight-gravity/core';
import { ConsoleWriter, type Writer } from './output.ts';
import {
  cmdBrief,
  cmdCapture,
  cmdDoctor,
  cmdFollowThrough,
  cmdInit,
  cmdPublish,
  cmdReview,
  cmdRoom,
  syncDirection,
  type CommandContext,
  type CommandResult,
  type Flags,
} from './commands.ts';

export const CLI_VERSION = '0.1.0';

const COMMANDS: Record<string, (ctx: CommandContext) => Promise<CommandResult>> = {
  init: cmdInit,
  capture: cmdCapture,
  brief: cmdBrief,
  room: cmdRoom,
  'follow-through': cmdFollowThrough,
  publish: cmdPublish,
  review: cmdReview,
  doctor: cmdDoctor,
};

const USAGE = `starlight-gravity — turn encounters into shared intelligence, artifacts, and rooms.

Usage: starlight-gravity <command> [options]

Commands:
  init                 Create a local gravity field (.gravity/) and DIRECTION.md
  capture              Extract signals + suggestions from a field note
  brief                Daily brief: gravity score, open commitments, signals
  room [list|propose]  List or propose a room
  follow-through       List open commitments; --fulfil <id> to close one
  publish              Check publishability and emit a SIP attestation block
  review               Weekly review: gravity delta and the weakest force
  doctor               Verify install, store integrity, and sovereignty checks

Global options:
  --dir <path>   Project directory (store lives in <dir>/.gravity). Default: cwd
  --json         Emit machine-readable JSON instead of human text
  --help         Show this help
  --version      Print version

Examples:
  starlight-gravity init
  starlight-gravity capture --file note.md --save
  starlight-gravity brief --json
  starlight-gravity follow-through --fulfil cmt_ab12cd34ef
`;

async function readStdinDefault(): Promise<string> {
  if (process.stdin.isTTY) return '';
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(c as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

export interface RunIO {
  now?: Date;
  readStdin?: () => Promise<string>;
  writer?: Writer;
}

export async function run(argv: string[], io: RunIO = {}): Promise<number> {
  const writer = io.writer ?? new ConsoleWriter();
  const now = io.now ?? new Date();
  const readStdin = io.readStdin ?? readStdinDefault;

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        json: { type: 'boolean' },
        dir: { type: 'string' },
        help: { type: 'boolean' },
        version: { type: 'boolean' },
        owner: { type: 'string' },
        force: { type: 'boolean' },
        file: { type: 'string' },
        note: { type: 'string' },
        save: { type: 'boolean' },
        thesis: { type: 'string' },
        theme: { type: 'string' },
        host: { type: 'string' },
        fulfil: { type: 'string' },
        artifact: { type: 'string' },
        title: { type: 'string' },
        body: { type: 'string' },
        vertical: { type: 'string', multiple: true },
        node: { type: 'string', multiple: true },
      },
    });
  } catch (err) {
    writer.write(`Error: ${(err as Error).message}`);
    writer.write('Run `starlight-gravity --help` for usage.');
    return 2;
  }

  const flags = parsed.values as Flags;
  const positionals = parsed.positionals;
  const command = positionals[0];

  if (flags.version) {
    writer.write(CLI_VERSION);
    return 0;
  }
  if (flags.help || !command) {
    writer.write(USAGE);
    return command ? 0 : flags.help ? 0 : 1;
  }

  const handler = COMMANDS[command];
  if (!handler) {
    writer.write(`Unknown command: ${command}`);
    writer.write('Run `starlight-gravity --help` for usage.');
    return 2;
  }

  const projectDir = flags.dir ? resolve(flags.dir) : process.cwd();
  const store = new GravityStore(join(projectDir, '.gravity'));
  const ctx: CommandContext = { store, projectDir, flags, positionals, now, readStdin };

  try {
    // Editing DIRECTION.md is enough to update the field — sync before reading.
    if (command !== 'init' && (await store.isInitialized())) await syncDirection(ctx);
    const result = await handler(ctx);
    if (flags.json) writer.write(JSON.stringify(result.data, null, 2));
    else for (const line of result.lines) writer.write(line);
    return result.code;
  } catch (err) {
    if (flags.json) writer.write(JSON.stringify({ error: (err as Error).message }, null, 2));
    else writer.write(`Error: ${(err as Error).message}`);
    return 1;
  }
}
