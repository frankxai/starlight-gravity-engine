import { createHash } from 'node:crypto';

/**
 * Deterministic content-addressed ids. Same inputs -> same id, so fixtures and
 * tests stay stable and re-running capture never duplicates an entity.
 */
export function hashId(prefix: string, ...parts: Array<string | number>): string {
  const digest = createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 10);
  return `${prefix}_${digest}`;
}
