/**
 * Command handlers. Each returns a CommandResult so the dispatcher can render
 * either human text or --json. Handlers take an injectable context (store, now,
 * stdin) so they are unit-testable without touching argv or the real clock.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import {
  buildAttestation,
  capture,
  checkPublishable,
  computeGravity,
  detectSpeculation,
  directionFromMarkdown,
  draftProvenance,
  hashId,
  type Artifact,
  type Commitment,
  type GravityForces,
  type GravityStore,
  type Room,
} from '@starlight-gravity/core';
import { bullet, heading, kv } from './output.ts';

export interface Flags {
  json?: boolean;
  dir?: string;
  help?: boolean;
  version?: boolean;
  owner?: string;
  force?: boolean;
  file?: string;
  note?: string;
  save?: boolean;
  thesis?: string;
  theme?: string;
  host?: string;
  fulfil?: string;
  artifact?: string;
  title?: string;
  body?: string;
  vertical?: string[];
  node?: string[];
}

export interface CommandContext {
  store: GravityStore;
  projectDir: string;
  flags: Flags;
  positionals: string[];
  now: Date;
  readStdin: () => Promise<string>;
}

export interface CommandResult {
  code: number;
  data: unknown;
  lines: string[];
}

const DIRECTION_TEMPLATE = `# DIRECTION

> The gravity well. Fill this in first — every capture is scored against it.
> Delete the prompts and write in your own words.

## Statement

<One sentence: the direction you are moving in and inviting others toward.>

## Horizon

<Over what time frame? e.g. "the next 12 months">

## Themes

- <theme you want to become known for>
- <another>
- <another>

## Values

- <how you show up, e.g. generosity>
- <e.g. reliability>

<!--
After editing this file, register it:
  starlight-gravity capture --note "..."    # captures against these themes
Themes and values here directly raise the Direction force in your gravity score.
-->
`;

async function pathExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function fmtForces(forces: GravityForces): string[] {
  return Object.entries(forces).map(([k, v]) => kv(k, (v as number).toFixed(2)));
}

/**
 * Keep the stored Direction in sync with the human-edited DIRECTION.md.
 * A no-op while the file is still a template. Runs before commands that read
 * direction, so editing the markdown "just works" with no extra command.
 */
export async function syncDirection(ctx: CommandContext): Promise<void> {
  const file = join(ctx.projectDir, 'DIRECTION.md');
  if (!(await pathExists(file))) return;
  const md = await readFile(file, 'utf8');
  const prev = await ctx.store.getDirection();
  const next = directionFromMarkdown(md, ctx.now.toISOString(), prev);
  if (!next) return;
  const unchanged =
    prev !== null &&
    prev.statement === next.statement &&
    prev.horizon === next.horizon &&
    JSON.stringify(prev.themes) === JSON.stringify(next.themes) &&
    JSON.stringify(prev.values) === JSON.stringify(next.values);
  if (!unchanged) await ctx.store.setDirection(next);
}

export async function cmdInit(ctx: CommandContext): Promise<CommandResult> {
  const config = await ctx.store.init(ctx.flags.owner);
  const directionFile = join(ctx.projectDir, 'DIRECTION.md');
  let wroteDirection = false;
  if (ctx.flags.force || !(await pathExists(directionFile))) {
    await writeFile(directionFile, DIRECTION_TEMPLATE, 'utf8');
    wroteDirection = true;
  }
  return {
    code: 0,
    data: { storeRoot: ctx.store.root, directionFile, wroteDirection, config },
    lines: [
      heading('Gravity field initialized'),
      kv('store', ctx.store.root),
      kv('direction', `${directionFile}${wroteDirection ? ' (created)' : ' (kept existing)'}`),
      '',
      'Next:',
      bullet('Edit DIRECTION.md — your themes and values.'),
      bullet('Add a field note after your next real encounter.'),
      bullet('Run: starlight-gravity capture --file note.md'),
    ],
  };
}

