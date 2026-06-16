# MusterDeck Legal Pages & Consent Design

Date: 2026-06-09
Author: Christoph Mayer with Claude
Status: Draft for review
Related issue: #11 (Legal / disclaimer page)

> **Legal-review caveat.** This spec covers how legal pages and a consent
> mechanism are *built and wired* into the app. The legal *text* it produces is
> AI-drafted starter content modeled on common compliance patterns. It is **not
> legal advice** and must be reviewed by a qualified human before MusterDeck
> relies on it in production. Every shipped page carries a visible
> "Draft — pending legal review" banner until that review happens.

---

## Purpose

Give MusterDeck a real legal surface: a Privacy Policy, Terms of Service, and a
fan-project Disclaimer, plus a working cookie/tracking consent mechanism. The
work must be mindful of a worldwide user base concentrated in the EU and North
America.

This closes the dead footer links (`Privacy Policy`, `Terms of Service` in
`AppFrame.tsx` currently render as no-op `<button>`s) and resolves issue #11.

## Background / current state

- **No third-party tracking exists today.** No analytics or marketing SDKs in
  `src/` or `package.json`. Client storage is limited to the Supabase auth
  session and functional `localStorage` (member-role and current-viewer keys in
  `App.tsx`). These are strictly-necessary and **exempt from consent** under
  GDPR/ePrivacy.
- The fan-project disclaimer text already exists as `fanProjectDisclaimer` in
  `src/lib/foundationCopy.ts` and renders in the footer.
- Routing is a custom typed system: route IDs are a union in
  `src/lib/foundationTypes.ts` (`FoundationRouteId`), listed in
  `src/lib/appNavigation.ts` (`appRoutes`), and rendered by
  `if (foundationRoute === 'x')` branches in `src/App.tsx`. There is no
  react-router.
- The signup form shows "I agree to the Terms of Service and Privacy Policy"
  (`foundationCopy.auth.terms`) with nothing to link to.

## Scope

In scope:
1. Three public, no-login legal pages: Privacy, Terms, Disclaimer.
2. AI-drafted, GDPR/ePrivacy/CCPA-CPRA/PIPEDA-aware content, marked as draft.
3. A granular, opt-in cookie/tracking consent banner with withdrawal.
4. Disclosure of the platform's own automation/bots in the privacy content.

Out of scope (explicitly):
- The Discord call-recording → Whisper transcription flow. Confirmed as
  Christoph's internal operations, **not** a user-facing product feature. The
  site privacy policy does not describe it.
- Actual integration of any analytics tracker. The consent banner is built
  ahead of need; only the Essential category is actually used today.
- Final, lawyer-approved legal text. Everything ships as reviewable draft.

## Decomposition (three parts, two PRs)

