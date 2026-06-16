# MusterDeck Project Organization Guide

Date: 2026-05-20

## Purpose

Keep the project easy to navigate as the app grows. We should preserve useful old ideas without letting stale artifacts confuse future design and development work.

## Core Rules

1. Archive instead of deleting meaningful work.
2. Keep production app files separate from mockups and research.
3. Keep lightweight change logs for important product/design decisions.
4. Do not let archived concepts drive current implementation unless they are intentionally restored.
5. Build a deployment package only when the product direction and implementation are ready for that step.

For copy quality, chat handoff discipline, periodic context review, and deployable-package hygiene, also follow `docs/handoff/project-operating-rules.md`.

## Folder Roles

### `src/`

Production frontend source code.

Use for:

- React app code.
- Reusable UI components.
- App routes/views.
- Frontend domain logic.
- Production styles.

Avoid:

- One-off mockup HTML.
- Research notes.
- Archived experiments.

### `supabase/`

Production backend database and Supabase project files.

Use for:

- Migrations.
- Seed data.
- Generated SQL intended for database import.
- SQL tests and verification scripts.
- Supabase config.

Avoid:

- Temporary research exports.
- Manual notes that belong in `docs/`.

### `scripts/`

Repeatable project tooling.

Use for:

- Ship data sync scripts.
- Staffing template generation.
- Verification/test helpers.
- Import/export utilities.

Avoid:

- One-time scratch code unless it is under a clearly named temporary/archive folder.

### `docs/handoff/`

Current project context and decision records.

Use for:

- Project reset briefs.
- Backlog summaries.
- Organization guides.
- Change logs.
- Session handoffs.

Keep these files concise. They should summarize decisions and point to details, not duplicate every old conversation.

### `docs/superpowers/specs/`

Formal design specs.

Use for:

- Approved or under-review feature designs.
- Product requirements that are intended to become implementation plans.

### `docs/superpowers/plans/`

Implementation plans.

Use for:

- Step-by-step build plans after a spec is approved.

### `docs/mockups/`

Mockup-only artifacts.

Use for:

- Static HTML/CSS visual explorations.
- Throwaway prototypes.
- Design comparison pages.
- Screenshots or notes tied to mockup review.

Rules:

- Mockups here are not production app code.
- If a mockup becomes the chosen direction, extract the useful design decisions into a spec before implementation.
- If a mockup is superseded, move it to `docs/archive/mockups/` with a short note.
- Keep mockup image/font assets in `docs/mockups/assets/`.
- Track generated/imported visual assets in `docs/mockups/assets/ASSET-MANIFEST.md`.
- Treat broad inspiration boards as references only unless an asset has been explicitly approved for use.

### `docs/archive/`

Archived docs and old ideas.

Use for:

- Superseded mockups.
- Rejected design concepts.
- Older handoff files that are no longer current.
- Research that should be retained but not actively referenced.

Suggested subfolders:

- `docs/archive/mockups/`
- `docs/archive/specs/`
- `docs/archive/research/`
- `docs/archive/handoffs/`

Every archived item should keep a short note explaining why it was archived and what replaced it, if anything.

### `outputs/`

Generated artifacts and work products.

Use for:

- Spreadsheets.
- Workbook previews.
- Generated exports.
- Intermediate output folders.

Rules:

- Keep final useful artifacts at the top of a dated or named output folder.
- Keep scratch scripts/work files in a `work/` subfolder.
- Archive superseded outputs instead of deleting them when they contain useful history.

### `.firecrawl/`

External web research captures.

Use for:

- Scraped pages.
- Search output.
- Research source snapshots.

Rules:

- Keep research captures out of production code.
- Summarize useful findings into `docs/handoff/` or `docs/superpowers/specs/`.
- Archive old research captures when they are no longer actively needed.

### Fan Kit Asset Folders

Current folders:

- `Fankit_2025_11_19/`
- `RSI Star Citizen Fankit_2025_06_03/`

Use for:

- Source fan-kit assets.
- Fonts, logos, wallpapers, and reference media.

Rules:

- Do not modify original fan-kit source assets directly.
- If optimized/derived assets are needed, place them in a future production asset folder and document the source.
- Keep fan-kit guidelines and agreement PDFs with the source assets.

## Change Log Practice

Use `docs/handoff/project-change-log.md` for short decision entries.

Entry format:

```md
## YYYY-MM-DD - Short Decision Name

- Decision:
- Reason:
- Files affected:
- Follow-up:
```

Use the change log for:

- Naming decisions.
- Architecture decisions.
- Visual direction changes.
- Authentication model decisions.
- Major scope additions/removals.
- Archive moves.

Do not use the change log for:

- Every tiny code edit.
- Generated file noise.
- Temporary debugging notes.

## Archive Practice

When moving something to archive:

1. Create the relevant archive subfolder if missing.
2. Move the file without rewriting its contents.
3. Add or update a short `README.md` in that archive subfolder.
4. Add a change log entry if the archived item was meaningful.

Do not archive:

- Active source files.
- Current specs/plans.
- Required config.
- Current generated data needed by the app.

## Mockup Lifecycle

1. Create mockups in `docs/mockups/`.
2. Review visually with the user.
3. Record accepted direction in `docs/handoff/project-change-log.md`.
4. Convert accepted direction into a proper design spec.
5. Move superseded mockups to `docs/archive/mockups/` once they are no longer useful.

## Visual Asset Lifecycle

1. Plan the asset group in `docs/handoff/2026-05-20-musterdeck-visual-asset-plan.md`.
2. Add planned filenames to `docs/mockups/assets/ASSET-MANIFEST.md`.
3. Generate or import assets into `docs/mockups/assets/`.
4. Use assets in a contact sheet or focused mockup for review.
5. Mark each asset as approved, rejected, or production candidate in the manifest.
6. Archive rejected but meaningful asset experiments instead of deleting them.

## Deployment Package Rule

Do not create a deployment package until we explicitly decide the current build is ready.

Before deployment packaging:

- Current feature scope must be clear.
- Build must pass.
- Required env vars must be documented.
- Supabase migrations must be verified.
- Legal/footer disclaimer must be present.
- Current module and Star Citizen data versions must be visible.
- A package manifest must list included folders, excluded folders, build commands, required environment variables, and the source branch/commit.
