import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capture } from '../src/capture.ts';
import type { Direction } from '../src/schemas.ts';

const direction: Direction = {
  id: 'dir_1',
  statement: 'Turn encounters into compounding opportunity',
  themes: ['local-first', 'sovereignty'],
  values: ['generosity'],
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

const NOTE = `Met Ada at the local-first dinner. Big insight: sovereignty is the real moat for agentic systems.
I'll send Ada the draft essay by Friday.
Also spoke with Grace about the same theme.
She has a crush on the host.`;

const input = {
  note: NOTE,
  direction,
  capturedAt: '2026-07-22T19:00:00.000Z',
  source: 'field-note:test',
};

test('extracts both named people and proposes an introduction', () => {
  const r = capture(input);
  assert.deepEqual(r.people.sort(), ['Ada', 'Grace']);
  assert.equal(r.appreciationOrIntroduction?.type, 'introduction');
});

test('never captures the two names as one blob', () => {
  const r = capture(input);
  assert.ok(!r.people.some((p) => p.includes(' at ') || p.includes(' about ')));
});

test('refuses to store speculation but still records the flag', () => {
  const r = capture(input);
  assert.ok(r.guardrailFlags.some((g) => g.flags.some((f) => f.category === 'attraction')));
  assert.ok(!r.signals.some((s) => /crush/i.test(s.content)));
});

test('produces a strongest signal aligned to a direction theme', () => {
  const r = capture(input);
  assert.ok(r.strongestSignal);
  assert.ok(r.strongestSignal!.themes.includes('sovereignty'));
});

test('extracts a follow-through from a promise', () => {
  const r = capture(input);
  assert.ok(r.followThrough);
  assert.match(r.followThrough!.description, /send Ada/);
});

test('every output defaults to private + proposed (nothing auto-published)', () => {
  const r = capture(input);
  for (const s of r.signals) {
    assert.equal(s.provenance.dataClass, 'private_context');
    assert.equal(s.provenance.approval, 'proposed');
    assert.equal(s.provenance.publishable, false);
  }
});

test('is deterministic: identical input yields identical signal ids', () => {
  const a = capture(input);
  const b = capture(input);
  assert.deepEqual(
    a.signals.map((s) => s.id),
    b.signals.map((s) => s.id),
  );
});
