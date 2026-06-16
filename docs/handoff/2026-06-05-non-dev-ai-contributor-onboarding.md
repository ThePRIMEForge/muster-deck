# Building MusterDeck with AI — A Guide for the Project Owner

MusterDeck started in a local folder called **SCFleet App**, but the product name is **MusterDeck**. This guide explains how Christoph, Blair, and AI assistants should work together without requiring Christoph to become the main programmer.

The short version: **GitHub is the source of truth, Blair is the technical owner, Christoph owns product direction, and AI assistants do the repeatable engineering work through issues, branches, and pull requests.**

---

## The Mental Model

Think of it like this:

- **Christoph** is the product owner. He decides what should exist, what matters first, what looks right, and whether the finished result matches the goal.
- **Blair** is the technical owner. He reviews architecture, code quality, database safety, Git hygiene, and anything risky before it goes live.
- **AI assistants** are implementation partners. They can read the repo, create issues, write code, run checks, prepare pull requests, and explain tradeoffs.
- **GitHub** is the source of truth. Every real task, decision, branch, pull request, and review should be traceable there.
- **Netlify** is the front door. When a change merges, Netlify rebuilds and publishes the site.
- **Supabase** is production data. Treat database changes as higher-risk than normal app code.

Christoph does not need to touch a terminal for day-to-day product work. But having Git configured locally is useful as a backup and gives him access to the same project history Blair and the AI use.

---

## Standing Rules

These are the operating rules for the project:

1. **GitHub is the source of truth.** Discord and chat are for discussion; GitHub Issues and Pull Requests are where final work is tracked.
2. **One task = one GitHub Issue = one branch = one Pull Request.** Do not bundle unrelated work into one PR.
3. **No direct work on the main branch.** Changes should happen on a task branch and be reviewed through a PR.
4. **Blair reviews technical risk.** Especially database migrations, authentication, permissions, security, deployment, and large refactors.
5. **Christoph reviews product fit.** Does it do what was requested? Does it look right? Does anything feel off?
6. **AI must report what it changed and how it checked the work.** A PR without a test/build note is not ready.
7. **Supabase changes need extra care.** Migration SQL is reviewed, tested where possible, and applied in the right order.

---

## The Tools

### GitHub

Use GitHub for:

- Issues: what needs to be done
- Pull Requests: proposed changes
- Reviews: comments, approvals, and requested fixes
- Project history: what changed and why

