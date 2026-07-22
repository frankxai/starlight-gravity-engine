/**
 * Executable human-sovereignty guardrails.
 *
 * The Gravity Engine stores *observable context*, never speculative
 * psychoanalysis. These detectors turn the CANON rules ("agents never infer
 * attraction, diagnosis, hidden intent or relationship value") into code that
 * capture uses to refuse, and that evals assert against.
 */

export type SpeculationCategory =
  | 'attraction'
  | 'diagnosis'
  | 'hidden-intent'
  | 'ranking'
  | 'relative-worth';

export interface SpeculationFlag {
  category: SpeculationCategory;
  match: string;
  pattern: string;
}

const RULES: ReadonlyArray<{ category: SpeculationCategory; re: RegExp }> = [
  {
    category: 'attraction',
    re: /\b(attracted to|has a crush|crushing on|in love with|romantically interested)\b/i,
  },
  {
    category: 'diagnosis',
    re: /\b(depressed|bipolar|narcissist(?:ic)?|sociopath(?:ic)?|autistic|adhd|ocd|ptsd)\b/i,
  },
  {
    category: 'hidden-intent',
    re: /\b(secretly (?:wants|plans|hopes)|hidden agenda|really means|actually wants|ulterior motive)\b/i,
  },
  {
    category: 'ranking',
    re: /\b(?:rank(?:s|ed|ing)?|tier|rating)\b[^.]*\b(?:above|below|higher|lower|top|bottom|1st|2nd)\b/i,
  },
  {
    category: 'relative-worth',
    re: /\b(?:more|less) (?:important|valuable|worthy|useful) than\b/i,
  },
];

/** Return every speculation the text trips. Empty array means observable. */
export function detectSpeculation(text: string): SpeculationFlag[] {
  const flags: SpeculationFlag[] = [];
  for (const rule of RULES) {
    const m = rule.re.exec(text);
    if (m) {
      flags.push({ category: rule.category, match: m[0], pattern: rule.re.source });
    }
  }
  return flags;
}

/** True when the text records something observed, not something inferred. */
export function isObservable(text: string): boolean {
  return detectSpeculation(text).length === 0;
}
