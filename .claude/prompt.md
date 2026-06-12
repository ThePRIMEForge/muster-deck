# Claude Code -- MusterDeck

Read AGENTS.md first. Everything in there applies. This file adds Claude Code-specific notes.

---

## Tooling

All GitHub operations (issues, PRs, projects, branches) are managed via the
`repo-scaffold` CLI in the companion repo. Do not use `gh` CLI or raw API calls.

```bash
# From the repo-scaffold directory:
poetry run repo-scaffold issue create --repo ThePRIMEForge/muster-deck ...
poetry run repo-scaffold pr create   --repo ThePRIMEForge/muster-deck ...
poetry run repo-scaffold project item-add --project-title "MusterDeck Roadmap" \
  --repo ThePRIMEForge/muster-deck --issue-number NNN --project-owner ThePRIMEForge
```

---

## Workspace workflow

All branch work happens inside managed worktrees under `repos/ThePRIMEForge/muster-deck/`
(gitignored in repo-scaffold). Never use OS temp folders or arbitrary paths.

```bash
# From the repo-scaffold directory:
poetry run repo-scaffold workspace create --repo ThePRIMEForge/muster-deck --branch BRANCH
poetry run repo-scaffold workspace list   --repo ThePRIMEForge/muster-deck
poetry run repo-scaffold workspace delete --repo ThePRIMEForge/muster-deck --branch BRANCH
```

Layout: `repos/ThePRIMEForge/muster-deck/{branch-slug}/`

---

## Merge conflict resolution

When a rebase stops with conflicts:

1. Inspect each conflicted file -- understand which side (HEAD vs incoming commit) is correct.
2. Resolve manually, then `git add <files>`.
3. Continue: `GIT_EDITOR=true git rebase --continue`
4. Force-push: `git push origin BRANCH --force`

Use `--force` (not `--force-with-lease`) after a rebase if the local tracking ref is stale.

---

## PR queue monitoring

Before starting new work, check open PRs for review comments or CI failures:

```bash
poetry run repo-scaffold pr list --repo ThePRIMEForge/muster-deck
poetry run repo-scaffold pr checks --repo ThePRIMEForge/muster-deck --pr-number N
poetry run repo-scaffold pr review-threads --repo ThePRIMEForge/muster-deck --pr-number N
```

When resolving a review thread: reply with a comment explaining what changed (commit hash
+ description), then resolve. Never silently resolve without a reply.

---

## Standing rules (Claude-specific)

- Never merge or close PRs -- only the repo owner does that.
- No draft PRs unless explicitly asked.
- No em dashes anywhere: prose, comments, issue bodies, PRs, commits.
- Verbose commit messages: subject + blank line + body. Never one-liners.
- No invented naming schemes -- follow conventions in AGENTS.md exactly.
