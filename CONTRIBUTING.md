# Contributing to MusterDeck

MusterDeck is a React + Supabase fan tool for Star Citizen fleet coordination. This doc covers everything you need to get set up and ship changes.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 7, TypeScript |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Deploy | Netlify (auto-deploys on merge to `main`) |
| CI | GitHub Actions (TypeScript check + CodeQL) |

---

## Prerequisites

- Node.js 20+ with npm
- A Supabase account with access to the project (ask Blair for the anon key)
- Git

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/ThePRIMEForge/muster-deck.git
cd muster-deck

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and fill in VITE_SUPABASE_PUBLISHABLE_KEY
# (get the anon key from Supabase → Project Settings → API)

# 4. Start dev server
npm run dev
```

The app runs at `http://localhost:5173`. No Supabase setup required for the UI — it falls back to demo data if env vars are missing.

---

## Environment Variables

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | Already in `.env.example` — same for everyone |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → anon/public key |

Never commit `.env.local`. It is gitignored.

---

## Development Workflow

### Branch naming

```
feat/short-description       # new feature
fix/short-description        # bug fix
chore/short-description      # maintenance, deps, config
docs/short-description       # documentation only
```

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): wire up Discord OAuth button
fix(fleet): prevent duplicate ship requests on fast click
chore(deps): bump vite to 7.3.3
docs(contributing): add migration workflow section
```

Format: `type(scope): description (#issue-number)`

### Before pushing

Run the TypeScript check — CI will catch it anyway, but faster locally:

```bash
npx tsc --noEmit
```

---

## Pull Requests

- Branch protection is on — **no direct push to `main`**
- Open a PR from your branch to `main`
- CodeQL must pass before merge
- Use the PR template (fills in automatically when you open a PR)
- Reference the issue: `Closes #N` in the PR body

### Stacked PRs

If your work depends on an unmerged PR, branch off that PR's branch and target it as the base. Update the base to `main` after the parent merges.

---

## Database Migrations

Migrations live in `supabase/migrations/` as timestamped SQL files:

```
supabase/migrations/
  20260519150000_initial_backend_schema.sql
  20260603000000_profile_rls_and_helpers.sql
  ...
```

### Writing a migration

1. Create a new file: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`
2. Write plain SQL — no ORMs, no wrappers
3. Commit it with your PR

### Applying a migration

Migrations are applied manually for now:

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/brqrztrfeivrpywtummz/sql)
2. Paste the migration SQL and run it
3. Apply in chronological order if multiple migrations are pending

A CI-automated migration step is planned (tracked in the backlog).

---

## Project Structure

```
src/
  App.tsx                        # root component + routing
  components/
    foundation/                  # auth, nav, account, admin screens
  lib/
    supabase.ts                  # Supabase client + all DB functions
    useAuth.ts                   # session hook (viewer state)
    permissions.ts               # RBAC helpers
    foundationTypes.ts           # shared types
supabase/
  migrations/                    # SQL migration files
```

---

## Useful Commands

```bash
npm run dev          # start dev server
npm run build        # production build (runs tsc + vite build)
npx tsc --noEmit     # type check only
```

---

## Questions

Ping Blair (@blairg23) or open an issue.
