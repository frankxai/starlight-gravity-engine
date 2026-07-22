/**
 * SIP attestation. Every artifact that composes ≥1 SIP element carries a
 * "Built on SIP" block. This module refuses to emit for material that has not
 * been explicitly approved and marked publishable — publication is a human act.
 */
import { isPublishableClass, requiresAttribution, requiresAnonymization } from './privacy.ts';
import type { Provenance } from './schemas.ts';

export const SIP_VERSION = '1.1.1';
export const SUBSTRATE_URL = 'starlightintelligence.org/protocol';

export interface AttestationInput {
  verticals?: string[];
  canon?: string[];
  nodes?: string[];
  generatedAt?: string;
}

/** Build the canonical "Built on SIP" block. */
export function buildAttestation(input: AttestationInput = {}): string {
  const verticals =
    input.verticals && input.verticals.length > 0 ? input.verticals : ['gravity-engine'];
  const canon = input.canon && input.canon.length > 0 ? input.canon : ['none'];
  const nodes = input.nodes && input.nodes.length > 0 ? input.nodes : ['@unpinned'];
  const generated = input.generatedAt ?? new Date().toISOString().slice(0, 10);
  return [
    '---',
    'Built on SIP — Starlight Intelligence Protocol',
    `- Substrate: ${SUBSTRATE_URL} v${SIP_VERSION}`,
    `- Verticals: [${verticals.join(', ')}]`,
    `- Canon: [${canon.join(', ')}]`,
    `- Nodes: [${nodes.join(', ')}]`,
    `Generated: ${generated}`,
    '---',
  ].join('\n');
}

export interface PublishCheck {
  ok: boolean;
  reasons: string[];
  requiresAttribution: boolean;
  requiresAnonymization: boolean;
}

/**
 * Gate a publish action. Returns ok=false with reasons unless the provenance is
 * a publishable class, explicitly approved, and flagged publishable.
 */
export function checkPublishable(provenance: Provenance): PublishCheck {
  const reasons: string[] = [];
  if (!isPublishableClass(provenance.dataClass)) {
    reasons.push(`data class '${provenance.dataClass}' is not publishable`);
  }
  if (provenance.approval !== 'approved') {
    reasons.push(`approval is '${provenance.approval}', not 'approved'`);
  }
  if (!provenance.publishable) {
    reasons.push('publishable flag is false');
  }
  return {
    ok: reasons.length === 0,
    reasons,
    requiresAttribution: requiresAttribution(provenance.dataClass),
    requiresAnonymization: requiresAnonymization(provenance.dataClass),
  };
}

/** Throws unless the provenance clears every publish gate. */
export function assertPublishable(provenance: Provenance): void {
  const check = checkPublishable(provenance);
  if (!check.ok) {
    throw new Error(`Refusing to publish: ${check.reasons.join('; ')}`);
  }
}
