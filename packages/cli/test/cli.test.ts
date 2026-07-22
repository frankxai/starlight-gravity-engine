import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GravityStore, draftProvenance, type Artifact } from '@starlight-gravity/core';
import { run } from '../src/cli.ts';
import { BufferWriter } from '../src/output.ts';

const NOW = new Date('2026-07-22T19:00:00.000Z');

async function withProject(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), 'gravity-cli-'));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function exec(
  dir: string,
  args: string[],
): Promise<{ code: number; out: string; json: () => unknown }> {
  const writer = new BufferWriter();
  return run(['--dir', dir, ...args], {
    now: NOW,
    writer,
    readStdin: async () => '',
  }).then((code) => ({
    code,
    out: writer.toString(),
    json: () => JSON.parse(writer.toString()) as unknown,
  }));
}

test('version prints and exits 0', async () => {
  const writer = new BufferWriter();
  const code = await run(['--version'], { writer });
  assert.equal(code, 0);
  assert.equal(writer.toString(), '0.1.0');
});

test('full lifecycle: init -> capture -> brief -> doctor', async () => {
  await withProject(async (dir) => {
    assert.equal((await exec(dir, ['init', '--owner', 'Frank'])).code, 0);

    const cap = await exec(dir, [
      'capture',
      '--note',
      "Met Ada at the local-first dinner. Big insight: sovereignty is the moat. I'll send Ada the essay by Friday. Also spoke with Grace.",
      '--save',
      '--json',
    ]);
    assert.equal(cap.code, 0);
    const capData = cap.json() as {
      signals: unknown[];
      appreciationOrIntroduction: { type: string };
    };
    assert.ok(capData.signals.length >= 1);
    assert.equal(capData.appreciationOrIntroduction.type, 'introduction');

    const brief = await exec(dir, ['brief', '--json']);
    assert.equal(brief.code, 0);
    const briefData = brief.json() as { recentSignals: unknown[] };
    assert.ok(briefData.recentSignals.length >= 1);

    const doctor = await exec(dir, ['doctor']);
    assert.equal(doctor.code, 0);
    assert.match(doctor.out, /All checks passed/);
  });
});

test('editing DIRECTION.md raises the direction force', async () => {
  await withProject(async (dir) => {
    await exec(dir, ['init']);
    await writeFile(
      join(dir, 'DIRECTION.md'),
      '# DIRECTION\n\n## Statement\n\nCompound encounters into opportunity.\n\n## Themes\n\n- sovereignty\n\n## Values\n\n- generosity\n',
      'utf8',
    );
    const brief = await exec(dir, ['brief', '--json']);
    const data = brief.json() as { gravity: { forces: { direction: number } } };
    assert.equal(data.gravity.forces.direction, 1);
  });
});

test('publish refuses unapproved material', async () => {
  await withProject(async (dir) => {
    await exec(dir, ['init']);
    const res = await exec(dir, ['publish', '--title', 'A private thought']);
    assert.equal(res.code, 1);
    assert.match(res.out, /refused/i);
  });
});

test('publish emits a SIP block for an approved artifact', async () => {
  await withProject(async (dir) => {
    await exec(dir, ['init']);
    const store = new GravityStore(join(dir, '.gravity'));
    const artifact: Artifact = {
      id: 'art_demo',
      title: 'On local-first memory',
      kind: 'essay',
      sourceSignals: [],
      sipAttested: false,
      provenance: {
        ...draftProvenance('essay', NOW.toISOString()),
        dataClass: 'public',
        approval: 'approved',
        publishable: true,
      },
    };
    await store.append('artifacts', artifact);

    const res = await exec(dir, ['publish', '--artifact', 'art_demo', '--node', 'Frank Riemer']);
    assert.equal(res.code, 0);
    assert.match(res.out, /Built on SIP/);
  });
});

test('follow-through fulfils a commitment and improves reliability', async () => {
  await withProject(async (dir) => {
    await exec(dir, ['init']);
    const store = new GravityStore(join(dir, '.gravity'));
    await store.append('commitments', {
      id: 'cmt_1',
      description: 'send the essay',
      owner: 'me',
      artifact: 'essay',
      status: 'open',
      createdAt: NOW.toISOString(),
      provenance: draftProvenance('cli', NOW.toISOString()),
    });
    const res = await exec(dir, ['follow-through', '--fulfil', 'cmt_1']);
    assert.equal(res.code, 0);
    const after = await store.commitments();
    assert.equal(after[0]?.status, 'fulfilled');
  });
});
