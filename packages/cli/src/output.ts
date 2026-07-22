/** Tiny output layer. Every command can emit human-readable or --json output. */

export interface Writer {
  write(line: string): void;
}

export class BufferWriter implements Writer {
  lines: string[] = [];
  write(line: string): void {
    this.lines.push(line);
  }
  toString(): string {
    return this.lines.join('\n');
  }
}

export class ConsoleWriter implements Writer {
  write(line: string): void {
    process.stdout.write(`${line}\n`);
  }
}

export function heading(text: string): string {
  return `\n★ ${text}`;
}

export function bullet(text: string): string {
  return `  - ${text}`;
}

export function kv(key: string, value: string | number): string {
  return `  ${key.padEnd(14)} ${value}`;
}
