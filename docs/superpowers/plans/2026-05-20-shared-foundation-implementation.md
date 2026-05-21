# Shared Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first MusterDeck shared foundation around the current Fleet Command prototype: app shell, public landing, auth/profile placeholders, logged-in hub, admin portal foundation, notification center, footer/legal shell, and copy/voice constants.

**Architecture:** Keep the current Fleet Command prototype working while adding a thin route/view model around it. Extract shared foundation domain logic into small `src/lib/*` modules with Node tests, add focused React components under `src/components/foundation/`, and defer deep Fleet Command event settings/templates to a separate plan after the shared shell is stable.

**Tech Stack:** React 19, Vite 7, TypeScript strict mode, Supabase JS v2, Node built-in test runner, existing Supabase SQL migrations.

---

## Scope Check

The shared foundation spec includes multiple subsystems. This plan implements only the first foundation slice:

- App-level view model and navigation.
- Brand voice/copy constants.
- Public landing.
- Auth/profile screen placeholders wired to current local/demo user state.
- Logged-in hub.
- Admin portal foundation UI with demo data.
- Notification center UI with current local messages plus foundation notification types.
- Footer/legal shell.
- Supabase schema foundation for profiles, identities, notification preferences, admin notes, and moderation state.

Separate follow-up plans should cover:

- Fleet Command event settings and event templates/duplication.
- Real Supabase auth integration and OAuth callback behavior.
- Rally Point production screens.
- S.P.O.I.L.S. production screens.
- Proving Ground tournament production screens.
- Push notifications and activity chat.

## File Structure

Create:

- `src/lib/foundationTypes.ts` — shared foundation UI/domain types.
- `src/lib/appNavigation.ts` — app routes, module metadata, route visibility, default route selection.
- `src/lib/foundationCopy.ts` — voice-aligned product copy, module descriptions, legal disclaimer.
- `src/lib/foundationData.ts` — demo profile, notifications, admin users for the first UI pass.
- `src/components/foundation/AppFrame.tsx` — shared header/sidebar/footer layout.
- `src/components/foundation/PublicLanding.tsx` — public landing page.
- `src/components/foundation/AuthScreen.tsx` — signup/login/reset/callback placeholder screen.
- `src/components/foundation/OperationsHub.tsx` — logged-in hub.
- `src/components/foundation/AccountSettings.tsx` — profile/account settings placeholder.
- `src/components/foundation/AdminPortal.tsx` — first admin portal UI.
- `src/components/foundation/NotificationCenter.tsx` — notifications UI.
- `scripts/foundation/appNavigation.test.ts` — Node tests for route visibility/defaults.
- `scripts/foundation/foundationCopy.test.ts` — Node tests for required copy and prohibited phrases.
- `supabase/migrations/20260520190000_shared_foundation_accounts.sql` — first account/profile/admin/notification tables.
- `supabase/tests/shared_foundation_accounts_smoke.sql` — SQL smoke checks.

Modify:

- `package.json` — add foundation tests to a broader `test` command.
- `src/App.tsx` — wrap existing Fleet Command UI in app route selection and render foundation screens.
- `src/styles.css` — add foundation layout styles while preserving current Fleet Command classes.

Do not restructure the full 2,500-line `src/App.tsx` in this plan. Keep extraction limited to foundation additions so behavior risk stays contained.

## Task 1: Add Foundation Route Model

**Files:**

- Create: `src/lib/foundationTypes.ts`
- Create: `src/lib/appNavigation.ts`
- Create: `scripts/foundation/appNavigation.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the route visibility tests**

Create `scripts/foundation/appNavigation.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  appRoutes,
  defaultFoundationRouteForViewer,
  getRouteById,
  visibleFoundationRoutes,
} from '../../src/lib/appNavigation.ts';
import type { FoundationViewer } from '../../src/lib/foundationTypes.ts';

const guest: FoundationViewer = {
  id: 'guest',
  displayName: 'Guest',
  accountState: 'guest',
  operationRole: 'crew',
  isSiteAdmin: false,
};

const crew: FoundationViewer = {
  id: 'crew-1',
  displayName: 'Deck Crew',
  accountState: 'email_account',
  operationRole: 'crew',
  isSiteAdmin: false,
};

const admin: FoundationViewer = {
  id: 'admin-1',
  displayName: 'Deck Admin',
  accountState: 'discord_linked',
  operationRole: 'fleet_admiral',
  isSiteAdmin: true,
};

test('guest users only see public and auth routes', () => {
  assert.deepEqual(
    visibleFoundationRoutes(guest).map((route) => route.id),
    ['landing', 'rally-browse', 'login', 'signup'],
  );
  assert.equal(defaultFoundationRouteForViewer(guest), 'landing');
});

test('signed in users see hub, account, notifications, and fleet command', () => {
  const visible = visibleFoundationRoutes(crew).map((route) => route.id);
  assert.equal(visible.includes('hub'), true);
  assert.equal(visible.includes('account'), true);
  assert.equal(visible.includes('notifications'), true);
  assert.equal(visible.includes('fleet-command'), true);
  assert.equal(visible.includes('admin'), false);
  assert.equal(defaultFoundationRouteForViewer(crew), 'hub');
});

test('site admins see the admin portal route', () => {
  const visible = visibleFoundationRoutes(admin).map((route) => route.id);
  assert.equal(visible.includes('admin'), true);
  assert.equal(getRouteById('admin')?.label, 'Admin');
});