export async function cmdCapture(ctx: CommandContext): Promise<CommandResult> {
  let note = ctx.flags.note ?? '';
  if (!note && ctx.flags.file) note = await readFile(ctx.flags.file, 'utf8');
  if (!note) note = (await ctx.readStdin()).trim();
  if (!note) {
    return {
      code: 2,
      data: { error: 'no note provided' },
      lines: ['No note provided. Use --note "...", --file path, or pipe text on stdin.'],
    };
  }

  const direction = await ctx.store.getDirection();
  const result = capture({
    note,
    direction,
    capturedAt: ctx.now.toISOString(),
    source: ctx.flags.file ? `field-note:${ctx.flags.file}` : 'field-note',
  });

  let saved = 0;
  if (ctx.flags.save) {
    for (const sig of result.signals) {
      await ctx.store.append('signals', sig);
      saved += 1;
    }
  }

  const lines: string[] = [heading('Capture')];
  if (result.guardrailFlags.length > 0) {
    lines.push('  ⚠ Held back as speculation (stored nothing):');
    for (const hit of result.guardrailFlags) {
      lines.push(bullet(`[${hit.flags.map((f) => f.category).join(', ')}] "${hit.line}"`));
    }
  }
  lines.push('');
  lines.push(
    `  Strongest signal: ${result.strongestSignal ? `"${result.strongestSignal.content}" (${result.strongestSignal.strength})` : '—'}`,
  );
  lines.push(
    `  Artifact opportunity: ${result.artifactOpportunity ? `${result.artifactOpportunity.kind} — "${result.artifactOpportunity.title}"` : '—'}`,
  );
  lines.push(`  Follow-through: ${result.followThrough ? result.followThrough.description : '—'}`);
  if (result.appreciationOrIntroduction?.type === 'introduction') {
    const i = result.appreciationOrIntroduction;
    lines.push(`  Introduction: ${i.personA} ↔ ${i.personB} (needs consent from both)`);
  } else if (result.appreciationOrIntroduction?.type === 'appreciation') {
    lines.push(`  Appreciation: thank ${result.appreciationOrIntroduction.person}`);
  } else {
    lines.push('  Appreciation/introduction: —');
  }
  lines.push(`  Room theme: ${result.roomTheme ? result.roomTheme.thesis : '—'}`);
  lines.push('');
  lines.push(
    saved > 0
      ? `  Saved ${saved} signal(s) as private_context (proposed). Nothing is published.`
      : '  Nothing saved. Re-run with --save to store signals (private by default).',
  );
  lines.push(
    '  Every suggestion above is yours to approve or decline. The engine never acts alone.',
  );

  return { code: 0, data: result, lines };
}

export async function cmdBrief(ctx: CommandContext): Promise<CommandResult> {
  const snap = await ctx.store.snapshot(ctx.now);
  const gravity = computeGravity(snap);
  const openCommitments = snap.commitments
    .filter((c) => c.status === 'open')
    .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  const recentSignals = [...snap.signals]
    .sort((a, b) => b.provenance.capturedAt.localeCompare(a.provenance.capturedAt))
    .slice(0, 5);
  const proposedRooms = snap.rooms.filter((r) => r.status === 'proposed');

  const lines: string[] = [heading('Daily brief')];
  lines.push(kv('gravity', `${gravity.score}/100`));
  lines.push(...fmtForces(gravity.forces));
  lines.push('');
  lines.push('  Open commitments:');
  if (openCommitments.length === 0) lines.push(bullet('none — clean slate'));
  for (const c of openCommitments) {
    const overdue = c.dueDate && Date.parse(c.dueDate) < ctx.now.getTime() ? ' (OVERDUE)' : '';
    lines.push(
      bullet(`${c.artifact} — ${c.description}${c.dueDate ? ` [due ${c.dueDate}]` : ''}${overdue}`),
    );
  }
  lines.push('');
  lines.push('  Recent signals:');
  if (recentSignals.length === 0) lines.push(bullet('none yet — capture a field note'));
  for (const s of recentSignals) lines.push(bullet(`(${s.strength}) ${s.content}`));
  if (proposedRooms.length > 0) {
    lines.push('');
    lines.push('  Rooms you proposed:');
    for (const r of proposedRooms) lines.push(bullet(r.thesis));
  }
  lines.push('');
  for (const note of gravity.notes) lines.push(`  → ${note}`);

  return {
    code: 0,
    data: { gravity, openCommitments, recentSignals, proposedRooms },
    lines,
  };
}