This is a small epic. Parts 1 and 3 ship together (Part 3 is content inside
Part 1's module, no separate UI); Part 2 is its own branch → PR. Each PR follows
CONTRIBUTING.md.

### Part 1 — Legal pages + content (closes #11)
- New route IDs `privacy`, `terms`, `legal` added to `FoundationRouteId`.
- New `appRoutes` entries: `public: true`, `requiresAuth: false`.
- New render branches in `App.tsx` wrapping a shared `LegalPage` shell in
  `AppFrame`.
- New component `src/components/foundation/LegalPage.tsx` — a presentational
  shell that renders a structured legal document (title, last-updated date,
  draft banner, sectioned body) from data.
- New content module `src/lib/legalContent.ts` — the actual document text as
  structured data (sections with headings + paragraphs/lists), so copy can be
  updated without touching JSX (satisfies #11's "updated whenever the legal
  posture changes").
- Footer wiring in `AppFrame.tsx`: the `Privacy Policy` and `Terms of Service`
  buttons call `onRouteChange('privacy' | 'terms')`; add a `Disclaimer` link.
- The signup "Terms / Privacy" note becomes linkable to the same routes.

### Part 2 — Consent management (the banner)
- `src/components/foundation/ConsentBanner.tsx` — first-visit banner with
  Accept all / Reject all / Customize, and a categories panel.
- Categories: **Essential** (always on, locked), **Functional**, **Analytics**.
  Non-essential default **off** (GDPR opt-in). Honest copy notes only Essential
  is currently in use.
- `src/lib/useConsent.ts` — a hook + lightweight store reading/writing a
  versioned consent record in `localStorage`
  (`md-consent` → `{ version, timestamp, categories }`).
- A `ConsentProvider` (or module store) so future tracker-loading code can gate
  on `consent.analytics === true`.
- Footer "Cookie preferences" link reopens the categories panel so users can
  withdraw/change consent at any time (GDPR withdrawal requirement).
- Consent version bump re-prompts users when categories materially change.

### Part 3 — Bot & automation disclosure
- No separate UI. Folds into the Part 1 privacy content as a section.
- Discloses the platform's own automation acting on user data/accounts:
  ship-catalog sync (#79), anti-abuse/moderation, Discord/CI automation. States
  the site does not consent-gate legitimate operational automation but is
  transparent about it; addresses third-party AI crawlers/scrapers via a Terms
  clause (and a future `robots` policy, noted but not built here).

## Architecture detail

### Routes
Add to `FoundationRouteId` union: `'privacy' | 'terms' | 'legal'`.
Add to `appRoutes`:
```
{ id: 'privacy', label: 'Privacy Policy', public: true, requiresAuth: false, buildPriority: 'build_now' }
{ id: 'terms',   label: 'Terms of Service', public: true, requiresAuth: false, buildPriority: 'build_now' }
{ id: 'legal',   label: 'Disclaimer', public: true, requiresAuth: false, buildPriority: 'build_now' }
```
These are reachable by guests (no auth gate), satisfying #11's "accessible
without login." They are footer-linked, not added to primary nav.

### LegalPage component contract
- Input: a `LegalDocument` object `{ id, title, lastUpdated, isDraft, intro, sections[] }`.
- `sections[]`: `{ heading, blocks[] }` where a block is a paragraph or a list.
- Renders inside `AppFrame` so header/footer/nav are consistent.
- Pure presentational; no data fetching. Content comes from `legalContent.ts`.

### Consent storage schema
```
localStorage["md-consent"] = {
  version: 1,
  timestamp: <ISO string>,
  categories: { essential: true, functional: boolean, analytics: boolean }
}
```
- Absence of the key → banner shows, nothing non-essential runs.
- `essential` is always `true` and cannot be toggled off.
- A bump to `version` invalidates prior consent and re-prompts.

## Content plan

### Privacy Policy
Data inventory (what is actually collected): account email, Supabase-hashed
password, display name, optional RSI handle, and in-app operational data the
user creates. Usage/functional `localStorage`. No analytics today.
Covers: what is collected and why, lawful bases (GDPR Art. 6 — consent and
legitimate interest), retention, security, data-subject rights (access,
rectification, erasure, portability, objection, restriction), CCPA/CPRA notice
(categories, right to know/delete/correct, "we do not sell or share personal
information"), PIPEDA accountability/consent, sub-processors (Supabase, Netlify,
Discord), cookies/essential-only statement, children's data, international
transfer note, contact for requests, and "last updated" + change policy.

### Terms of Service
Acceptable use, account responsibilities, user-generated content and operational
records (S.P.O.I.L.S. values are organizer-managed records, not guarantees —
consistent with the brand posture), fan-project / no-warranty / limitation of
liability, automated-access (bot/scraper) clause, termination, governing law
placeholder (to be set during legal review), and changes-to-terms.

### Disclaimer
Built from the existing `fanProjectDisclaimer`: independent fan tool, not
affiliated with / endorsed by Cloud Imperium Games or Roberts Space Industries;
Star Citizen marks belong to their owners. Satisfies #11's required language.

### Voice
Legal copy follows the locked brand voice guide
(`docs/superpowers/specs/2026-05-20-musterdeck-brand-voice-guide.md`) where
compatible with legal precision — plain, direct, no fake-rank theatrics — but
defers to clarity and accuracy over style in binding sections.

## Error handling / edge cases
- **No JavaScript / SSR:** pages are client-rendered like the rest of the app;
  acceptable for an internal-tool MVP. Noted, not solved here.
- **localStorage blocked/unavailable:** consent store fails safe — treat as "no
  consent given," show banner, run only Essential. Never throw.
- **Consent version change:** re-prompt rather than silently honoring stale
  choices.
- **Direct deep-link to a legal route while logged out:** must render (public
  route), not redirect to login.

## Testing / validation
Per #11 acceptance plus standard checks:
- `npx tsc --noEmit` and `npm run build` pass; routes render.
- Each legal page reachable from the footer **and** while logged out.
- Disclaimer includes the required fan-made / not-affiliated / not-endorsed
  language.
- Consent banner: appears on first visit, non-essential default off, choices
  persist, "Cookie preferences" reopens and can withdraw, nothing non-essential
  runs without opt-in.
- Manual verification in local dev for each criterion.

## Open questions
1. Governing-law / jurisdiction for the Terms — needs a human decision during
   legal review (left as an explicit placeholder).
2. Data-request contact address — which inbox handles GDPR/CCPA requests?
3. Whether to add a `robots`/AI-crawler policy file alongside the Terms clause
   (noted as future work, not in this spec).

## Sequencing
Part 1 first (unblocks the dead footer links and closes #11), then Part 2
(consent), then Part 3 folds its content into Part 1's module (can land with
Part 1 if content is ready). Each part is a separate PR to `main`.