test('route ids remain unique', () => {
  const ids = appRoutes.map((route) => route.id);
  assert.equal(new Set(ids).size, ids.length);
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
node --test scripts/foundation/appNavigation.test.ts
```

Expected: FAIL with a module-not-found error for `src/lib/appNavigation.ts` or `src/lib/foundationTypes.ts`.

- [ ] **Step 3: Add foundation types**

Create `src/lib/foundationTypes.ts`:

```ts
import type { OperationRole } from './permissions';

export type FoundationRouteId =
  | 'landing'
  | 'login'
  | 'signup'
  | 'hub'
  | 'account'
  | 'notifications'
  | 'admin'
  | 'rally-browse'
  | 'fleet-command'
  | 'spoils'
  | 'proving-ground';

export type FoundationModuleKey = 'rally_point' | 'fleet_command' | 'spoils' | 'proving_ground';

export type AccountState =
  | 'guest'
  | 'email_account'
  | 'discord_linked'
  | 'google_linked'
  | 'rsi_submitted'
  | 'rsi_verified'
  | 'restricted'
  | 'banned';

export type FoundationViewer = {
  id: string;
  displayName: string;
  accountState: AccountState;
  operationRole: OperationRole;
  isSiteAdmin: boolean;
};

export type FoundationRoute = {
  id: FoundationRouteId;
  label: string;
  module?: FoundationModuleKey;
  public: boolean;
  requiresAuth: boolean;
  requiresAdmin?: boolean;
  buildPriority: 'build_now' | 'draft_now' | 'later';
};
```

- [ ] **Step 4: Add route model implementation**

Create `src/lib/appNavigation.ts`:

```ts
import type { FoundationRoute, FoundationRouteId, FoundationViewer } from './foundationTypes';

export const appRoutes: FoundationRoute[] = [
  {
    id: 'landing',
    label: 'MusterDeck',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'rally-browse',
    label: 'Browse Rally Point',
    module: 'rally_point',
    public: true,
    requiresAuth: false,
    buildPriority: 'draft_now',
  },
  {
    id: 'login',
    label: 'Log in',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'signup',
    label: 'Sign up',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'hub',
    label: 'Operations Hub',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'account',
    label: 'Account',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'admin',
    label: 'Admin',
    public: false,
    requiresAuth: true,
    requiresAdmin: true,
    buildPriority: 'build_now',
  },
  {
    id: 'fleet-command',
    label: 'Fleet Command',
    module: 'fleet_command',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'spoils',
    label: 'S.P.O.I.L.S.',
    module: 'spoils',
    public: false,
    requiresAuth: true,
    buildPriority: 'draft_now',
  },
  {
    id: 'proving-ground',
    label: 'Proving Ground',
    module: 'proving_ground',
    public: false,
    requiresAuth: true,
    buildPriority: 'draft_now',
  },
];

export function isSignedIn(viewer: FoundationViewer) {
  return viewer.accountState !== 'guest';
}

export function visibleFoundationRoutes(viewer: FoundationViewer) {
  return appRoutes.filter((route) => {
    if (route.requiresAdmin && !viewer.isSiteAdmin) {
      return false;
    }

    if (route.requiresAuth) {
      return isSignedIn(viewer);
    }

    return true;
  });
}

export function defaultFoundationRouteForViewer(viewer: FoundationViewer): FoundationRouteId {
  return isSignedIn(viewer) ? 'hub' : 'landing';
}

export function getRouteById(routeId: FoundationRouteId) {
  return appRoutes.find((route) => route.id === routeId);
}
```

- [ ] **Step 5: Add test script**

Modify `package.json` scripts:

```json
"test": "node --test scripts/permissions/*.test.ts scripts/foundation/*.test.ts scripts/staffing-templates/*.test.mjs scripts/wiki-sync/*.test.mjs",
"test:data": "node --test scripts/staffing-templates/*.test.mjs scripts/wiki-sync/*.test.mjs"
```

Keep the existing scripts and add `test` without removing `test:data`.

- [ ] **Step 6: Run tests**

Run:

```bash
npm test
npm run build
```

Expected: all Node tests pass and TypeScript build succeeds.

- [ ] **Step 7: Commit**

```bash
git add package.json src/lib/foundationTypes.ts src/lib/appNavigation.ts scripts/foundation/appNavigation.test.ts
git commit -m "feat: add foundation route model"
```

## Task 2: Add Brand Voice Copy Constants

**Files:**

- Create: `src/lib/foundationCopy.ts`
- Create: `scripts/foundation/foundationCopy.test.ts`

- [ ] **Step 1: Write copy tests**

Create `scripts/foundation/foundationCopy.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fanProjectDisclaimer,
  foundationCopy,
  moduleSummaries,
  prohibitedOfficialPhrases,
} from '../../src/lib/foundationCopy.ts';

test('foundation copy includes all four product pillars', () => {
  assert.equal(moduleSummaries.rallyPoint.title, 'Rally Point');
  assert.equal(moduleSummaries.fleetCommand.title, 'Fleet Command');
  assert.equal(moduleSummaries.spoils.title, 'S.P.O.I.L.S.');
  assert.equal(moduleSummaries.provingGround.title, 'Proving Ground');
});

test('landing copy respects broad combat and non-combat positioning', () => {
  assert.equal(foundationCopy.landing.heroTitle, 'Rally, command, settle.');
  assert.match(foundationCopy.landing.heroSubtitle, /cargo/);
  assert.match(foundationCopy.landing.heroSubtitle, /combat/);
  assert.match(foundationCopy.landing.heroSubtitle, /'verse/);
});

test('fan disclaimer keeps MusterDeck independent', () => {
  assert.match(fanProjectDisclaimer, /independent fan-made tool/);
  assert.match(fanProjectDisclaimer, /not affiliated/);
  assert.match(fanProjectDisclaimer, /Cloud Imperium Games/);
});

test('copy avoids official-status language', () => {
  const allCopy = JSON.stringify({ foundationCopy, moduleSummaries, fanProjectDisclaimer }).toLowerCase();

  for (const phrase of prohibitedOfficialPhrases) {
    assert.equal(allCopy.includes(phrase.toLowerCase()), false, `Unexpected phrase: ${phrase}`);
  }
});
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
node --test scripts/foundation/foundationCopy.test.ts
```

Expected: FAIL with module-not-found for `src/lib/foundationCopy.ts`.

- [ ] **Step 3: Add copy constants**

Create `src/lib/foundationCopy.ts`:

```ts
export const prohibitedOfficialPhrases = [
  'official fleet command',
  'rsi-approved',
  'cig-backed',
  'guaranteed payout',
  'verified by cloud imperium',
  'official uee orders',
];

export const fanProjectDisclaimer =
  'MusterDeck is an independent fan-made tool for Star Citizen players and organizations. It is not affiliated with, endorsed by, sponsored by, or officially connected to Cloud Imperium Games, Roberts Space Industries, or their affiliates. Star Citizen and related names, marks, and assets belong to their respective owners.';

export const moduleSummaries = {
  rallyPoint: {
    title: 'Rally Point',
    action: 'Find an operation',
    description: 'Browse open runs, offer your ship, and join crews that need your station.',
  },
  fleetCommand: {
    title: 'Fleet Command',
    action: 'Command an operation',
    description: 'Build the roster, assign the crew, and keep the operation moving.',
  },
  spoils: {
    title: 'S.P.O.I.L.S.',
    action: 'Settle rewards',
    description: 'Log the haul, approve claims, and settle shares after the job is done.',
  },
  provingGround: {
    title: 'Proving Ground',
    action: 'Run a tournament',
    description: 'Open signups, seed brackets, report scores, and publish standings.',
  },
} as const;

export const foundationCopy = {
  landing: {
    heroTitle: 'Rally, command, settle.',
    heroSubtitle: "Coordinate crews, cargo, combat, tournaments, and payouts across the 'verse.",
    primaryCta: 'Create account',
    secondaryCta: 'Browse Rally Point',
    loginCta: 'Log in',
  },
  hub: {
    title: 'Operations Hub',
    subtitle: 'Choose your station and keep the deck moving.',
    emptyApprovals: 'No pending approvals. The queue is clear.',
    emptySettlements: 'No active settlements. Start one when an operation wraps.',
  },
  auth: {
    loginTitle: 'Log in to MusterDeck',
    signupTitle: 'Create your MusterDeck account',
    discord: 'Continue with Discord',
    google: 'Continue with Google',
    email: 'Continue with email',
    terms: 'I agree to the Terms of Service and Privacy Policy.',
  },
  admin: {
    title: 'Admin Portal',
    subtitle: 'Review accounts, manage access, and keep the deck in order.',
  },
  notifications: {
    title: 'Notifications',
    empty: 'No notifications. Orders will appear here.',
    markAllRead: 'Mark all as read',
  },
  account: {
    title: 'Account Settings',
    subtitle: 'Complete your profile so hosts know who is reporting in.',
  },
} as const;
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and TypeScript build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/foundationCopy.ts scripts/foundation/foundationCopy.test.ts
git commit -m "feat: add foundation copy constants"
```

## Task 3: Add Shared Foundation Database Schema

**Files:**

- Create: `supabase/migrations/20260520190000_shared_foundation_accounts.sql`
- Create: `supabase/tests/shared_foundation_accounts_smoke.sql`

- [ ] **Step 1: Create the migration**

Create `supabase/migrations/20260520190000_shared_foundation_accounts.sql`:

```sql
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text not null,
  bio text not null default '',
  primary_org text not null default '',
  avatar_url text,
  rsi_handle text,
  rsi_verification_status text not null default 'not_submitted'
    check (rsi_verification_status in ('not_submitted', 'pending', 'verified', 'failed', 'revoked')),
  account_status text not null default 'active'
    check (account_status in ('active', 'approval_required', 'restricted', 'banned', 'deleted')),
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  profile_completed_at timestamptz,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.profile_identities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('email', 'discord', 'google')),
  provider_user_id text,
  provider_username text,
  provider_email text,
  linked_at timestamptz not null default now(),
  last_seen_at timestamptz,
  unique (provider, provider_user_id),
  unique (profile_id, provider)
);

