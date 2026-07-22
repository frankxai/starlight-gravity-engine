import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAttestation, checkPublishable, SIP_VERSION } from '../src/attest.ts';
import { draftProvenance } from '../src/schemas.ts';

test('attestation block carries substrate, version and nodes', () => {
  const block = buildAttestation({
    verticals: ['gravity-engine'],
    nodes: ['Frank Riemer (Starlight)'],
    generatedAt: '2026-07-22',
  });
  assert.match(block, /Built on SIP/);
  assert.match(block, new RegExp(`v${SIP_VERSION.replace(/\./g, '\\.')}`));
  assert.match(block, /Verticals: \[gravity-engine\]/);
  assert.match(block, /Nodes: \[Frank Riemer \(Starlight\)\]/);
});

test('refuses to publish private, unapproved material', () => {
  const check = checkPublishable(draftProvenance('note', '2026-07-22T00:00:00.000Z'));
  assert.equal(check.ok, false);
  assert.equal(check.reasons.length, 3);
});

test('allows an approved, publishable, public artifact', () => {
  const check = checkPublishable({
    source: 'essay',
    capturedBy: 'human',
    capturedAt: '2026-07-22T00:00:00.000Z',
    dataClass: 'public',
    approval: 'approved',
    publishable: true,
  });
  assert.equal(check.ok, true);
  assert.equal(check.requiresAttribution, false);
});

test('publishable_with_attribution demands the attribution block', () => {
  const check = checkPublishable({
    source: 'essay',
    capturedBy: 'human',
    capturedAt: '2026-07-22T00:00:00.000Z',
    dataClass: 'publishable_with_attribution',
    approval: 'approved',
    publishable: true,
  });
  assert.equal(check.ok, true);
  assert.equal(check.requiresAttribution, true);
});
