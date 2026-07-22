/**
 * Entity types and normalizers for the Gravity Engine.
 *
 * Each `normalize*` function parses untrusted input (a JSON file on disk, an
 * agent's output) into a typed, validated record — or throws ValidationError.
 * These mirror the JSON Schemas in `schemas/`; the two are kept in sync by the
 * fixtures round-trip test.
 */
import { APPROVAL_STATES, DATA_CLASSES, type ApprovalState, type DataClass } from './privacy.ts';
import {
  asObject,
  boolField,
  enumField,
  isoDate,
  optString,
  reqString,
  strArray,
  ValidationError,
  type Obj,
} from './validate.ts';

/** Provenance travels with every signal and artifact. It is the audit trail. */
export interface Provenance {
  source: string;
  capturedBy: string;
  capturedAt: string;
  dataClass: DataClass;
  approval: ApprovalState;
  publishable: boolean;
}

export function normalizeProvenance(input: unknown, path = 'provenance'): Provenance {
  const o = asObject(input, path);
  return {
    source: reqString(o, 'source', path),
    capturedBy: reqString(o, 'capturedBy', path),
    capturedAt: isoDate(o, 'capturedAt', path),
    dataClass: enumField(o, 'dataClass', path, DATA_CLASSES),
    approval: enumField(o, 'approval', path, APPROVAL_STATES, 'proposed'),
    publishable: boolField(o, 'publishable', path, false),
  };
}

