# MusterDeck: Claude Code project memory

Read AGENTS.md first. Everything in it applies. It is imported below so the rules
load automatically every session.

@AGENTS.md

## Critical reminders (do not skip)

- Verify git identity before your first commit. `git config user.name` and
  `git config user.email` must be real values, never "Your Name" or
  "you@example.com". The pre-commit hook enforces this.
- No em dashes or en dashes anywhere: commits, PRs, issues, prose, comments.
  The commit-msg hook enforces this for commit messages.
- Issue first, then a branch named type/NNN-short-description, cut from latest main.
- PR titles use the form type(scope): description (#NNN). Always use the PR template.
- Never merge or close PRs. That is the repo owner's job.
- This GitHub clone is the only source of truth for code. The Google Drive
  "Muster Deck" folder is an asset and document backup only. Never run git there.
