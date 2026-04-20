/**
 * Crisis keyword detection. If text matches, API can return showCrisisModal + resources.
 * Does NOT log or store content; used only to trigger UI and attach crisis payload.
 */

const CRISIS_PATTERNS = [
  /\b(kill myself|suicide|ending my life|want to die|end it all)\b/i,
  /\b(self[- ]harm|cutting|hurting myself)\b/i,
  /\b(overdose|poison)\s+(myself|me)\b/i,
  /\b(no reason to live|better off dead)\b/i,
  /\b(plan(ning)?\s+to\s+(die|end|kill))\b/i,
  /\b(988|suicide\s+hotline)\b/i,
];

export function detectCrisisKeywords(text) {
  if (!text || typeof text !== 'string') return false;
  const normalized = text.trim();
  if (!normalized.length) return false;
  return CRISIS_PATTERNS.some((re) => re.test(normalized));
}

export function getCrisisPayload(crisisResources = []) {
  return {
    showCrisisModal: true,
    message:
      'If you or someone you know is in crisis, please reach out to one of the resources below. This app is not emergency services.',
    resources: crisisResources,
  };
}
