/**
 * Parse a human-edited DIRECTION.md into a Direction. This is what lets the
 * Markdown Starter and the Local Engine share one source of truth: the user
 * writes prose, the engine reads structure. Placeholder text (angle-bracketed
 * prompts) is treated as "unset".
 */
import { hashId } from './ids.ts';
import type { Direction } from './schemas.ts';

export interface ParsedDirection {
  statement: string;
  horizon?: string;
  themes: string[];
  values: string[];
}

function isPlaceholder(text: string): boolean {
  const t = text.trim();
  return t.length === 0 || t.startsWith('<') || t.startsWith('<!--');
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionBody(md: string, heading: string): string {
  // JS has no \Z; anchor the body on the next "## " heading or end-of-string.
  const re = new RegExp(
    `(?:^|\\n)##[ \\t]+${escapeRe(heading)}[ \\t]*\\r?\\n([\\s\\S]*?)(?=\\n##[ \\t]|$)`,
    'i',
  );
  const m = re.exec(md);
  return m?.[1]?.trim() ?? '';
}

function firstLine(body: string): string {
  const line = body.split(/\r?\n/).find((l) => l.trim().length > 0) ?? '';
  return line.trim();
}

function bullets(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, '').trim())
    .filter((l) => l.length > 0 && !isPlaceholder(l));
}

/** Parse markdown; empty statement means the file is still a template. */
export function parseDirectionMarkdown(md: string): ParsedDirection {
  const statementRaw = firstLine(sectionBody(md, 'Statement'));
  const horizonRaw = firstLine(sectionBody(md, 'Horizon'));
  const result: ParsedDirection = {
    statement: isPlaceholder(statementRaw) ? '' : statementRaw,
    themes: bullets(sectionBody(md, 'Themes')),
    values: bullets(sectionBody(md, 'Values')),
  };
  if (!isPlaceholder(horizonRaw)) result.horizon = horizonRaw;
  return result;
}

/** Build a full Direction record from parsed markdown, or null if unset. */
export function directionFromMarkdown(
  md: string,
  now: string,
  previous?: Direction | null,
): Direction | null {
  const parsed = parseDirectionMarkdown(md);
  if (parsed.statement.length === 0) return null;
  return {
    id: previous?.id ?? hashId('dir', parsed.statement),
    statement: parsed.statement,
    ...(parsed.horizon !== undefined ? { horizon: parsed.horizon } : {}),
    themes: parsed.themes,
    values: parsed.values,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
}