export async function cmdRoom(ctx: CommandContext): Promise<CommandResult> {
  const sub = ctx.positionals[1] ?? 'list';
  if (sub === 'propose') {
    if (!ctx.flags.thesis) {
      return {
        code: 2,
        data: { error: 'missing --thesis' },
        lines: ['room propose needs --thesis "..." (optionally --theme, --host).'],
      };
    }
    const room: Room = {
      id: hashId('room', ctx.flags.thesis),
      thesis: ctx.flags.thesis,
      ...(ctx.flags.theme ? { theme: ctx.flags.theme } : {}),
      hostId: ctx.flags.host ?? 'me',
      invitees: [],
      status: 'proposed',
      provenance: draftProvenance('cli:room-propose', ctx.now.toISOString()),
    };
    await ctx.store.append('rooms', room);
    return {
      code: 0,
      data: room,
      lines: [heading('Room proposed'), kv('id', room.id), kv('thesis', room.thesis)],
    };
  }
  const rooms = await ctx.store.rooms();
  const lines = [heading('Rooms')];
  if (rooms.length === 0)
    lines.push(bullet('none yet — propose one with `room propose --thesis "..."`'));
  for (const r of rooms) lines.push(bullet(`[${r.status}] ${r.thesis} (${r.id})`));
  return { code: 0, data: rooms, lines };
}

export async function cmdFollowThrough(ctx: CommandContext): Promise<CommandResult> {
  if (ctx.flags.fulfil) {
    const commitments = await ctx.store.commitments();
    const target = commitments.find((c) => c.id === ctx.flags.fulfil);
    if (!target) {
      return {
        code: 1,
        data: { error: 'not found', id: ctx.flags.fulfil },
        lines: [`No commitment with id ${ctx.flags.fulfil}.`],
      };
    }
    const updated: Commitment[] = commitments.map((c) =>
      c.id === target.id ? { ...c, status: 'fulfilled' as const } : c,
    );
    await ctx.store.replace('commitments', updated);
    return {
      code: 0,
      data: { fulfilled: target.id },
      lines: [
        heading('Commitment fulfilled'),
        kv('artifact', target.artifact),
        '  Reliability rises. Well done.',
      ],
    };
  }

  const commitments = (await ctx.store.commitments())
    .filter((c) => c.status === 'open')
    .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  const lines = [heading('Follow-through')];
  if (commitments.length === 0) lines.push(bullet('no open commitments'));
  for (const c of commitments) {
    const overdue = c.dueDate && Date.parse(c.dueDate) < ctx.now.getTime() ? ' (OVERDUE)' : '';
    lines.push(
      bullet(
        `${c.id} · ${c.artifact} — ${c.description}${c.dueDate ? ` [due ${c.dueDate}]` : ''}${overdue}`,
      ),
    );
  }
  if (commitments.length > 0) lines.push('  Fulfil one: follow-through --fulfil <id>');
  return { code: 0, data: commitments, lines };
}

export async function cmdPublish(ctx: CommandContext): Promise<CommandResult> {
  let artifact: Artifact | null = null;
  if (ctx.flags.artifact) {
    const artifacts = await ctx.store.artifacts();
    artifact = artifacts.find((a) => a.id === ctx.flags.artifact) ?? null;
    if (!artifact) {
      return {
        code: 1,
        data: { error: 'artifact not found', id: ctx.flags.artifact },
        lines: [`No artifact with id ${ctx.flags.artifact}.`],
      };
    }
  } else if (ctx.flags.title) {
    // A freshly-drafted artifact is private + proposed by design, so this path
    // demonstrates the refusal gate: you cannot publish something unapproved.
    artifact = {
      id: hashId('art', ctx.flags.title),
      title: ctx.flags.title,
      kind: 'note',
      ...(ctx.flags.body ? { body: ctx.flags.body } : {}),
      sourceSignals: [],
      sipAttested: false,
      provenance: draftProvenance('cli:publish', ctx.now.toISOString()),
    };
  } else {
    return {
      code: 2,
      data: { error: 'nothing to publish' },
      lines: ['publish needs --artifact <id> (approved) or --title "..." to dry-run the gate.'],
    };
  }

  const check = checkPublishable(artifact.provenance);
  if (!check.ok) {
    return {
      code: 1,
      data: { published: false, check },
      lines: [
        heading('Publish refused'),
        ...check.reasons.map((r) => bullet(r)),
        '',
        '  Publication is a human act. Set the data class to a publishable class,',
        '  approve the artifact, and mark it publishable — then re-run.',
      ],
    };
  }

  const attestation = buildAttestation({
    ...(ctx.flags.vertical ? { verticals: ctx.flags.vertical } : {}),
    ...(ctx.flags.node ? { nodes: ctx.flags.node } : {}),
    generatedAt: ctx.now.toISOString().slice(0, 10),
  });
  if (ctx.flags.artifact) {
    await ctx.store.append('artifacts', { ...artifact, sipAttested: true });
  }
  const lines = [heading('Publishable'), kv('title', artifact.title)];
  if (check.requiresAttribution) lines.push('  Attribution required — block below is mandatory.');
  if (check.requiresAnonymization) lines.push('  Anonymize identifying detail before publishing.');
  lines.push('', attestation);
  return { code: 0, data: { published: true, artifact: artifact.id, attestation }, lines };
}