Repo: [github.com/ThePRIMEForge/muster-deck](https://github.com/ThePRIMEForge/muster-deck)

### CONTRIBUTING.md

Blair has added `CONTRIBUTING.md` to the GitHub repo for developers. That file is the technical setup guide: clone the repo, install dependencies, configure `.env.local`, run the app, name branches, write commits, open PRs, and handle migrations.

This guide is different. This guide is for Christoph and non-dev contributors who are using AI assistants to become useful project contributors without already knowing the full developer workflow.

Use both together:

- Read this guide to understand the operating model.
- Read `CONTRIBUTING.md` when setting up a machine or making a technical contribution.
- Ask Blair before touching Supabase production data.

### Claude Code

[Claude Code](https://claude.ai/code) can work inside the repo, read the project, write code, run checks, manage branches, and prepare PRs. Blair can use this heavily for technical work.

### OpenAI Codex / ChatGPT

Codex is useful for:

- Explaining code and project structure
- Drafting GitHub issues
- Reviewing PRs or proposed changes
- Writing implementation plans
- Acting as a second technical opinion
- Helping Christoph understand what Blair or Claude changed

### repo-scaffold

[repo-scaffold](https://github.com/blairg23/repo-scaffold) is Blair's GitHub ticketing and PR workflow tool. If Blair wants AI to manage issues and PRs through it, that is fine. The important thing is not the tool; the important thing is that GitHub stays the shared record.

---

## Git Setup for Christoph

Christoph's local Git identity is already configured:

- Name: `cmFrameShift`
- Email: `cm@f-shift.com`

The local MusterDeck folder is now connected to GitHub:

```bash
origin  https://github.com/ThePRIMEForge/muster-deck.git
```

GitHub has been fetched successfully. The local machine can see:

- `origin/main`
- `origin/feat/account-settings-save`

The local working branch is currently `codex/shared-foundation`.

The local `main` branch is behind GitHub, and the current `codex/shared-foundation` branch is also behind GitHub. Do not merge, rebase, force-push, or overwrite anything until Blair has reviewed the current local changes.

Useful read-only checks:

```bash
git remote -v
git status
git branch -vv
```

If a fresh clone is ever needed, Blair's `CONTRIBUTING.md` has the clean setup path:

```bash
git clone https://github.com/ThePRIMEForge/muster-deck.git
cd muster-deck
npm install
```

Important current note: the local repo already has uncommitted work. Resolve that first. Decide what should be committed, what should be ignored, and what belongs in a fresh branch.

---

## GitHub as the Source of Truth

Discord is fine for brainstorming, but it should not be the final record of work. When something becomes real, create or update a GitHub Issue.

### What Belongs in an Issue

A good issue answers:

- What should change?
- Why does it matter?
- What should the user see or be able to do?
- What should not be changed?
- Are there screenshots, mockups, examples, or references?
- Does this touch Supabase, authentication, permissions, payments, or deployment?

Example:

> In Fleet Command, filled ship positions should show as occupied and unfilled positions should show as open. Keep the existing layout. Do not redesign the full Fleet Command screen. Blair should review because this may touch persisted assignment data.

### How Communication Should Work

- Use Discord or chat to discuss rough ideas.
- Once the idea is real, create a GitHub Issue.
- When work starts, create one branch from that issue.
- When the work is ready, open one PR linked to that issue.
- Put final decisions, review comments, and requested changes on the PR or issue.
- After merge, close the issue or let the PR close it automatically.

---

## How a Typical Feature Gets Built

1. **Christoph describes what he wants** in Discord, ChatGPT, Claude Code, or directly in a GitHub Issue.
2. **The AI or Blair turns it into a GitHub Issue** with clear scope and acceptance criteria.
3. **A branch is created for that issue.** One task, one branch.
4. **The AI or Blair writes the code.**
5. **The AI runs checks** such as tests, build, lint, or a visual smoke test depending on the change.
6. **A Pull Request opens.** It links back to the issue and explains what changed.
7. **Christoph reviews product fit.** Blair reviews technical safety.
8. **If approved, the PR is merged.**
9. **Netlify deploys.**

That is the full loop: describe, issue, branch, PR, review, merge, deploy.

---

## Pull Request Requirements

Every PR should include:

- What changed
- Why it changed
- Link to the GitHub Issue
- Screenshots or preview link for UI changes
- Test/build results
- Whether Supabase migrations are included
- Whether Blair needs to review before merge

Do not merge a PR just because the code exists. Merge when the behavior, visuals, and technical checks are acceptable.

---

## How Christoph Reviews a Pull Request

A Pull Request is just: "Here are the proposed changes. Should they go live?"

1. Open the PR link.
2. Read the summary.
3. Open the Netlify preview if there is one.
4. Try the changed workflow.
5. Click **Files changed** if you want to see what was edited.
   - Green lines are additions.
   - Red lines are removals.
6. Leave a comment if something feels wrong or incomplete.
7. Wait for Blair's review if the PR has technical risk.
8. Merge only when product fit and technical review are both clear.

Christoph does not need to understand every line of code. His review questions are:

- Does this do what I asked for?
- Does it look and feel right?
- Is anything obviously broken?
- Did Blair or the AI say there is a migration or technical risk?

---

## Supabase Recommendation

Supabase is where live data and database rules live. Treat it with more caution than normal UI code.

### Rules for Database Changes

1. **Every database change should be a migration file** in `supabase/migrations/`.
2. **Do not paste random SQL into production.** Only run migration SQL that came from a reviewed PR.
3. **Blair should review database migrations** before production.
4. **Test locally or in staging where possible** before applying to production.
5. **Apply migrations in order.** Do not skip older migration files.
6. **Know whether the migration is backwards-compatible.** If old code cannot work with the new database, deployment order matters.
7. **Make a rollback plan for risky migrations.** Especially destructive changes, data rewrites, permission changes, or auth changes.
8. **Never expose Supabase service-role keys** to AI chats, browser code, GitHub, or screenshots.

### Safer Migration Flow

For most app changes:

1. PR includes the migration file.
2. AI explains what the migration does in plain English.
3. Blair reviews the SQL.
4. AI or Blair tests locally/staging where possible.
5. Christoph applies the migration only after review, or Blair applies it.
6. Merge/deploy the app code in the correct order.
7. Verify the live feature.

### When to Stop and Ask Blair

Ask Blair before running SQL if it:

- Deletes data
- Changes authentication or permissions
- Changes Row Level Security policies
- Changes payment, prize, or ledger-related records
- Moves or rewrites existing user data
- Mentions service-role access
- Looks confusing or much larger than expected

---

## How to Describe Work to an AI

The clearer the request, the better the result. Technical language is optional. Specific behavior is what matters.

Instead of:

> Make the fleet thing better.

Say:

> In Fleet Command, when a ship position is filled, highlight it as occupied. Unfilled positions should stay visually open. Do not redesign the whole screen.

Instead of:

> Fix the bug.

Say:

> When I click the Assign button on a ship request, nothing happens. The button should open a crew picker.

Useful phrases:

- "It should look like..."
- "When the user does X, Y should happen..."
- "This is broken because..."
- "Don't change anything else, just..."
- "Make a GitHub Issue first, then wait for approval."
- "One branch and one PR for this task only."
- "Flag anything that touches Supabase."

---

## When Something Breaks

Before merge:

- Comment on the PR.
- Ask the AI or Blair to fix it on the same branch.
- Close the PR if the approach is wrong.

After merge:

- Create a new GitHub Issue describing what broke.
- Link the PR that caused the problem if known.
- Create a fix branch and a fix PR.
- Let Netlify redeploy after merge.

Database issue:

- Stop making changes.
- Tell Blair.
- Do not run more SQL until the issue is understood.

---

## Day-to-Day Checklist

### Starting a New Feature

- [ ] Describe the feature clearly.
- [ ] Create or ask AI to create a GitHub Issue.
- [ ] Confirm scope: one task only.
- [ ] Create one branch for the issue.
- [ ] Open one PR when ready.
- [ ] Review preview/screenshots.
- [ ] Check whether Blair review is needed.
- [ ] Merge only after review.

### Reviewing Open Work

- [ ] Check open PRs: [github.com/ThePRIMEForge/muster-deck/pulls](https://github.com/ThePRIMEForge/muster-deck/pulls)
- [ ] Check open issues: [github.com/ThePRIMEForge/muster-deck/issues](https://github.com/ThePRIMEForge/muster-deck/issues)
- [ ] Decide what is blocked, what is ready, and what should be next.

### Before Touching Supabase

- [ ] Is there a migration file?
- [ ] Did Blair review it?
- [ ] Did AI explain it clearly?
- [ ] Was it tested locally or in staging where possible?
- [ ] Is there any destructive SQL?
- [ ] Is the deploy order clear?

---

## Immediate Next Steps

1. **Review the current uncommitted local changes.** Decide what should be committed, moved, ignored, or discarded.
2. **Compare the local branch against GitHub `main`.** GitHub has moved ahead, so sync carefully.
3. **Put this guide into the repo** under `docs/handoff/` once Blair agrees with it.
4. **Link this guide from `CONTRIBUTING.md`** if Blair wants a visible path for non-dev and AI-assisted contributors.
5. **Use GitHub Issues for the next real task** instead of leaving it only in Discord or chat.

---

## Message to Send Blair

> Hey Blair — I had Codex review your owner workflow doc and align it with your merged `CONTRIBUTING.md`. I think the clean split is: `CONTRIBUTING.md` stays the technical setup guide for devs, while this new guide is for Christoph/non-dev contributors using Codex or Claude Code to become useful contributors. The main recommendations are: GitHub should be the source of truth, Discord/chat can stay for discussion, every real task should become one GitHub Issue, and each task should use one branch and one PR. Christoph reviews product fit and visuals; you stay technical owner for architecture, code quality, Git hygiene, Supabase, auth, permissions, and anything risky. Supabase migrations should be treated as higher-risk: reviewed, tested where possible, applied in order, and not run in production unless the migration came from a reviewed PR. The local repo is now connected to `https://github.com/ThePRIMEForge/muster-deck.git` and fetched, but it has uncommitted local work and is behind GitHub `main`, so I think the next step is to resolve/sync that carefully before starting new feature work. Does that workflow make sense from your side?

---

## Questions

If something is unclear, ask in GitHub or Discord. The goal is not for Christoph to learn every technical detail. The goal is for Christoph to own product direction while Blair and AI keep the engineering workflow clean, reviewable, and recoverable.
