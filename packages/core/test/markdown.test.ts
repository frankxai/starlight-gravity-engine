import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDirectionMarkdown, directionFromMarkdown } from '../src/markdown.ts';

const FILLED = `# DIRECTION

## Statement

Turn meaningful encounters into compounding opportunity.

## Horizon

The next 12 months

## Themes

- local-first
- agentic systems
- sovereignty

## Values

- generosity
- reliability
`;

const TEMPLATE = `# DIRECTION

## Statement

<One sentence: the direction you are moving in.>

## Themes

- <theme>
`;

test('parses a filled DIRECTION.md', () => {
  const d = parseDirectionMarkdown(FILLED);
  assert.equal(d.statement, 'Turn meaningful encounters into compounding opportunity.');
  assert.equal(d.horizon, 'The next 12 months');
  assert.deepEqual(d.themes, ['local-first', 'agentic systems', 'sovereignty']);
  assert.deepEqual(d.values, ['generosity', 'reliability']);
});

test('treats placeholder text as unset', () => {
  const d = parseDirectionMarkdown(TEMPLATE);
  assert.equal(d.statement, '');
  assert.deepEqual(d.themes, []);
});

test('directionFromMarkdown returns null for a template', () => {
  assert.equal(directionFromMarkdown(TEMPLATE, '2026-07-22T00:00:00.000Z'), null);
});

test('directionFromMarkdown preserves id and createdAt across edits', () => {
  const first = directionFromMarkdown(FILLED, '2026-07-22T00:00:00.000Z');
  assert.ok(first);
  const second = directionFromMarkdown(FILLED, '2026-07-29T00:00:00.000Z', first);
  assert.equal(second!.id, first!.id);
  assert.equal(second!.createdAt, first!.createdAt);
  assert.equal(second!.updatedAt, '2026-07-29T00:00:00.000Z');
});