create table public.notification_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  assignments_enabled boolean not null default true,
  applications_enabled boolean not null default true,
  settlements_enabled boolean not null default true,
  admin_enabled boolean not null default true,
  browser_push_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_notification_preferences_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create table public.profile_moderation_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  author_profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create table public.profile_admin_actions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in ('restrict', 'unrestrict', 'ban', 'unban', 'require_approval', 'restore_access')),
  reason text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profile_identities enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.profile_moderation_notes enable row level security;
alter table public.profile_admin_actions enable row level security;
```

- [ ] **Step 2: Add smoke checks**

Create `supabase/tests/shared_foundation_accounts_smoke.sql`:

```sql
begin;

insert into public.profiles (display_name, primary_org, rsi_handle, rsi_verification_status)
values ('Deck Tester', 'MusterDeck', 'DeckTester', 'pending')
returning id;

insert into public.profiles (display_name, account_status)
values ('Restricted Tester', 'restricted');

insert into public.profile_identities (profile_id, provider, provider_user_id, provider_username)
select id, 'discord', '12345', 'decktester'
from public.profiles
where display_name = 'Deck Tester';

insert into public.notification_preferences (profile_id, browser_push_enabled)
select id, true
from public.profiles
where display_name = 'Deck Tester';

insert into public.profile_moderation_notes (profile_id, note)
select id, 'Smoke test note'
from public.profiles
where display_name = 'Deck Tester';