interface ReviewRecord {
  date: string;
  score: number;
  forces: GravityForces;
}

export async function cmdReview(ctx: CommandContext): Promise<CommandResult> {
  const snap = await ctx.store.snapshot(ctx.now);
  const gravity = computeGravity(snap);
  const reviewsPath = join(ctx.store.root, 'reviews.json');

  let history: ReviewRecord[] = [];
  if (await pathExists(reviewsPath)) {
    const raw = JSON.parse(await readFile(reviewsPath, 'utf8')) as unknown;
    if (Array.isArray(raw)) history = raw as ReviewRecord[];
  }
  const last = history.at(-1) ?? null;
  const delta = last ? gravity.score - last.score : null;

  const record: ReviewRecord = {
    date: ctx.now.toISOString(),
    score: gravity.score,
    forces: gravity.forces,
  };
  history.push(record);
  await writeFile(reviewsPath, `${JSON.stringify(history, null, 2)}\n`, 'utf8');

  const nextAction: Record<string, string> = {
    direction: 'Clarify DIRECTION.md — statement, themes, values.',
    signal: 'Capture more encounters. Density and freshness both matter.',
    contribution: 'Keep one commitment, make one introduction, or ship one artifact this week.',
    convening: 'Host or synthesize one small room.',
    reliability: 'Close an overdue commitment before opening new ones.',
  };

  const lines = [heading('Weekly review')];
  lines.push(
    kv(
      'gravity',
      `${gravity.score}/100${delta !== null ? ` (${delta >= 0 ? '+' : ''}${delta} since last)` : ''}`,
    ),
  );
  lines.push(...fmtForces(gravity.forces));
  lines.push('');
  lines.push(kv('weakest', gravity.weakest));
  lines.push(`  → ${nextAction[gravity.weakest] ?? 'Strengthen your weakest force.'}`);
  return { code: 0, data: { gravity, delta, record }, lines };
}

export async function cmdDoctor(ctx: CommandContext): Promise<CommandResult> {
  const problems: string[] = [];
  const warnings: string[] = [];
  const lines = [heading('Doctor')];

  const major = Number(process.versions.node.split('.')[0] ?? '0');
  const nodeOk = major >= 22;
  lines.push(kv('node', `${process.versions.node} ${nodeOk ? 'OK' : '(needs >=22)'}`));
  if (!nodeOk) problems.push('Node.js 22+ required');

  const initialized = await ctx.store.isInitialized();
  lines.push(kv('store', initialized ? ctx.store.root : `${ctx.store.root} (not initialized)`));
  if (!initialized) {
    problems.push('store not initialized — run `starlight-gravity init`');
    return {
      code: 1,
      data: { problems, warnings },
      lines: [...lines, ...problems.map((p) => bullet(`ERROR: ${p}`))],
    };
  }

  let counts: Record<string, number> = {};
  try {
    const ex = await ctx.store.export();
    counts = {
      signals: ex.signals.length,
      people: ex.people.length,
      commitments: ex.commitments.length,
      rooms: ex.rooms.length,
      introductions: ex.introductions.length,
      artifacts: ex.artifacts.length,
    };
    for (const [k, v] of Object.entries(counts)) lines.push(kv(k, v));

    // Sovereignty checks.
    for (const p of ex.people) {
      for (const line of p.observableContext) {
        if (detectSpeculation(line).length > 0) {
          warnings.push(`person ${p.id} has speculative context: "${line}"`);
        }
      }
      if (p.provenance.dataClass === 'restricted' && p.provenance.publishable) {
        problems.push(`person ${p.id} is restricted but flagged publishable`);
      }
    }
    for (const a of ex.artifacts) {
      if (a.provenance.dataClass === 'restricted' && a.provenance.publishable) {
        problems.push(`artifact ${a.id} is restricted but flagged publishable`);
      }
    }
  } catch (err) {
    problems.push(`store integrity error: ${(err as Error).message}`);
  }

  for (const w of warnings) lines.push(bullet(`WARN: ${w}`));
  for (const p of problems) lines.push(bullet(`ERROR: ${p}`));
  if (problems.length === 0 && warnings.length === 0) lines.push('  All checks passed.');

  return { code: problems.length > 0 ? 1 : 0, data: { counts, problems, warnings }, lines };
}
