import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeGravity, reliabilityForce, type FieldSnapshot } from '../src/gravity.ts';
import { draftProvenance, type Commitment, type Direction, type Signal } from '../src/schemas.ts';

const NOW = new Date('2026-07-22T12:00:00.000Z');

function emptyField(): FieldSnapshot {
  return {
    direction: null,
    signals: [],
    commitments: [],
    rooms: [],
    introductions: [],
    artifacts: [],
    now: NOW,
  };
}

const direction: Direction = {
  id: 'dir_1',
  statement: 'Compound encounters into opportunity',
  themes: ['agentic', 'sovereignty'],
  values: ['generosity'],
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

function signal(id: string, capturedAt: string): Signal {
  return {
    id,
    content: 'insight',
    themes: [],
    strength: 'notable',
    score: 0.6,
    relatedPeople: [],
    provenance: draftProvenance('t', capturedAt),
  };
}

test('empty field scores zero', () => {
  const g = computeGravity(emptyField());
  assert.equal(g.score, 0);
  assert.equal(g.forces.direction, 0);
});

test('direction force rewards themes and values', () => {
  const g = computeGravity({ ...emptyField(), direction });
  assert.equal(g.forces.direction, 1);
});

test('reliability is neutral with no track record', () => {
  assert.equal(reliabilityForce([], NOW), 0.5);
});

test('overdue open commitments erode reliability', () => {
  const overdue: Commitment = {
    id: 'c1',
    description: 'send deck',
    owner: 'me',
    artifact: 'deck',
    dueDate: '2026-07-01T00:00:00.000Z',
    status: 'open',
    createdAt: '2026-06-01T00:00:00.000Z',
    provenance: draftProvenance('t', '2026-06-01T00:00:00.000Z'),
  };
  assert.equal(reliabilityForce([overdue], NOW), 0);
});

test('a well-tended field outscores a bare one', () => {
  const fulfilled: Commitment = {
    id: 'c2',
    description: 'sent essay',
    owner: 'me',
    artifact: 'essay',
    status: 'fulfilled',
    createdAt: '2026-07-01T00:00:00.000Z',
    provenance: draftProvenance('t', '2026-07-01T00:00:00.000Z'),
  };
  const rich: FieldSnapshot = {
    direction,
    signals: [signal('s1', '2026-07-20T00:00:00.000Z'), signal('s2', '2026-07-21T00:00:00.000Z')],
    commitments: [fulfilled],
    rooms: [
      {
        id: 'r1',
        thesis: 'x',
        hostId: 'me',
        invitees: [],
        status: 'hosted',
        provenance: draftProvenance('t', '2026-07-10T00:00:00.000Z'),
      },
    ],
    introductions: [],
    artifacts: [],
    now: NOW,
  };
  const g = computeGravity(rich);
  assert.ok(g.score > 0, `expected positive score, got ${g.score}`);
  assert.equal(g.forces.reliability, 1);
});
