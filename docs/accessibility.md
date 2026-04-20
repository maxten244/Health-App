# Accessibility (WCAG AA)

This document summarizes accessibility features and practices used in the Mental Health Check-in app to meet WCAG 2.1 Level AA where applicable.

## Skip link

- **Skip to main content**: A skip link is provided at the top of the page (`<a href="#main-content" class="skip-to-content">`). It becomes visible on keyboard focus so users can jump past the main navigation to the primary content.

## Keyboard navigation

- All interactive elements (links, buttons, form controls) are focusable and operable via keyboard.
- Tab order follows a logical flow. No keyboard traps.
- Modal (crisis) can be closed with Escape.

## Focus visibility

- Visible focus indicators are applied to links, buttons, and form controls via `:focus-visible` with a 3px outline (green for primary actions, distinct for crisis button).
- Outline offset is used so the indicator is clearly visible.

## ARIA and semantics

- **Landmarks**: `<main id="main-content">`, `<nav>`, `<footer>`, with `role` and `aria-label` where helpful.
- **Forms**: Labels associated with inputs via `htmlFor`/`id` or visible labels. Optional labels for screen readers use `visually-hidden` where the purpose is clear from context.
- **Mood slider**: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` (e.g. "Mood 5 out of 10").
- **Modal**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` and `aria-describedby` for title and disclaimer.
- **Loading**: Spinner has `role="status"` and `aria-live="polite"` with a visually hidden "Loading…" text.
- **Alerts**: Error and success messages use `role="alert"` or `role="status"` as appropriate.

## Color and contrast

- Text and background colors are chosen for sufficient contrast (aiming for at least 4.5:1 for normal text, 3:1 for large text).
- Information is not conveyed by color alone; icons or text support status (e.g. saved, error).

## Motion

- `prefers-reduced-motion: reduce` is respected: animations and transitions are disabled or minimized when the user has requested reduced motion.

## Responsive design

- Layout is responsive; content reflows for different viewport sizes.
- Touch targets are at least 44×44 px where practical.

## Crisis content

- Crisis button is always visible (fixed position) and clearly labeled ("In crisis? Get help").
- Crisis modal and crisis page include a clear disclaimer that the app is not emergency services and direct users to hotlines and emergency numbers.

## Testing recommendations

- Use a screen reader (e.g. NVDA, VoiceOver) to verify navigation and form labels.
- Navigate the app with keyboard only (Tab, Enter, Escape).
- Check contrast with a tool such as WebAIM Contrast Checker.
- Run an automated checker (e.g. axe DevTools, WAVE) and fix any reported issues.
