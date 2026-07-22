/**
 * The gravity score.
 *
 *   Gravity = Direction × Signal × Contribution × Convening × Reliability
 *
 * Each force is normalized to 0..1 and multiplied, so the score is deliberately
 * unforgiving: a field with brilliant signal but zero reliability barely
 * registers. This mirrors the thesis — gravity compounds only when every force
 * is present. Agents raise the forces (memory, consistency, cycle frequency);
 * they never fabricate them.
 */
import type { Artifact, Commitment, Direction, Introduction, Room, Signal } from './schemas.ts';

export interface FieldSnapshot {
  direction: Direction | null;
  signals: Signal[];
  commitments: Commitment[];
  rooms: Room[];
  introductions: Introduction[];
  artifacts: Artifact[];
  now: Date;
}

export interface GravityForces {
  direction: number;
  signal: number;
  contribution: number;
  convening: number;
  reliability: number;
}

export interface GravityScore {
  score: number; // 0..100
  forces: GravityForces;
  weakest: keyof GravityForces;
  notes: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function daysBetween(a: Date, b: string): number {
  const t = Date.parse(b);
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return Math.abs(a.getTime() - t) / DAY_MS;
}

/** Clarity of aim. A field with no direction has no gravity well. */
export function directionForce(direction: Direction | null): number {
  if (!direction || direction.statement.trim().length === 0) return 0;
  let f = 0.6;
  if (direction.themes.length > 0) f += 0.2;
  if (direction.values.length > 0) f += 0.2;
  return clamp01(f);
}

/** Signal density and freshness over the trailing 30 days. */
export function signalForce(signals: Signal[], now: Date): number {
  if (signals.length === 0) return 0;
  const recent = signals.filter((s) => daysBetween(now, s.provenance.capturedAt) <= 30).length;
  const recency = Math.min(recent / 5, 1);
  const depth = Math.min(signals.length / 10, 1);
  return clamp01(recency * 0.7 + depth * 0.3);
}

/** Generosity turned into acts: kept commitments, made introductions, shipped artifacts. */
export function contributionForce(
  commitments: Commitment[],
  introductions: Introduction[],
  artifacts: Artifact[],
): number {
  const fulfilled = commitments.filter((c) => c.status === 'fulfilled').length;
  const introsMade = introductions.filter((i) => i.status === 'made').length;
  const shipped = artifacts.filter((a) => a.sipAttested || a.provenance.publishable).length;
  return clamp01((fulfilled + introsMade + shipped) / 5);
}

/** Rooms actually hosted or synthesized — the act of convening people. */
export function conveningForce(rooms: Room[]): number {
  const convened = rooms.filter((r) => r.status === 'hosted' || r.status === 'synthesized').length;
  return clamp01(convened / 2);
}

/** Do commitments get kept? Overdue-and-open commitments erode the field. */
export function reliabilityForce(commitments: Commitment[], now: Date): number {
  const fulfilled = commitments.filter((c) => c.status === 'fulfilled').length;
  const overdue = commitments.filter(
    (c) => c.status === 'open' && c.dueDate !== undefined && Date.parse(c.dueDate) < now.getTime(),
  ).length;
  const total = fulfilled + overdue;
  if (total === 0) return 0.5; // no track record yet — neutral, neither trusted nor broken
  return clamp01(fulfilled / total);
}

export function computeGravity(field: FieldSnapshot): GravityScore {
  const forces: GravityForces = {
    direction: directionForce(field.direction),
    signal: signalForce(field.signals, field.now),
    contribution: contributionForce(field.commitments, field.introductions, field.artifacts),
    convening: conveningForce(field.rooms),
    reliability: reliabilityForce(field.commitments, field.now),
  };

  const product =
    forces.direction * forces.signal * forces.contribution * forces.convening * forces.reliability;
  const score = Math.round(product * 100);

  const entries = Object.entries(forces) as Array<[keyof GravityForces, number]>;
  let weakest: keyof GravityForces = 'direction';
  let min = Number.POSITIVE_INFINITY;
  for (const [name, value] of entries) {
    if (value < min) {
      min = value;
      weakest = name;
    }
  }

  const notes: string[] = [];
  notes.push(`Weakest force: ${weakest} (${min.toFixed(2)}). Strengthen it to compound the rest.`);
  if (forces.direction === 0)
    notes.push('No direction set. Run `gravity init` and fill DIRECTION.md.');
  if (forces.reliability < 0.5 && forces.reliability !== 0.5) {
    notes.push('Open commitments are overdue. Close the loop before opening new ones.');
  }

  return { score, forces, weakest, notes };
}
