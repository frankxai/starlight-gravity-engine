/**
 * @starlight-gravity/core — the local-first engine underneath the Gravity Engine.
 * Zero runtime dependencies. Runs on Node 22+ with no install step.
 */
export * from './privacy.ts';
export * from './guardrails.ts';
export * from './ids.ts';
export * from './validate.ts';
export * from './schemas.ts';
export * from './markdown.ts';
export * from './gravity.ts';
export * from './capture.ts';
export * from './store.ts';
export * from './attest.ts';

export const CORE_VERSION = '0.1.0';