select
  p.display_name,
  p.rsi_verification_status,
  i.provider,
  n.browser_push_enabled
from public.profiles p
join public.profile_identities i on i.profile_id = p.id
join public.notification_preferences n on n.profile_id = p.id
where p.display_name = 'Deck Tester';

rollback;
```

- [ ] **Step 3: Apply locally when Supabase is available**

Run:

```bash
supabase db reset
```

Expected: migrations apply cleanly. If Supabase CLI is unavailable, record that verification is blocked and run SQL review manually.

- [ ] **Step 4: Run SQL smoke test when Supabase is available**

Run:

```bash
supabase test db
```

Expected: smoke tests pass. If this project does not have Supabase test harness configured locally, run the SQL in the Supabase SQL editor after applying the migration.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260520190000_shared_foundation_accounts.sql supabase/tests/shared_foundation_accounts_smoke.sql
git commit -m "feat: add shared foundation account schema"
```

## Task 4: Add Foundation Demo Data

**Files:**

- Create: `src/lib/foundationData.ts`
- Create: `scripts/foundation/foundationData.test.ts`

- [ ] **Step 1: Write demo data tests**

Create `scripts/foundation/foundationData.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { demoAdminUsers, demoFoundationViewer, demoNotifications } from '../../src/lib/foundationData.ts';

test('demo viewer can access admin tools for local planning', () => {
  assert.equal(demoFoundationViewer.isSiteAdmin, true);
  assert.equal(demoFoundationViewer.operationRole, 'fleet_admiral');
});

test('demo notifications include expected foundation categories', () => {
  const categories = new Set(demoNotifications.map((notification) => notification.category));
  assert.equal(categories.has('assignment'), true);
  assert.equal(categories.has('application'), true);
  assert.equal(categories.has('settlement'), true);
  assert.equal(categories.has('admin'), true);
});

test('demo admin users include at least one restricted state', () => {
  assert.equal(demoAdminUsers.some((user) => user.accountStatus === 'restricted'), true);
});
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
node --test scripts/foundation/foundationData.test.ts
```

Expected: FAIL with module-not-found for `src/lib/foundationData.ts`.

- [ ] **Step 3: Add demo data**

Create `src/lib/foundationData.ts`:

```ts
import type { FoundationViewer } from './foundationTypes';

export type FoundationNotification = {
  id: string;
  category: 'assignment' | 'application' | 'settlement' | 'admin';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type DemoAdminUser = {
  id: string;
  displayName: string;
  accountStatus: 'active' | 'approval_required' | 'restricted' | 'banned';
  discordLinked: boolean;
  googleLinked: boolean;
  rsiStatus: 'not_submitted' | 'pending' | 'verified' | 'failed';
  createdAt: string;
  lastActiveAt: string;
  notes: string;
};

export const demoFoundationViewer: FoundationViewer = {
  id: 'profile-admiral',
  displayName: 'Admiral Rowan',
  accountState: 'rsi_verified',
  operationRole: 'fleet_admiral',
  isSiteAdmin: true,
};

export const demoNotifications: FoundationNotification[] = [
  {
    id: 'note-assignment',
    category: 'assignment',
    title: 'Assignment updated',
    body: 'You were assigned to Polaris, Team Alpha.',
    createdAt: '2 min ago',
    read: false,
  },
  {
    id: 'note-application',
    category: 'application',
    title: 'Application approved',
    body: 'Your cargo run application was approved.',
    createdAt: '18 min ago',
    read: false,
  },
  {
    id: 'note-settlement',
    category: 'settlement',
    title: 'Settlement finalized',
    body: 'Mining wing shares are ready for review.',
    createdAt: '1 hr ago',
    read: true,
  },
  {
    id: 'note-admin',
    category: 'admin',
    title: 'Account requires review',
    body: 'A new profile is waiting for manual approval.',
    createdAt: '3 hr ago',
    read: true,
  },
];

export const demoAdminUsers: DemoAdminUser[] = [
  {
    id: 'user-1',
    displayName: 'Admiral Rowan',
    accountStatus: 'active',
    discordLinked: true,
    googleLinked: false,
    rsiStatus: 'verified',
    createdAt: '2026-05-18',
    lastActiveAt: 'Today',
    notes: 'Site owner account.',
  },
  {
    id: 'user-2',
    displayName: 'Cargo Lead Vale',
    accountStatus: 'approval_required',
    discordLinked: true,
    googleLinked: true,
    rsiStatus: 'pending',
    createdAt: '2026-05-19',
    lastActiveAt: 'Yesterday',
    notes: 'Requested access to logistics templates.',
  },
  {
    id: 'user-3',
    displayName: 'Unknown Contact',
    accountStatus: 'restricted',
    discordLinked: false,
    googleLinked: false,
    rsiStatus: 'not_submitted',
    createdAt: '2026-05-20',
    lastActiveAt: 'Today',
    notes: 'Restricted pending identity review.',
  },
];
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and TypeScript build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/foundationData.ts scripts/foundation/foundationData.test.ts
git commit -m "feat: add foundation demo data"
```

