#!/usr/bin/env node
/**
 * schemas:validate — the schema gate.
 *
 * 1. Loads every schema in /schemas and structurally sanity-checks it.
 * 2. Ships a compact, dependency-free JSON Schema validator (the subset the
 *    contracts use) and validates canonical example instances against it.
 * 3. Cross-checks each example through the real core normalizer, so the
 *    declarative contract (/schemas) and the runtime code (packages/core) can
 *    never silently drift apart.
 * 4. Asserts the sovereignty guarantee structurally: person-context must reject
 *    a ranking/score field via additionalProperties:false.
 *
 * Zero dependencies. Runs on Node 22+ with no install (native TS stripping
 * loads the core modules directly).
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  normalizeDirection,
  normalizeSignal,
  normalizePersonContext,
  normalizeCommitment,
  normalizeRoom,
  normalizeIntroduction,
  normalizeArtifact,
} from '../packages/core/src/index.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMA_DIR = join(ROOT, 'schemas');
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

// ---- compact JSON Schema validator (draft 2020-12 subset) -------------------

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (Number.isInteger(v)) return 'integer';
  return typeof v;
}

function resolveRef(ref, root) {
  const parts = ref
    .slice(1)
    .split('/')
    .filter(Boolean)
    .map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~'));
  let node = root;
  for (const part of parts) {
    if (node && typeof node === 'object') node = node[part];
    else return undefined;
  }
  return node;
}

function matchesType(v, t) {
  const a = typeOf(v);
  if (t === 'number') return a === 'number' || a === 'integer';
  return a === t;
}

function check(schema, value, path, root, errors) {
  if (typeof schema.$ref === 'string') {
    const target = resolveRef(schema.$ref, root);
    if (!target) return errors.push({ path, message: `unresolved $ref ${schema.$ref}` });
    return check(target, value, path, root, errors);
  }
  if ('const' in schema && JSON.stringify(schema.const) !== JSON.stringify(value)) {
    errors.push({ path, message: `must equal ${JSON.stringify(schema.const)}` });
  }
  if (
    Array.isArray(schema.enum) &&
    !schema.enum.some((e) => JSON.stringify(e) === JSON.stringify(value))
  ) {
    errors.push({ path, message: `must be one of ${JSON.stringify(schema.enum)}` });
  }
  if (typeof schema.type === 'string' && !matchesType(value, schema.type)) {
    errors.push({ path, message: `expected ${schema.type}, got ${typeOf(value)}` });
    return;
  }
  const kind = typeOf(value);
  if (kind === 'string') {
    if (typeof schema.minLength === 'number' && value.length < schema.minLength)
      errors.push({ path, message: `shorter than minLength ${schema.minLength}` });
    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength)
      errors.push({ path, message: `longer than maxLength ${schema.maxLength}` });
    if (typeof schema.pattern === 'string' && !new RegExp(schema.pattern).test(value))
      errors.push({ path, message: `does not match ${schema.pattern}` });
    if (schema.format === 'date-time' && !ISO.test(value))
      errors.push({ path, message: 'not an ISO 8601 date-time' });
  }
  if (kind === 'number' || kind === 'integer') {
    if (typeof schema.minimum === 'number' && value < schema.minimum)
      errors.push({ path, message: `less than minimum ${schema.minimum}` });
    if (typeof schema.maximum === 'number' && value > schema.maximum)
      errors.push({ path, message: `greater than maximum ${schema.maximum}` });
  }
  if (kind === 'array') {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems)
      errors.push({ path, message: `fewer than minItems ${schema.minItems}` });
    if (schema.items && typeof schema.items === 'object')
      value.forEach((item, i) => check(schema.items, item, `${path}[${i}]`, root, errors));
  }
  if (kind === 'object') {
    const props = schema.properties ?? {};
    if (Array.isArray(schema.required))
      for (const key of schema.required)
        if (!(key in value)) errors.push({ path: `${path}.${key}`, message: 'is required' });
    for (const [key, sub] of Object.entries(props))
      if (key in value) check(sub, value[key], `${path}.${key}`, root, errors);
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value))
        if (!(key in props))
          errors.push({ path: `${path}.${key}`, message: 'is not an allowed property' });
    } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      for (const key of Object.keys(value))
        if (!(key in props))
          check(schema.additionalProperties, value[key], `${path}.${key}`, root, errors);
    }
  }
}

function validate(schema, data) {
  const errors = [];
  check(schema, data, '', schema, errors);
  return { valid: errors.length === 0, errors };
}

// ---- fixtures ---------------------------------------------------------------

const provenance = {
  source: 'field-note',
  capturedBy: 'Frank',
  capturedAt: '2026-07-22T19:00:00.000Z',
  dataClass: 'private_context',
};

const EXAMPLES = {
  'direction.schema.json': {
    normalize: normalizeDirection,
    value: {
      id: 'dir_1',
      statement: 'Turn encounters into compounding opportunity.',
      horizon: '12 months',
      themes: ['local-first', 'sovereignty'],
      values: ['generosity', 'reliability'],
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
    },
  },
  'signal.schema.json': {
    normalize: normalizeSignal,
    value: {
      id: 'sig_1',
      content: 'Sovereignty is the real moat for agentic systems.',
      themes: ['sovereignty'],
      strength: 'strong',
      score: 0.85,
      relatedPeople: ['Ada'],
      provenance,
    },
  },
  'person-context.schema.json': {
    normalize: normalizePersonContext,
    value: {
      id: 'p_ada',
      displayName: 'Ada',
      observableContext: ['Building local-first tooling', 'Spoke at the dinner'],
      tags: ['local-first'],
      provenance,
    },
  },
  'commitment.schema.json': {
    normalize: normalizeCommitment,
    value: {
      id: 'c_1',
      description: 'Send Ada the draft essay on local-first memory.',
      owner: 'me',
      artifact: 'draft essay on local-first memory',
      dueDate: '2026-07-25T00:00:00.000Z',
      status: 'open',
      createdAt: '2026-07-22T19:00:00.000Z',
      provenance,
    },
  },
  'room.schema.json': {
    normalize: normalizeRoom,
    value: {
      id: 'r_1',
      thesis: 'A small room on local-first sovereignty.',
      theme: 'local-first',
      hostId: 'me',
      invitees: ['p_ada'],
      status: 'proposed',
      provenance,
    },
  },
  'introduction.schema.json': {
    normalize: normalizeIntroduction,
    value: {
      id: 'i_1',
      personAId: 'p_ada',
      personBId: 'p_grace',
      rationale: 'Both are building local-first memory; a warm intro serves each.',
      consentA: 'proposed',
      consentB: 'proposed',
      status: 'proposed',
      provenance,
    },
  },
  'artifact.schema.json': {
    normalize: normalizeArtifact,
    value: {
      id: 'a_1',
      title: 'Local-first memory is the real moat',
      kind: 'essay',
      sourceSignals: ['sig_1'],
      sipAttested: false,
      provenance,
    },
  },
};

// ---- run --------------------------------------------------------------------

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`  ✗ ${msg}`);
};
const pass = (msg) => console.log(`  ✓ ${msg}`);

const files = (await readdir(SCHEMA_DIR)).filter((f) => f.endsWith('.schema.json')).sort();
console.log(`Validating ${files.length} schemas in /schemas\n`);

const schemas = {};
for (const file of files) {
  const raw = await readFile(join(SCHEMA_DIR, file), 'utf8');
  let schema;
  try {
    schema = JSON.parse(raw);
  } catch (err) {
    fail(`${file}: invalid JSON — ${err.message}`);
    continue;
  }
  schemas[file] = schema;
  for (const key of ['$schema', '$id', 'title', 'type']) {
    if (!(key in schema)) fail(`${file}: missing top-level '${key}'`);
  }
  if (schema.type === 'object' && schema.additionalProperties !== false) {
    fail(`${file}: object schemas must set additionalProperties:false`);
  }
}

console.log('\nSchema structure:');
if (Object.keys(schemas).length === files.length)
  pass(`${files.length} schemas parsed and structured`);

console.log('\nCanonical examples (schema + normalizer agree):');
for (const [file, { value, normalize }] of Object.entries(EXAMPLES)) {
  const schema = schemas[file];
  if (!schema) {
    fail(`${file}: schema not found for example`);
    continue;
  }
  const { valid, errors } = validate(schema, value);
  if (!valid) {
    fail(
      `${file}: example failed schema — ${errors.map((e) => `${e.path} ${e.message}`).join('; ')}`,
    );
    continue;
  }
  try {
    normalize(value);
  } catch (err) {
    fail(`${file}: example failed core normalizer — ${err.message}`);
    continue;
  }
  pass(`${file}`);
}

console.log('\nSovereignty guard (structural):');
{
  const schema = schemas['person-context.schema.json'];
  const withRanking = { ...EXAMPLES['person-context.schema.json'].value, score: 0.9, tier: 'A' };
  const { valid } = validate(schema, withRanking);
  if (valid) fail('person-context accepted a ranking field (score/tier) — sovereignty breach');
  else pass('person-context rejects ranking/score fields (additionalProperties:false)');
}

console.log('');
if (failures > 0) {
  console.error(`FAILED: ${failures} schema check(s) failed.`);
  process.exit(1);
}
console.log('All schema checks passed.');
