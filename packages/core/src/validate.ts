/**
 * Dependency-free validation aligned with the JSON Schemas in `schemas/`.
 *
 * The engine ships with zero runtime dependencies so it runs on any machine
 * with Node 22+ and no install step. These small typed getters give us the
 * parse-don't-validate discipline (throw on bad input, return typed values)
 * without pulling in a schema library.
 */

export class ValidationError extends Error {
  readonly path: string;
  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = 'ValidationError';
    this.path = path;
  }
}

export type Obj = Record<string, unknown>;

export function asObject(v: unknown, path: string): Obj {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    throw new ValidationError(path, 'expected an object');
  }
  return v as Obj;
}

export function reqString(o: Obj, key: string, path: string): string {
  const v = o[key];
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new ValidationError(`${path}.${key}`, 'required non-empty string');
  }
  return v;
}

export function optString(o: Obj, key: string, path: string): string | undefined {
  const v = o[key];
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string') throw new ValidationError(`${path}.${key}`, 'expected string');
  return v;
}

export function strArray(o: Obj, key: string, path: string): string[] {
  const v = o[key];
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) {
    throw new ValidationError(`${path}.${key}`, 'expected string[]');
  }
  return v as string[];
}

export function boolField(o: Obj, key: string, path: string, fallback: boolean): boolean {
  const v = o[key];
  if (v === undefined || v === null) return fallback;
  if (typeof v !== 'boolean') throw new ValidationError(`${path}.${key}`, 'expected boolean');
  return v;
}

export function enumField<T extends string>(
  o: Obj,
  key: string,
  path: string,
  values: readonly T[],
  fallback?: T,
): T {
  const v = o[key];
  if ((v === undefined || v === null) && fallback !== undefined) return fallback;
  if (typeof v !== 'string' || !values.includes(v as T)) {
    throw new ValidationError(`${path}.${key}`, `expected one of: ${values.join(', ')}`);
  }
  return v as T;
}

/** Accepts an ISO-8601 timestamp (anything Date.parse understands round-trips). */
export function isoDate(o: Obj, key: string, path: string): string {
  const s = reqString(o, key, path);
  if (Number.isNaN(Date.parse(s))) {
    throw new ValidationError(`${path}.${key}`, 'expected an ISO-8601 date-time');
  }
  return s;
}
