import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectSpeculation, isObservable } from '../src/guardrails.ts';

test('flags attraction inference', () => {
  const flags = detectSpeculation('I think she has a crush on the host');
  assert.equal(flags.length, 1);
  assert.equal(flags[0]?.category, 'attraction');
});

test('flags armchair diagnosis', () => {
  assert.equal(detectSpeculation('he seems bipolar')[0]?.category, 'diagnosis');
});

test('flags hidden-intent mind-reading', () => {
  assert.equal(detectSpeculation('she secretly wants my job')[0]?.category, 'hidden-intent');
});

test('flags ranking of people', () => {
  assert.equal(detectSpeculation('rank him below the others')[0]?.category, 'ranking');
});

test('flags relative-worth claims', () => {
  assert.equal(
    detectSpeculation('Ada is more important than Grace')[0]?.category,
    'relative-worth',
  );
});

test('observable notes pass clean', () => {
  assert.equal(isObservable('Ada shipped a local-first memory library last month'), true);
  assert.equal(isObservable('Grace asked about provenance and consent'), true);
});
