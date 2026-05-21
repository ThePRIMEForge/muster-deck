# MusterDeck Night Closeout Summary - 2026-05-21

## Closeout State

- Supabase local development stack was stopped for the night.
- Fleet Command persistence work is committed on `codex/shared-foundation`.
- The Vite preview server was stopped after browser verification.
- Unrelated visual identity work remains unstaged and was not included in Fleet Command commits.

## Fleet Command Work Locked In

Commits completed tonight:

- `b2ee3a0 feat: persist draft fleet setup lines`
- `ac2789b feat: persist demo crew assignments`
- `37dce54 feat: persist demo fleet line edits`
- `4efe5db feat: persist demo roster locks`
- `ed4ffe3 feat: hydrate persisted member assignments`

## Decisions Recorded

- Fleet Setup saves prototype lines to a single `DEMO-DRAFT` Fleet Command event.
- Reviewed ship-position templates remain the staffing baseline for this patch.
- Demo helpers are acceptable for prototype persistence, but must later be replaced with authenticated officer-scoped policies.
- Officer drag-and-drop crew assignments now persist to saved ship-position rows.
- Saved fleet-line team changes and removals persist.
- Master and team ship roster locks persist and remain scoped to ship suggestions/substitutions, not crew assignment.
- Member rail state hydrates from persisted demo assignments by display name for now.
- Existing-line profile, crew target, and custom-position edits are deferred because replacing copied position rows can break assignment-linked positions unless we design assignment-preserving updates.

## Verification Completed

- `npm test` passed after the final Fleet Command hydration slice.
- `npm run build` passed after the final Fleet Command hydration slice.
- `npm run db:test` passed after database-affecting slices.
- Browser smoke checks passed for:
  - saved Fleet Setup line persistence,
  - saved crew assignment persistence,
  - saved fleet-line team move and removal,
  - saved master/team roster locks,
  - member rail assignment hydration after reload.

## Next Recommended Fleet Command Slice

Design and implement assignment-preserving edits for existing saved Fleet Setup rows:

- profile changes,
- crew target changes,
- custom position edits.

The next slice should not call the current replace-position path blindly on assigned rows. It needs a small design pass for preserving existing assignments or remapping them safely when position quantities or labels change.

## Open Work Not Owned By This Closeout

The worktree still contains visual identity changes from another chat, including foundation UI files, style changes, font deletions, and `docs/handoff/2026-05-21-musterdeck-visual-identity-status.md`. These were intentionally left unstaged here.
