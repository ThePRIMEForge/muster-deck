# AGENTS.md -- MusterDeck

Agent workflow guide. Read this before touching anything.

---

## Branch naming

Format: `type/NNN-short-description`

- `type`: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
- `NNN`: the GitHub issue number -- create the issue first if one does not exist
- `short-description`: kebab-case, 3-4 words max

Examples: `feat/112-role-model`, `fix/88-auth-crash`, `docs/161-pillar-crt-spec`

`main` is the only long-lived branch. Never reuse a branch after its PR has merged.

---

## PR titles

Format: `type(scope): description (#NNN)`

Example: `feat(auth): add role model and permissions (#112)`

The issue number at the end is required so the PR is immediately traceable to its ticket.

---

## Workflow rules

1. **Issue first.** Create a GitHub issue before starting work so you have the `NNN` for the branch name.
2. **Branch from main.** Always cut from the latest `main`. Never branch from another feature branch.
3. **Use templates.** Always use `.github/pull_request_template.md` for PRs and `.github/ISSUE_TEMPLATE/ticket.md` or `epic.md` for issues. No freeform bodies.
4. **Project board.** After creating an issue, add it to the MusterDeck Roadmap project (ThePRIMEForge/#1). Issues only -- not PRs.
5. **Never reuse a merged branch.** If a branch's PR has been merged, that branch is dead. Cut a new branch from main for any follow-on work.
6. **Never merge or close PRs.** Push the branch, open the PR, stop there. Merging and closing are the repo owner's job.
7. **One branch per issue.** Do not stack multiple unrelated changes on one branch.

---

## Git identity

Before your first commit in any session, run:

```bash
git config user.name
git config user.email
```

If either returns `Your Name`, `you@example.com`, or is empty -- stop and ask the user
to set real values before continuing. Commits with placeholder identity pollute the log
and make authorship impossible to trace.

---

## Commit messages

Format: subject line + blank line + body.

```
type(scope): short summary of what changed (#NNN)

Explain WHY this change was needed. The diff already shows what changed.
Keep lines under 72 chars. Reference related issues or decisions where relevant.
```

- Subject: 72 chars max, imperative mood, no trailing period
- Body: required for anything non-trivial
- No one-liner commits for feature work

---

## Issue and PR templates

| Template | When to use |
|---|---|
| `.github/ISSUE_TEMPLATE/ticket.md` | Any implementation task |
| `.github/ISSUE_TEMPLATE/epic.md` | A grouping of related tickets |
| `.github/pull_request_template.md` | Every PR, no exceptions |

**These templates are mandatory. Freeform bodies are never acceptable, even for small or
trivial issues and PRs.**

### How to use the PR template

1. Read `.github/pull_request_template.md` in full before writing anything.
2. Copy every section header and its placeholder text verbatim into your PR body.
3. Fill in each section. Leave a section blank rather than deleting it.
4. Pass the completed body via `--body` when calling `gh pr create`. Do not rely on
   GitHub's auto-population -- it does not work when `--body` is omitted in non-interactive
   environments.

```bash
# Read the template
cat .github/pull_request_template.md

# Then create the PR with the filled-in body:
gh pr create \
  --repo ThePRIMEForge/muster-deck \
  --title "type(scope): description (#NNN)" \
  --head BRANCH \
  --base main \
  --body "$(cat <<'BODY'
## 🧾 Title
...

## 🧠 Description
...

## 🧩 Changes Included
- [ ] ...

## 🎯 Purpose
...

## 🔗 Related Issues / Epics
- **Closes:** #NNN

## 🧪 Testing
1. ...

## 🧰 Developer Notes
...
BODY
)"
```

### How to use issue templates

1. Read the relevant template file in full before writing anything:
   - Implementation task: `.github/ISSUE_TEMPLATE/ticket.md`
   - Multi-ticket initiative: `.github/ISSUE_TEMPLATE/epic.md`
2. Copy every section header and placeholder verbatim.
3. Fill in each section. Do not delete sections -- leave them with a dash or "N/A" if
   nothing applies.
4. Pass the completed body via `--body` when calling `gh issue create`.

```bash
# Read the template first
cat .github/ISSUE_TEMPLATE/ticket.md

# Then create the issue:
gh issue create \
  --repo ThePRIMEForge/muster-deck \
  --title "Short actionable title" \
  --body "$(cat <<'BODY'
## 🧾 Title
...

## 🧠 Summary
...

## 📦 Scope
...

## 🚫 Out of Scope
...

## ✅ Acceptance Criteria
- [ ] ...

## 🧪 Testing / Validation
- [ ] ...

## 🧰 Implementation Notes

## 🧰 Notes / Links

## ✅ Addendum: Bugs Found/Fixed

## ⏳ Addendum: Pending
BODY
)"
```

---

## Project board

Project: **MusterDeck Roadmap** (ThePRIMEForge/#1)

Add every new issue to the board immediately after creating it. Do not add PRs.
