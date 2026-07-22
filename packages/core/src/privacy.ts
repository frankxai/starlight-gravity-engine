/**
 * Data classes are the sovereignty spine. Every signal and artifact carries one.
 * They are ordered from most open to most closed. Private conversations default
 * to `private_context`; nothing becomes publishable without an explicit change.
 */
export const DATA_CLASSES = [
  'public',
  'publishable_with_attribution',
  'publishable_anonymized',
  'private_context',
  'restricted',
] as const;

export type DataClass = (typeof DATA_CLASSES)[number];

export const APPROVAL_STATES = ['proposed', 'approved', 'declined'] as const;
export type ApprovalState = (typeof APPROVAL_STATES)[number];

const PUBLISHABLE_CLASSES: ReadonlySet<DataClass> = new Set<DataClass>([
  'public',
  'publishable_with_attribution',
  'publishable_anonymized',
]);

/** A data class MAY be published (subject to approval). */
export function isPublishableClass(dc: DataClass): boolean {
  return PUBLISHABLE_CLASSES.has(dc);
}

/** Publishing this class requires a visible attribution block. */
export function requiresAttribution(dc: DataClass): boolean {
  return dc === 'publishable_with_attribution';
}

/** Publishing this class requires stripping identifying detail first. */
export function requiresAnonymization(dc: DataClass): boolean {
  return dc === 'publishable_anonymized';
}