## Task 5: Add Foundation Components

**Files:**

- Create: `src/components/foundation/AppFrame.tsx`
- Create: `src/components/foundation/PublicLanding.tsx`
- Create: `src/components/foundation/AuthScreen.tsx`
- Create: `src/components/foundation/OperationsHub.tsx`
- Create: `src/components/foundation/AccountSettings.tsx`
- Create: `src/components/foundation/AdminPortal.tsx`
- Create: `src/components/foundation/NotificationCenter.tsx`

- [ ] **Step 1: Add the shared app frame**

Create `src/components/foundation/AppFrame.tsx`:

```tsx
import { Bell, LogIn, Menu, Shield, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { appRoutes, visibleFoundationRoutes } from '../../lib/appNavigation';
import { fanProjectDisclaimer } from '../../lib/foundationCopy';
import type { FoundationRouteId, FoundationViewer } from '../../lib/foundationTypes';

type AppFrameProps = {
  activeRoute: FoundationRouteId;
  viewer: FoundationViewer;
  onRouteChange: (route: FoundationRouteId) => void;
  children: ReactNode;
};

export function AppFrame({ activeRoute, viewer, onRouteChange, children }: AppFrameProps) {
  const visibleRoutes = visibleFoundationRoutes(viewer);

  return (
    <div className="foundation-shell">
      <header className="foundation-header">
        <button className="foundation-brand" onClick={() => onRouteChange('landing')} type="button">
          <Shield size={22} />
          <span>MusterDeck</span>
        </button>
        <nav className="foundation-nav" aria-label="Primary navigation">
          {visibleRoutes
            .filter((route) => route.id !== 'landing' && route.id !== 'signup')
            .map((route) => (
              <button
                key={route.id}
                className={route.id === activeRoute ? 'active' : ''}
                onClick={() => onRouteChange(route.id)}
                type="button"
              >
                {route.label}
              </button>
            ))}
        </nav>
        <div className="foundation-actions">
          <button onClick={() => onRouteChange('notifications')} type="button" title="Notifications">
            <Bell size={17} />
          </button>
          <button onClick={() => onRouteChange('account')} type="button" title={viewer.displayName}>
            <UserRound size={17} />
          </button>
          <button onClick={() => onRouteChange('login')} type="button" title="Log in">
            <LogIn size={17} />
          </button>
          <button className="mobile-menu-button" type="button" title="Menu">
            <Menu size={17} />
          </button>
        </div>
      </header>

      <div className="foundation-status-strip">
        <span>Rally Point v0.1</span>
        <span>Fleet Command v0.1</span>
        <span>S.P.O.I.L.S. v0.1</span>
        <span>Proving Ground v0.1</span>
        <span>Star Citizen data: 4.8.0-LIVE.11825000</span>
      </div>

      <main className="foundation-main">{children}</main>

      <footer className="foundation-footer">
        <p>{fanProjectDisclaimer}</p>
        <div>
          <button type="button">Privacy Policy</button>
          <button type="button">Terms of Service</button>
          <button type="button">Status</button>
        </div>
      </footer>
    </div>
  );
}

export const foundationRouteIds = appRoutes.map((route) => route.id);
```

- [ ] **Step 2: Add PublicLanding**

Create `src/components/foundation/PublicLanding.tsx`:

```tsx
import { ArrowRight, ClipboardList, Coins, Radio, Trophy } from 'lucide-react';
import { foundationCopy, moduleSummaries } from '../../lib/foundationCopy';
import type { FoundationRouteId } from '../../lib/foundationTypes';

type PublicLandingProps = {
  onRouteChange: (route: FoundationRouteId) => void;
};

export function PublicLanding({ onRouteChange }: PublicLandingProps) {
  return (
    <section className="foundation-page landing-page">
      <div className="landing-hero">
        <p className="eyebrow">Star Citizen operations</p>
        <h1>{foundationCopy.landing.heroTitle}</h1>
        <p>{foundationCopy.landing.heroSubtitle}</p>
        <div className="landing-actions">
          <button className="foundation-primary" onClick={() => onRouteChange('signup')} type="button">
            {foundationCopy.landing.primaryCta}
            <ArrowRight size={17} />
          </button>
          <button className="foundation-secondary" onClick={() => onRouteChange('rally-browse')} type="button">
            {foundationCopy.landing.secondaryCta}
          </button>
        </div>
      </div>

      <div className="pillar-grid">
        <article>
          <Radio size={22} />
          <h2>{moduleSummaries.rallyPoint.title}</h2>
          <p>{moduleSummaries.rallyPoint.description}</p>
        </article>
        <article>
          <ClipboardList size={22} />
          <h2>{moduleSummaries.fleetCommand.title}</h2>
          <p>{moduleSummaries.fleetCommand.description}</p>
        </article>
        <article>
          <Coins size={22} />
          <h2>{moduleSummaries.spoils.title}</h2>
          <p>{moduleSummaries.spoils.description}</p>
        </article>
        <article>
          <Trophy size={22} />
          <h2>{moduleSummaries.provingGround.title}</h2>
          <p>{moduleSummaries.provingGround.description}</p>
        </article>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add remaining foundation components**

Create each component with the exact exported function name:

`src/components/foundation/AuthScreen.tsx`:

```tsx
import { foundationCopy } from '../../lib/foundationCopy';

