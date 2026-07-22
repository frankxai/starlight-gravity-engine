/**
 * Deterministic field-note capture.
 *
 * The Markdown Starter mode hands a field note to any capable AI agent. The
 * Local Engine runs THIS instead — a dependency-free heuristic extractor that
 * turns a raw note into structured suggestions without a model or the cloud.
 * Same contract, same five outputs; this one is deterministic and offline.
 *
 * It never invents. Every output is a suggestion carrying private-by-default
 * provenance and `approval: 'proposed'`. The human approves or declines each.
 */
import { detectSpeculation, type SpeculationFlag } from './guardrails.ts';
import { hashId } from './ids.ts';
import { draftProvenance, type Direction, type Signal, type SignalStrength } from './schemas.ts';

export interface CaptureInput {
  note: string;
  direction?: Direction | null;
  capturedAt?: string;
  capturedBy?: string;
  source?: string;
}

export interface ArtifactOpportunity {
  title: string;
  kind: 'essay' | 'note' | 'thread' | 'brief';
  fromSignalId: string | null;
  rationale: string;
}

export interface FollowThrough {
  description: string;
  artifact: string;
  rationale: string;
}

export type AppreciationOrIntroduction =
  | { type: 'appreciation'; person: string; rationale: string }
  | { type: 'introduction'; personA: string; personB: string; rationale: string };

export interface RoomThemeSuggestion {
  thesis: string;
  theme: string;
  rationale: string;
}

export interface GuardrailHit {
  line: string;
  flags: SpeculationFlag[];
}

export interface CaptureResult {
  signals: Signal[];
  strongestSignal: Signal | null;
  artifactOpportunity: ArtifactOpportunity | null;
  followThrough: FollowThrough | null;
  appreciationOrIntroduction: AppreciationOrIntroduction | null;
  roomTheme: RoomThemeSuggestion | null;
  people: string[];
  guardrailFlags: GuardrailHit[];
}

const INSIGHT_WORDS =
  /\b(idea|insight|learned|realized|realised|pattern|thesis|opportunity|question|principle|hypothesis|because|so that|what if|the key is)\b/i;

const COMMITMENT_RE =
  /\b(i'?ll|i will|i promised|let me|i'?ll send|follow up|circle back|send (?:them|him|her|over|the|my)|share (?:the|my|a)|intro(?:duce)? (?:you|them))\b/i;

// Case-explicit triggers so the name capture group stays strictly
// capitalized — a global /i flag would let [A-Z] match lowercase words.
const PERSON_RE =
  /(?:[Mm]et|[Ww]ith|[Tt]alked to|[Ss]poke with|[Ii]ntroduced to|[Ss]aw)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;

const HANDLE_RE = /(^|\s)(@[a-z0-9_]{2,})/gi;

const STRENGTH_BANDS: Array<{ min: number; strength: SignalStrength }> = [
  { min: 0.75, strength: 'strong' },
  { min: 0.45, strength: 'notable' },
  { min: 0, strength: 'weak' },
];

function toStrength(score: number): SignalStrength {
  for (const band of STRENGTH_BANDS) {
    if (score >= band.min) return band.strength;
  }
  return 'weak';
}

function splitLines(note: string): string[] {
  return note
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, '').trim())
    .filter((l) => l.length > 0);
}