export interface Direction {
  id: string;
  statement: string;
  horizon?: string;
  themes: string[];
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export function normalizeDirection(input: unknown, path = 'direction'): Direction {
  const o = asObject(input, path);
  const horizon = optString(o, 'horizon', path);
  return {
    id: reqString(o, 'id', path),
    statement: reqString(o, 'statement', path),
    ...(horizon !== undefined ? { horizon } : {}),
    themes: strArray(o, 'themes', path),
    values: strArray(o, 'values', path),
    createdAt: isoDate(o, 'createdAt', path),
    updatedAt: isoDate(o, 'updatedAt', path),
  };
}

export const SIGNAL_STRENGTHS = ['weak', 'notable', 'strong'] as const;
export type SignalStrength = (typeof SIGNAL_STRENGTHS)[number];

export interface Signal {
  id: string;
  content: string;
  encounterId?: string;
  themes: string[];
  strength: SignalStrength;
  score: number;
  relatedPeople: string[];
  provenance: Provenance;
}

export function normalizeSignal(input: unknown, path = 'signal'): Signal {
  const o = asObject(input, path);
  const encounterId = optString(o, 'encounterId', path);
  const rawScore = o['score'];
  const score = typeof rawScore === 'number' ? Math.max(0, Math.min(1, rawScore)) : 0.5;
  return {
    id: reqString(o, 'id', path),
    content: reqString(o, 'content', path),
    ...(encounterId !== undefined ? { encounterId } : {}),
    themes: strArray(o, 'themes', path),
    strength: enumField(o, 'strength', path, SIGNAL_STRENGTHS, 'notable'),
    score,
    relatedPeople: strArray(o, 'relatedPeople', path),
    provenance: normalizeProvenance(o['provenance'], `${path}.provenance`),
  };
}

/**
 * Observable context about a person. NEVER a ranking or a psychological
 * profile — only what was observed and consented to. The absence of a score or
 * tier field here is a load-bearing sovereignty guarantee.
 */
export interface PersonContext {
  id: string;
  displayName: string;
  observableContext: string[];
  tags: string[];
  firstMet?: string;
  lastContact?: string;
  provenance: Provenance;
}

export function normalizePersonContext(input: unknown, path = 'person'): PersonContext {
  const o = asObject(input, path);
  const firstMet = optString(o, 'firstMet', path);
  const lastContact = optString(o, 'lastContact', path);
  return {
    id: reqString(o, 'id', path),
    displayName: reqString(o, 'displayName', path),
    observableContext: strArray(o, 'observableContext', path),
    tags: strArray(o, 'tags', path),
    ...(firstMet !== undefined ? { firstMet } : {}),
    ...(lastContact !== undefined ? { lastContact } : {}),
    provenance: normalizeProvenance(o['provenance'], `${path}.provenance`),
  };
}

export const COMMITMENT_STATES = ['open', 'fulfilled', 'released'] as const;
export type CommitmentState = (typeof COMMITMENT_STATES)[number];

/** A commitment names an artifact and (optionally) a date — never a vague intention. */
export interface Commitment {
  id: string;
  description: string;
  owner: string; // "me" or a person id
  counterpartyId?: string;
  artifact: string;
  dueDate?: string;
  status: CommitmentState;
  createdAt: string;
  provenance: Provenance;
}

export function normalizeCommitment(input: unknown, path = 'commitment'): Commitment {
  const o = asObject(input, path);
  const counterpartyId = optString(o, 'counterpartyId', path);
  const dueDate = optString(o, 'dueDate', path);
  return {
    id: reqString(o, 'id', path),
    description: reqString(o, 'description', path),
    owner: reqString(o, 'owner', path),
    ...(counterpartyId !== undefined ? { counterpartyId } : {}),
    artifact: reqString(o, 'artifact', path),
    ...(dueDate !== undefined ? { dueDate } : {}),
    status: enumField(o, 'status', path, COMMITMENT_STATES, 'open'),
    createdAt: isoDate(o, 'createdAt', path),
    provenance: normalizeProvenance(o['provenance'], `${path}.provenance`),
  };
}

export const ROOM_STATES = ['proposed', 'scheduled', 'hosted', 'synthesized'] as const;
export type RoomState = (typeof ROOM_STATES)[number];

export interface Room {
  id: string;
  thesis: string;
  theme?: string;
  hostId: string;
  invitees: string[];
  scheduledFor?: string;
  status: RoomState;
  synthesis?: string;
  provenance: Provenance;
}

export function normalizeRoom(input: unknown, path = 'room'): Room {
  const o = asObject(input, path);
  const theme = optString(o, 'theme', path);
  const scheduledFor = optString(o, 'scheduledFor', path);
  const synthesis = optString(o, 'synthesis', path);
  return {
    id: reqString(o, 'id', path),
    thesis: reqString(o, 'thesis', path),
    ...(theme !== undefined ? { theme } : {}),
    hostId: reqString(o, 'hostId', path),
    invitees: strArray(o, 'invitees', path),
    ...(scheduledFor !== undefined ? { scheduledFor } : {}),
    status: enumField(o, 'status', path, ROOM_STATES, 'proposed'),
    ...(synthesis !== undefined ? { synthesis } : {}),
    provenance: normalizeProvenance(o['provenance'], `${path}.provenance`),
  };
}

export const INTRODUCTION_STATES = ['proposed', 'consented', 'made', 'declined'] as const;
export type IntroductionState = (typeof INTRODUCTION_STATES)[number];

/** An introduction requires explicit consent from BOTH people before it is made. */
export interface Introduction {
  id: string;
  personAId: string;
  personBId: string;
  rationale: string;
  consentA: ApprovalState;
  consentB: ApprovalState;
  status: IntroductionState;
  provenance: Provenance;
}

export function normalizeIntroduction(input: unknown, path = 'introduction'): Introduction {
  const o = asObject(input, path);
  const intro: Introduction = {
    id: reqString(o, 'id', path),
    personAId: reqString(o, 'personAId', path),
    personBId: reqString(o, 'personBId', path),
    rationale: reqString(o, 'rationale', path),
    consentA: enumField(o, 'consentA', path, APPROVAL_STATES, 'proposed'),
    consentB: enumField(o, 'consentB', path, APPROVAL_STATES, 'proposed'),
    status: enumField(o, 'status', path, INTRODUCTION_STATES, 'proposed'),
    provenance: normalizeProvenance(o['provenance'], `${path}.provenance`),
  };
  // Consent is structural (CANON §5): an introduction cannot advance to
  // 'consented' or 'made' unless BOTH parties have approved. The state machine
  // forbids the shortcut — this is the enforcement point.
  if (
    (intro.status === 'made' || intro.status === 'consented') &&
    (intro.consentA !== 'approved' || intro.consentB !== 'approved')
  ) {
    throw new ValidationError(
      `${path}.status`,
      `cannot be '${intro.status}' without approved consent from both parties`,
    );
  }
  return intro;
}

export const ARTIFACT_KINDS = ['essay', 'note', 'thread', 'deck', 'brief', 'other'] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

export interface Artifact {
  id: string;
  title: string;
  kind: ArtifactKind;
  body?: string;
  sourceSignals: string[];
  sipAttested: boolean;
  provenance: Provenance;
}

export function normalizeArtifact(input: unknown, path = 'artifact'): Artifact {
  const o = asObject(input, path);
  const body = optString(o, 'body', path);
  return {
    id: reqString(o, 'id', path),
    title: reqString(o, 'title', path),
    kind: enumField(o, 'kind', path, ARTIFACT_KINDS, 'note'),
    ...(body !== undefined ? { body } : {}),
    sourceSignals: strArray(o, 'sourceSignals', path),
    sipAttested: boolField(o, 'sipAttested', path, false),
    provenance: normalizeProvenance(o['provenance'], `${path}.provenance`),
  };
}

/** Helper to build a fresh, private-by-default provenance record. */
export function draftProvenance(
  source: string,
  capturedAt: string,
  capturedBy = 'human',
  dataClass: DataClass = 'private_context',
): Provenance {
  return {
    source,
    capturedBy,
    capturedAt,
    dataClass,
    approval: 'proposed',
    publishable: false,
  };
}

export type CollectionName =
  | 'signals'
  | 'people'
  | 'commitments'
  | 'rooms'
  | 'introductions'
  | 'artifacts';

export const NORMALIZERS = {
  signals: normalizeSignal,
  people: normalizePersonContext,
  commitments: normalizeCommitment,
  rooms: normalizeRoom,
  introductions: normalizeIntroduction,
  artifacts: normalizeArtifact,
} as const satisfies Record<CollectionName, (input: unknown, path?: string) => unknown>;