type AuthScreenProps = {
  mode: 'login' | 'signup';
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const title = mode === 'login' ? foundationCopy.auth.loginTitle : foundationCopy.auth.signupTitle;

  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Account access</p>
      <h1>{title}</h1>
      <div className="foundation-form-panel">
        <button type="button">{foundationCopy.auth.discord}</button>
        <button type="button">{foundationCopy.auth.google}</button>
        <label>
          <span>Email</span>
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" placeholder="Password" />
        </label>
        <button className="foundation-primary" type="button">
          {foundationCopy.auth.email}
        </button>
        {mode === 'signup' && <p className="form-note">{foundationCopy.auth.terms}</p>}
      </div>
    </section>
  );
}
```

`src/components/foundation/OperationsHub.tsx`:

```tsx
import { ClipboardList, Coins, Radio, Trophy } from 'lucide-react';
import { foundationCopy, moduleSummaries } from '../../lib/foundationCopy';
import type { FoundationRouteId, FoundationViewer } from '../../lib/foundationTypes';

type OperationsHubProps = {
  viewer: FoundationViewer;
  onRouteChange: (route: FoundationRouteId) => void;
};

export function OperationsHub({ viewer, onRouteChange }: OperationsHubProps) {
  return (
    <section className="foundation-page">
      <p className="eyebrow">Welcome, {viewer.displayName}</p>
      <h1>{foundationCopy.hub.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.hub.subtitle}</p>
      <div className="pillar-grid">
        <button type="button" onClick={() => onRouteChange('rally-browse')}>
          <Radio size={22} />
          <strong>{moduleSummaries.rallyPoint.action}</strong>
          <span>{moduleSummaries.rallyPoint.description}</span>
        </button>
        <button type="button" onClick={() => onRouteChange('fleet-command')}>
          <ClipboardList size={22} />
          <strong>{moduleSummaries.fleetCommand.action}</strong>
          <span>{moduleSummaries.fleetCommand.description}</span>
        </button>
        <button type="button" onClick={() => onRouteChange('spoils')}>
          <Coins size={22} />
          <strong>{moduleSummaries.spoils.action}</strong>
          <span>{moduleSummaries.spoils.description}</span>
        </button>
        <button type="button" onClick={() => onRouteChange('proving-ground')}>
          <Trophy size={22} />
          <strong>{moduleSummaries.provingGround.action}</strong>
          <span>{moduleSummaries.provingGround.description}</span>
        </button>
      </div>
      <div className="activity-grid">
        <article>{foundationCopy.hub.emptyApprovals}</article>
        <article>{foundationCopy.hub.emptySettlements}</article>
      </div>
    </section>
  );
}
```

`src/components/foundation/AccountSettings.tsx`:

```tsx
import { foundationCopy } from '../../lib/foundationCopy';
import type { FoundationViewer } from '../../lib/foundationTypes';

type AccountSettingsProps = {
  viewer: FoundationViewer;
};

export function AccountSettings({ viewer }: AccountSettingsProps) {
  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Profile</p>
      <h1>{foundationCopy.account.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.account.subtitle}</p>
      <div className="foundation-form-panel">
        <label>
          <span>Callsign</span>
          <input defaultValue={viewer.displayName} />
        </label>
        <label>
          <span>Primary organization</span>
          <input placeholder="Organization name" />
        </label>
        <label>
          <span>RSI handle</span>
          <input placeholder="RSI handle" />
        </label>
        <div className="identity-row">Discord linked</div>
        <div className="identity-row">Google linked</div>
        <button className="foundation-primary" type="button">Save changes</button>
      </div>
    </section>
  );
}
```

`src/components/foundation/AdminPortal.tsx`:

```tsx
import { foundationCopy } from '../../lib/foundationCopy';
import { demoAdminUsers } from '../../lib/foundationData';

