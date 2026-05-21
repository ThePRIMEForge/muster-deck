# MusterDeck Project Operating Rules

Date: 2026-05-21

## Purpose

These rules keep MusterDeck organized across chats, planning, copywriting, mockups, implementation, and deployable builds.

Use this file with:

- `docs/handoff/2026-05-20-project-organization-guide.md`
- `docs/handoff/project-change-log.md`
- `docs/handoff/2026-05-20-start-here-next-chat.md`
- `docs/superpowers/specs/2026-05-20-musterdeck-brand-voice-guide.md`

## Copy Quality Rules

Before writing product copy, UI copy, landing-page copy, notification copy, or admin text:

1. Read or reference the current brand voice guide.
2. Write in MusterDeck voice: operational, concise, grounded, and useful to combat and non-combat crews.
3. Run an anti-AI-writing pass before saving:
   - Remove generic SaaS phrases such as `seamless`, `unlock`, `empower`, `transform`, `next-level`, and `all-in-one` unless there is a concrete reason.
   - Remove fluffy claims that do not tell the user what the product does.
   - Replace vague verbs with concrete actions: `join`, `assign`, `approve`, `lock`, `settle`, `review`, `report in`.
   - Avoid over-balanced slogan patterns where every sentence sounds like a template.
   - Avoid hype punctuation and exclamation points in product UI.
   - Avoid official-sounding Star Citizen claims.
   - Avoid promising payout, safety, success, verification, affiliation, or endorsement.
4. Check that support, logistics, industrial, medical, salvage, mining, cargo, FPS, and command users are treated as first-class.
5. Keep legal and trust language plain, careful, and explicit.

If copy feels clever but does not help the user act, rewrite it.

## Documentation Folder Rules

Use the smallest useful document type:

- `docs/handoff/` for concise current context, operating rules, change logs, and session summaries.
- `docs/superpowers/specs/` for feature/product specs that may become implementation plans.
- `docs/superpowers/plans/` for task-by-task implementation plans.
- `docs/mockups/` for active mockups and visual proof sheets.
- `docs/mockups/assets/` for mockup/reference assets and asset manifests.
- `docs/archive/` for superseded but meaningful work.
- `outputs/` for generated exports, screenshots, workbooks, temporary packages, and previews.

Do not scatter Markdown files at the repo root unless a tool requires a root-level file.

## Version History Rules

Important work should be committed in coherent groups:

- Product decisions and handoff docs.
- Specs.
- Implementation plans.
- Code changes.
- Mockup changes.
- Asset/source tracking changes.
- Deployment/package manifests.

Do not mix unrelated product docs, mockup experiments, and production code in one commit unless they are part of one reviewed decision.

Before starting implementation work, clean up or deliberately preserve existing uncommitted work so a later commit is easy to understand.

## Archive And Reference Rules

Archive meaningful old work instead of deleting it.

When archiving:

1. Move the item into the right `docs/archive/` subfolder.
2. Add or update a local `README.md` explaining why it was archived and what replaced it.
3. Add a change-log entry when the archived item was part of a real decision path.

Reference materials should stay separate from production code:

- Fan-kit source folders remain source references until a production asset policy says otherwise.
- User-supplied references stay under `docs/mockups/assets/` or another clearly named reference folder.
- Production-ready assets move into `src/assets/` only after approval, optimization, and attribution/source tracking.

## Context And Chat Hygiene

Start a new clean chat when work changes into a different major mode:

- Product strategy or naming decisions.
- Visual exploration/mockup review.
- Backend schema/data work.
- Frontend implementation.
- Deployment/release packaging.
- Bug investigation.
- Large review or cleanup pass.

Stay in the same chat when the work is one continuous thread with the same active files and decisions.

Before starting a new chat, create or update a handoff file in `docs/handoff/` with:

- Current goal.
- Branch and git status.
- Files changed.
- Decisions made.
- Open decisions.
- Next recommended action.
- Links to the key docs the next chat should read first.

Use `docs/handoff/2026-05-20-start-here-next-chat.md` as the current model for consolidated handoffs.

## Periodic Review Rules

Periodically review the documentation tree so context does not sprawl.

Recommended cadence:

- After each major session: update the change log and a short handoff note if needed.
- After each feature plan: check whether specs/plans are still current.
- Before implementation: identify active docs versus archived references.
- Before deployment: summarize current scope, required files, environment variables, migrations, and known limitations.
- After several chats on the same area: create one consolidated `start-here` handoff and archive or de-emphasize older handoffs.

The goal is not to document everything. The goal is to preserve decisions and make the next session fast.

## Major Decision Rules

Record major decisions in `docs/handoff/project-change-log.md`.

Major decisions include:

- Product or pillar naming.
- Scope changes.
- Auth/trust model changes.
- Data model changes.
- Visual direction changes.
- Asset licensing or source decisions.
- Deployment target changes.
- Archive/revival of meaningful work.
- Decisions that affect multiple future tasks.

Each entry should include:

- Decision.
- Reason.
- Files affected.
- Follow-up.

## Deployable Folder And Package Rules

Do not create deployable folders, release zips, or deployment packages until we explicitly decide a build is ready to package.

When a deployable package is needed:

1. Keep deployable source clean. Include only files required for the app, build, configuration, migrations, and runtime docs.
2. Keep generated zip files and temporary package previews in `outputs/deployments/`, not mixed into `src/`, `docs/mockups/`, or repo root.
3. Add a package manifest that lists:
   - Package date and target.
   - Source branch/commit.
   - Build command.
   - Required environment variables.
   - Included folders.
   - Explicitly excluded folders.
   - Known limitations.
4. Do not copy full fan-kit downloads, unused mockup assets, archived work, raw research captures, or generated screenshots into deployable packages.
5. Prefer deployment tools that build from the clean repo source. Use zip/package folders only when the deployment target requires them.

Before packaging, run the relevant build/test checks and inspect the file list for accidental bulky or private material.

## Default Next-Step Discipline

Before moving from planning into code:

1. Check the current branch and working tree.
2. Confirm the active spec or plan.
3. Confirm whether a new clean chat is useful.
4. Confirm whether the work belongs in production code, mockups, docs, scripts, outputs, or archive.
5. Record any new major decision before implementation depends on it.