function splitSentences(note: string): string[] {
  return note
    .replace(/\r?\n/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractPeople(note: string): string[] {
  const found = new Set<string>();
  for (const m of note.matchAll(PERSON_RE)) {
    const name = m[1]?.trim();
    if (name) found.add(name);
  }
  for (const m of note.matchAll(HANDLE_RE)) {
    const handle = m[2]?.trim();
    if (handle) found.add(handle);
  }
  return [...found];
}

function scoreLine(line: string, direction: Direction | null): number {
  let score = 0.2;
  if (INSIGHT_WORDS.test(line)) score += 0.35;
  if (line.length > 40) score += 0.1;
  if (/[?]/.test(line)) score += 0.1;
  const themes = direction?.themes ?? [];
  for (const theme of themes) {
    if (theme.length > 2 && new RegExp(`\\b${escapeRe(theme)}\\b`, 'i').test(line)) {
      score += 0.2;
    }
  }
  return Math.max(0, Math.min(1, score));
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchedThemes(line: string, direction: Direction | null): string[] {
  const themes = direction?.themes ?? [];
  return themes.filter((t) => t.length > 2 && new RegExp(`\\b${escapeRe(t)}\\b`, 'i').test(line));
}

function firstWords(text: string, n: number): string {
  return text
    .split(/\s+/)
    .slice(0, n)
    .join(' ')
    .replace(/[.,;:]+$/, '');
}

function firstSentence(text: string): string {
  const m = /^(.*?[.!?])(\s|$)/.exec(text);
  return (m?.[1] ?? text).trim();
}

/** Run the deterministic capture over a field note. */
export function capture(input: CaptureInput): CaptureResult {
  const capturedAt = input.capturedAt ?? new Date().toISOString();
  const capturedBy = input.capturedBy ?? 'human';
  const source = input.source ?? 'field-note';
  const direction = input.direction ?? null;

  const lines = splitLines(input.note);
  const sentences = splitSentences(input.note);

  // Guardrails: refuse to turn speculation into stored context.
  const guardrailFlags: GuardrailHit[] = [];
  const cleanLines: string[] = [];
  for (const line of lines) {
    const flags = detectSpeculation(line);
    if (flags.length > 0) guardrailFlags.push({ line, flags });
    else cleanLines.push(line);
  }

  const people = extractPeople(input.note);

  // Signals: score clean lines, keep the meaningful ones, strongest first.
  const scored = cleanLines
    .map((line) => ({ line, score: scoreLine(line, direction) }))
    .filter((s) => s.score >= 0.35)
    .sort((a, b) => b.score - a.score);

  const signals: Signal[] = scored.map(({ line, score }) => ({
    id: hashId('sig', line, capturedAt),
    content: line,
    themes: matchedThemes(line, direction),
    strength: toStrength(score),
    score,
    relatedPeople: people,
    provenance: draftProvenance(source, capturedAt, capturedBy, 'private_context'),
  }));

  const strongestSignal = signals[0] ?? null;

  // Artifact opportunity from the strongest signal.
  let artifactOpportunity: ArtifactOpportunity | null = null;
  if (strongestSignal) {
    const content = strongestSignal.content;
    let kind: ArtifactOpportunity['kind'] = 'note';
    if (/\b(thread|post|tweet|X )\b/i.test(content)) kind = 'thread';
    else if (/\b(essay|write|article|piece)\b/i.test(content)) kind = 'essay';
    else if (/\b(brief|memo|proposal|plan)\b/i.test(content)) kind = 'brief';
    artifactOpportunity = {
      title: firstWords(firstSentence(content), 12),
      kind,
      fromSignalId: strongestSignal.id,
      rationale: 'Your strongest signal is the seed of a shareable artifact.',
    };
  }

  // Follow-through from commitment-shaped sentences.
  let followThrough: FollowThrough | null = null;
  const promise = sentences.find((s) => COMMITMENT_RE.test(s) && detectSpeculation(s).length === 0);
  if (promise) {
    followThrough = {
      description: promise,
      artifact: firstWords(promise.replace(COMMITMENT_RE, '').trim(), 6) || 'follow-up',
      rationale: 'A promise made in the room. Name the artifact and the date.',
    };
  }

  // Appreciation or introduction, depending on how many people appear.
  let appreciationOrIntroduction: AppreciationOrIntroduction | null = null;
  if (people.length >= 2) {
    const [a, b] = [people[0] as string, people[1] as string];
    appreciationOrIntroduction = {
      type: 'introduction',
      personA: a,
      personB: b,
      rationale: `${a} and ${b} both appear in this encounter — a possible introduction, with consent from both.`,
    };
  } else if (people.length === 1) {
    appreciationOrIntroduction = {
      type: 'appreciation',
      person: people[0] as string,
      rationale: `A specific, timely thank-you to ${people[0]} strengthens the relationship.`,
    };
  }

  // Room theme from the dominant direction theme, else the strongest signal.
  let roomTheme: RoomThemeSuggestion | null = null;
  const themeCounts = new Map<string, number>();
  for (const sig of signals) {
    for (const t of sig.themes) themeCounts.set(t, (themeCounts.get(t) ?? 0) + 1);
  }
  const topTheme = [...themeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (topTheme) {
    roomTheme = {
      thesis: `A small room on ${topTheme} — the people in this note plus two you trust.`,
      theme: topTheme,
      rationale: 'This theme recurs across your signals; a room turns it into a network.',
    };
  } else if (strongestSignal) {
    roomTheme = {
      thesis: `A conversation around: ${firstWords(strongestSignal.content, 8)}`,
      theme: 'emerging',
      rationale: 'No recurring theme yet — start from your strongest signal.',
    };
  }

  return {
    signals,
    strongestSignal,
    artifactOpportunity,
    followThrough,
    appreciationOrIntroduction,
    roomTheme,
    people,
    guardrailFlags,
  };
}