export function AdminPortal() {
  return (
    <section className="foundation-page">
      <p className="eyebrow">Site controls</p>
      <h1>{foundationCopy.admin.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.admin.subtitle}</p>
      <div className="admin-table" role="table" aria-label="Registered users">
        <div className="admin-row header" role="row">
          <span>User</span>
          <span>Status</span>
          <span>Discord</span>
          <span>RSI</span>
          <span>Last active</span>
          <span>Notes</span>
        </div>
        {demoAdminUsers.map((user) => (
          <div className="admin-row" role="row" key={user.id}>
            <strong>{user.displayName}</strong>
            <span>{user.accountStatus}</span>
            <span>{user.discordLinked ? 'Linked' : 'Not linked'}</span>
            <span>{user.rsiStatus}</span>
            <span>{user.lastActiveAt}</span>
            <span>{user.notes}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`src/components/foundation/NotificationCenter.tsx`:

```tsx
import { foundationCopy } from '../../lib/foundationCopy';
import { demoNotifications } from '../../lib/foundationData';

export function NotificationCenter() {
  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Orders and updates</p>
      <h1>{foundationCopy.notifications.title}</h1>
      <button className="foundation-secondary" type="button">
        {foundationCopy.notifications.markAllRead}
      </button>
      <div className="notification-list">
        {demoNotifications.map((notification) => (
          <article className={notification.read ? 'notification-card read' : 'notification-card'} key={notification.id}>
            <strong>{notification.title}</strong>
            <span>{notification.body}</span>
            <em>{notification.createdAt}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: TypeScript build succeeds. Components are not wired yet, but exports compile.

- [ ] **Step 5: Commit**

```bash
git add src/components/foundation
git commit -m "feat: add foundation screen components"
```

## Task 6: Wire Foundation Screens Into App

**Files:**

- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports**

Modify the top of `src/App.tsx` to add:

```ts
import { AppFrame } from './components/foundation/AppFrame';
import { AccountSettings } from './components/foundation/AccountSettings';
import { AdminPortal } from './components/foundation/AdminPortal';
import { AuthScreen } from './components/foundation/AuthScreen';
import { NotificationCenter } from './components/foundation/NotificationCenter';
import { OperationsHub } from './components/foundation/OperationsHub';
import { PublicLanding } from './components/foundation/PublicLanding';
import { demoFoundationViewer } from './lib/foundationData';
import type { FoundationRouteId } from './lib/foundationTypes';
```

- [ ] **Step 2: Add foundation route state**

Inside `function App()`, after existing state declarations begin, add:

```ts
  const [foundationRoute, setFoundationRoute] = useState<FoundationRouteId>('landing');
  const foundationViewer = demoFoundationViewer;
```

- [ ] **Step 3: Wrap the current return in `AppFrame`**

At the start of the existing `return`, replace:

```tsx
  return (
    <>
```

with:

```tsx
  if (foundationRoute === 'landing') {
    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <PublicLanding onRouteChange={setFoundationRoute} />
      </AppFrame>
    );
  }

  if (foundationRoute === 'login' || foundationRoute === 'signup') {
    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <AuthScreen mode={foundationRoute === 'login' ? 'login' : 'signup'} />
      </AppFrame>
    );
  }

  if (foundationRoute === 'hub') {
    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <OperationsHub viewer={foundationViewer} onRouteChange={setFoundationRoute} />
      </AppFrame>
    );
  }

  if (foundationRoute === 'account') {
    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <AccountSettings viewer={foundationViewer} />
      </AppFrame>
    );
  }

  if (foundationRoute === 'admin') {
    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <AdminPortal />
      </AppFrame>
    );
  }

  if (foundationRoute === 'notifications') {
    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <NotificationCenter />
      </AppFrame>
    );
  }

  return (
    <AppFrame activeRoute="fleet-command" viewer={foundationViewer} onRouteChange={setFoundationRoute}>
      <>
```

At the end of the existing return block, replace the final:

```tsx
    </>
  );
```

with:

```tsx
      </>
    </AppFrame>
  );
```

- [ ] **Step 4: Add placeholder rendering for draft routes**

Before the final Fleet Command return, add:

```tsx
  if (foundationRoute === 'rally-browse' || foundationRoute === 'spoils' || foundationRoute === 'proving-ground') {
    const draftTitle =
      foundationRoute === 'rally-browse'
        ? 'Rally Point'
        : foundationRoute === 'spoils'
          ? 'S.P.O.I.L.S.'
          : 'Proving Ground';

    return (
      <AppFrame activeRoute={foundationRoute} viewer={foundationViewer} onRouteChange={setFoundationRoute}>
        <section className="foundation-page narrow-page">
          <p className="eyebrow">Draft Now</p>
          <h1>{draftTitle}</h1>
          <p className="foundation-subtitle">
            This module is planned and will be built after the shared foundation and Fleet Command core are stable.
          </p>
        </section>
      </AppFrame>
    );
  }
```

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: TypeScript build succeeds.

- [ ] **Step 6: Start local app and verify manually**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL. Open the URL and verify:

- Landing renders first.
- Header navigation switches to Login, Browse Rally Point, Hub, Account, Notifications, Admin, and Fleet Command.
- Fleet Command still renders inside the new shared frame.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire foundation screens into app"
```

## Task 7: Add Foundation Styles

**Files:**

- Modify: `src/styles.css`

- [ ] **Step 1: Add foundation CSS**

Append to `src/styles.css`:

