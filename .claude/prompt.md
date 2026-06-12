# Agent notes -- MusterDeck

Read AGENTS.md first. Everything in there applies. This file adds repo-specific notes.

---

## GitHub operations

Use the `gh` CLI for all GitHub operations:

```bash
gh issue create --repo ThePRIMEForge/muster-deck --title "Title" --body "Body"
gh pr create --repo ThePRIMEForge/muster-deck --title "Title" --head BRANCH --base main
gh pr list --repo ThePRIMEForge/muster-deck
gh pr checks N --repo ThePRIMEForge/muster-deck
gh pr view N --repo ThePRIMEForge/muster-deck --comments
```

After creating an issue, add it to the MusterDeck Roadmap project board:

```bash
gh project item-add 1 --owner ThePRIMEForge --url <issue-url>
```

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
gh pr list --repo ThePRIMEForge/muster-deck
gh pr checks N --repo ThePRIMEForge/muster-deck
gh pr view N --repo ThePRIMEForge/muster-deck --comments
```

When resolving a review thread: reply with a comment explaining what changed (commit hash
+ description), then resolve. Never silently resolve without a reply.

---

## Standing rules

- Never merge or close PRs -- only the repo owner does that.
- No em dashes anywhere: prose, comments, issue bodies, PRs, commits.
- Verbose commit messages: subject + blank line + body. Never one-liners.
- No invented naming schemes -- follow conventions in AGENTS.md exactly.
