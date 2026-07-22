import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeCommitment,
  normalizeIntroduction,
  normalizePersonContext,
  normalizeSignal,
  draftProvenance,
} from '../src/schemas.ts';
import { ValidationError } from '../src/validate.ts';

const prov = draftProvenance('field-note', '2026-07-22T19:00:00.000Z');

test('normalizeSignal clamps score into 0..1 and fills defaults', () => {
  const s = normalizeSignal({ id: 's1', content: 'x', score: 9, provenance: prov });
  assert.equal(s.score, 1);
  assert.equal(s.strength, 'notable');
  assert.deepEqual(s.themes, []);
});

test('normalizeSignal rejects missing content', () => {
  assert.throws(() => normalizeSignal({ id: 's1', provenance: prov }), ValidationError);
});

test('person context drops any smuggled ranking field', () => {
  const p = normalizePersonContext({
    id: 'p1',
    displayName: 'Ada',
    observableContext: ['ships local-first tools'],
    rank: 1,
    score: 99,
    provenance: prov,
  });
  assert.ok(!('rank' in p));
  assert.ok(!('score' in p));
  assert.deepEqual(Object.keys(p).sort(), [
    'displayName',
    'id',
    'observableContext',
    'provenance',
    'tags',
  ]);
});

test('commitment requires a named artifact', () => {
  assert.throws(
    () =>
      normalizeCommitment({
        id: 'c1',
        description: 'do a thing',
        owner: 'me',
        createdAt: '2026-07-22T19:00:00.000Z',
        provenance: prov,
      }),
    ValidationError,
  );
});

test('an introduction cannot reach "made" without dual consent', () => {
  const base = {
    id: 'i1',
    personAId: 'p_a',
    personBId: 'p_b',
    rationale: 'both building the same thing',
    provenance: prov,
  };
  // Shortcut is forbidden.
  assert.throws(
    () =>
      normalizeIntroduction({
        ...base,
        status: 'made',
        consentA: 'approved',
        consentB: 'proposed',
      }),
    ValidationError,
  );
  // With both approved, it is allowed.
  const ok = normalizeIntroduction({
    ...base,
    status: 'made',
    consentA: 'approved',
    consentB: 'approved',
  });
  assert.equal(ok.status, 'made');
});

test('provenance rejects an invalid data class', () => {
  assert.throws(
    () => normalizeSignal({ id: 's1', content: 'x', provenance: { ...prov, dataClass: 'nope' } }),
    ValidationError,
  );
});