```css
.foundation-shell {
  min-height: 100vh;
  background: #10110d;
  color: #f1eadb;
}

.foundation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 18px;
  background: #1b1c15;
  border-bottom: 2px solid rgba(197, 153, 65, 0.35);
}

.foundation-brand,
.foundation-nav button,
.foundation-actions button,
.foundation-footer button {
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.foundation-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  color: #e0b24e;
}

.foundation-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.foundation-nav button {
  padding: 8px 10px;
  border-radius: 6px;
  color: #bfc4b3;
}

.foundation-nav button.active {
  background: #c5a044;
  color: #15150f;
}

.foundation-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.foundation-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
}

.mobile-menu-button {
  display: none;
}

.foundation-status-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 18px;
  background: #2d3024;
  color: #cbd0bd;
  font-size: 12px;
}

.foundation-main {
  min-height: calc(100vh - 190px);
}

.foundation-page {
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 42px 0;
}

.narrow-page {
  width: min(720px, calc(100vw - 32px));
}

.landing-hero {
  max-width: 760px;
  padding: 52px 0;
}

.landing-hero h1,
.foundation-page h1 {
  margin: 0;
  font-size: 48px;
  line-height: 1.04;
  letter-spacing: 0;
}

.landing-hero p,
.foundation-subtitle {
  color: #cbd0bd;
  font-size: 17px;
  line-height: 1.6;
}

.landing-actions,
.activity-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.foundation-primary,
.foundation-secondary,
.pillar-grid button,
.foundation-form-panel button {
  border: 0;
  border-radius: 6px;
  padding: 11px 14px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.foundation-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #d1a64a;
  color: #15150f;
}

.foundation-secondary {
  background: #3f4930;
  color: #f1eadb;
}

.pillar-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.pillar-grid article,
.pillar-grid button,
.activity-grid article,
.foundation-form-panel,
.admin-table,
.notification-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: #1b1c15;
  color: inherit;
  text-align: left;
}

.pillar-grid article,
.pillar-grid button,
.activity-grid article {
  padding: 18px;
}

.pillar-grid h2,
.pillar-grid strong {
  display: block;
  margin: 10px 0 8px;
  color: #f1eadb;
}

.pillar-grid p,
.pillar-grid span {
  color: #cbd0bd;
  line-height: 1.5;
}

.foundation-form-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  margin-top: 22px;
}

.foundation-form-panel label {
  display: grid;
  gap: 6px;
}

.foundation-form-panel input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  padding: 10px 12px;
  background: #10110d;
  color: #f1eadb;
}

.form-note,
.identity-row {
  color: #cbd0bd;
}

.admin-table {
  margin-top: 22px;
  overflow: hidden;
}

.admin-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr 0.8fr 0.8fr 1.6fr;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-row.header {
  border-top: 0;
  color: #d1a64a;
  font-weight: 800;
}

.notification-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.notification-card {
  display: grid;
  gap: 5px;
  padding: 14px;
}

.notification-card.read {
  opacity: 0.72;
}

.notification-card span,
.notification-card em {
  color: #cbd0bd;
}

.foundation-footer {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  background: #0b0c09;
  color: #aeb5a1;
  font-size: 12px;
}

.foundation-footer p {
  max-width: 780px;
  margin: 0;
  line-height: 1.5;
}

.foundation-footer div {
  display: flex;
  gap: 12px;
}

.foundation-footer button {
  color: #d1a64a;
}

@media (max-width: 900px) {
  .foundation-header {
    align-items: flex-start;
  }

  .foundation-nav {
    display: none;
  }

  .mobile-menu-button {
    display: inline-flex;
  }

  .landing-hero h1,
  .foundation-page h1 {
    font-size: 36px;
  }

  .pillar-grid {
    grid-template-columns: 1fr;
  }

  .admin-row {
    grid-template-columns: 1fr;
  }

  .foundation-footer {
    display: grid;
  }
}
```

- [ ] **Step 2: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Manually verify responsive basics**

Run:

```bash
npm run dev
```

Expected: Vite serves the app. Check desktop and narrow browser widths:

- Landing hero text does not overlap.
- Pillar cards stack on narrow screens.
- Admin rows collapse into a single column on narrow screens.
- Fleet Command remains usable inside `AppFrame`.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css
git commit -m "feat: add foundation shell styles"
```

## Task 8: Final Verification And Handoff

**Files:**

- Modify: `docs/handoff/project-change-log.md`

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 2: Add change log entry**

Append to `docs/handoff/project-change-log.md`:

```md
## 2026-05-20 - Shared Foundation First Build

- Decision: Added the first MusterDeck shared foundation shell, copy constants, route model, account/admin schema, and placeholder foundation screens around the existing Fleet Command prototype.
- Reason: Shared foundation unlocks accounts, navigation, admin controls, notifications, and future Rally Point/S.P.O.I.L.S. screens without blocking current Fleet Command work.
- Files affected: `src/lib/foundationTypes.ts`, `src/lib/appNavigation.ts`, `src/lib/foundationCopy.ts`, `src/lib/foundationData.ts`, `src/components/foundation/`, `src/App.tsx`, `src/styles.css`, `supabase/migrations/20260520190000_shared_foundation_accounts.sql`, `supabase/tests/shared_foundation_accounts_smoke.sql`.
- Follow-up: Create separate implementation plans for Fleet Command event settings/templates and real Supabase auth integration.
```

- [ ] **Step 3: Commit change log**

```bash
git add docs/handoff/project-change-log.md
git commit -m "docs: record shared foundation build"
```

- [ ] **Step 4: Report verification**

Final response should include:

- Test command results.
- Build command result.
- Whether Supabase migration verification ran locally or was blocked.
- Local dev server URL if still running.
- Next recommended plan: Fleet Command event settings/templates.
