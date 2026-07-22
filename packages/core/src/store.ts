/**
 * Local-first durable storage. One directory, plain JSON files, no cloud, no
 * account. The user owns the bytes; export and delete are first-class.
 */
import { mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import {
  NORMALIZERS,
  normalizeArtifact,
  normalizeCommitment,
  normalizeDirection,
  normalizeIntroduction,
  normalizePersonContext,
  normalizeRoom,
  normalizeSignal,
  type Artifact,
  type CollectionName,
  type Commitment,
  type Direction,
  type Introduction,
  type PersonContext,
  type Room,
  type Signal,
} from './schemas.ts';
import type { FieldSnapshot } from './gravity.ts';

export interface StoreConfig {
  version: string;
  createdAt: string;
  owner?: string;
}

export interface FieldExport {
  config: StoreConfig;
  direction: Direction | null;
  signals: Signal[];
  people: PersonContext[];
  commitments: Commitment[];
  rooms: Room[];
  introductions: Introduction[];
  artifacts: Artifact[];
}

const STORE_VERSION = '0.1.0';

const FILES: Record<CollectionName | 'direction' | 'config', string> = {
  config: 'config.json',
  direction: 'direction.json',
  signals: 'signals.json',
  people: 'people.json',
  commitments: 'commitments.json',
  rooms: 'rooms.json',
  introductions: 'introductions.json',
  artifacts: 'artifacts.json',
};

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export class GravityStore {
  readonly root: string;

  constructor(root: string) {
    this.root = root;
  }

  private path(file: string): string {
    return join(this.root, file);
  }

  private async readJson(file: string): Promise<unknown> {
    const p = this.path(file);
    if (!(await exists(p))) return undefined;
    const raw = await readFile(p, 'utf8');
    if (raw.trim().length === 0) return undefined;
    return JSON.parse(raw) as unknown;
  }

  private async writeJson(file: string, value: unknown): Promise<void> {
    await writeFile(this.path(file), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  }

  async isInitialized(): Promise<boolean> {
    return exists(this.path(FILES.config));
  }

  async init(owner?: string): Promise<StoreConfig> {
    await mkdir(this.root, { recursive: true });
    const existing = await this.readJson(FILES.config);
    if (existing) return existing as StoreConfig;
    const config: StoreConfig = {
      version: STORE_VERSION,
      createdAt: new Date().toISOString(),
      ...(owner ? { owner } : {}),
    };
    await this.writeJson(FILES.config, config);
    for (const name of [
      'signals',
      'people',
      'commitments',
      'rooms',
      'introductions',
      'artifacts',
    ] as const) {
      if (!(await exists(this.path(FILES[name])))) await this.writeJson(FILES[name], []);
    }
    return config;
  }

  async getConfig(): Promise<StoreConfig | null> {
    const raw = await this.readJson(FILES.config);
    return raw ? (raw as StoreConfig) : null;
  }

  async getDirection(): Promise<Direction | null> {
    const raw = await this.readJson(FILES.direction);
    return raw === undefined ? null : normalizeDirection(raw);
  }

  async setDirection(direction: Direction): Promise<void> {
    await this.writeJson(FILES.direction, normalizeDirection(direction));
  }

  private async readCollection<T>(
    name: CollectionName,
    normalize: (input: unknown, path?: string) => T,
  ): Promise<T[]> {
    const raw = await this.readJson(FILES[name]);
    if (raw === undefined) return [];
    if (!Array.isArray(raw)) throw new Error(`${FILES[name]} is not a JSON array`);
    return raw.map((item, i) => normalize(item, `${name}[${i}]`));
  }

  signals(): Promise<Signal[]> {
    return this.readCollection('signals', normalizeSignal);
  }
  people(): Promise<PersonContext[]> {
    return this.readCollection('people', normalizePersonContext);
  }
  commitments(): Promise<Commitment[]> {
    return this.readCollection('commitments', normalizeCommitment);
  }
  rooms(): Promise<Room[]> {
    return this.readCollection('rooms', normalizeRoom);
  }
  introductions(): Promise<Introduction[]> {
    return this.readCollection('introductions', normalizeIntroduction);
  }
  artifacts(): Promise<Artifact[]> {
    return this.readCollection('artifacts', normalizeArtifact);
  }

  /** Append an item, replacing any existing entry with the same id (idempotent). */
  async append<T extends { id: string }>(name: CollectionName, item: T): Promise<void> {
    const normalize = NORMALIZERS[name] as unknown as (input: unknown, path?: string) => T;
    const validated = normalize(item, name);
    const current = await this.readCollection<T>(name, normalize);
    const next = current.filter((x) => x.id !== validated.id);
    next.push(validated);
    await this.writeJson(FILES[name], next);
  }

  /** Replace an entire collection (used for status updates). */
  async replace<T extends { id: string }>(name: CollectionName, items: T[]): Promise<void> {
    const normalize = NORMALIZERS[name] as unknown as (input: unknown, path?: string) => T;
    await this.writeJson(
      FILES[name],
      items.map((it, i) => normalize(it, `${name}[${i}]`)),
    );
  }

  async snapshot(now: Date = new Date()): Promise<FieldSnapshot> {
    const [direction, signals, commitments, rooms, introductions, artifacts] = await Promise.all([
      this.getDirection(),
      this.signals(),
      this.commitments(),
      this.rooms(),
      this.introductions(),
      this.artifacts(),
    ]);
    return { direction, signals, commitments, rooms, introductions, artifacts, now };
  }

  /** Full local export — the user can walk away with their field at any time. */
  async export(): Promise<FieldExport> {
    const config = (await this.getConfig()) ?? {
      version: STORE_VERSION,
      createdAt: new Date().toISOString(),
    };
    const [direction, signals, people, commitments, rooms, introductions, artifacts] =
      await Promise.all([
        this.getDirection(),
        this.signals(),
        this.people(),
        this.commitments(),
        this.rooms(),
        this.introductions(),
        this.artifacts(),
      ]);
    return { config, direction, signals, people, commitments, rooms, introductions, artifacts };
  }

  /** Delete everything under the store root. Sovereignty includes the right to leave. */
  async destroy(): Promise<void> {
    await rm(this.root, { recursive: true, force: true });
  }
}
