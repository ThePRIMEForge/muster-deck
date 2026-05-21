# MusterDeck Foundation Visual Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved graphite-first, mustard-caution, modern industrial identity to the shared MusterDeck foundation screens.

**Architecture:** Keep the implementation CSS/token-first and avoid image dependencies. Add small, explicit component hooks for future brand plates, module icon plates, panel texture overlays, caution accents, and status stamps. Leave the legacy Fleet Command workspace unchanged except for any global variables that do not alter its layout.

**Tech Stack:** React 19, TypeScript, Vite, lucide-react, plain CSS in `src/styles.css`.

---

## File Structure

- Modify: `src/styles.css`
  - Add foundation design tokens to `:root`.
  - Replace the current foundation visual layer with graphite-first surfaces, mustard caution accents, restrained olive support, and responsive fixes.
  - Keep existing non-foundation fleet manager styles intact.
- Modify: `src/components/foundation/AppFrame.tsx`
  - Add brand plate, brand mark, status strip, and utility action hooks.
- Modify: `src/components/foundation/PublicLanding.tsx`
  - Add landing hero, module card, module icon plate, and accent hooks.
- Modify: `src/components/foundation/OperationsHub.tsx`
  - Add the same module card and activity panel hooks for authenticated foundation screens.
- Modify: `src/components/foundation/AuthScreen.tsx`
  - Add calm auth provider and submit button hooks.
- Modify: `src/components/foundation/AccountSettings.tsx`
  - Add identity status hooks for linked account rows.
- Modify: `src/components/foundation/AdminPortal.tsx`
  - Add admin table and row status hooks.
- Modify: `src/components/foundation/NotificationCenter.tsx`
  - Add notification state hooks for unread/read styling and category chips.

---

### Task 1: Add Foundation Design Tokens

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add foundation-level CSS variables**

In `src/styles.css`, update the existing `:root` block to include these variables below `background: #050505;`:

```css
  --md-bg: #070808;
  --md-bg-elevated: #0d0f0f;
  --md-surface: #141615;
  --md-surface-raised: #1b1e1b;
  --md-surface-muted: #24281f;
  --md-border-subtle: rgba(245, 240, 230, 0.1);
  --md-border-strong: rgba(245, 240, 230, 0.18);
  --md-border-caution: rgba(214, 154, 47, 0.5);
  --md-text: #f5f0e6;
  --md-text-secondary: #c9c2b2;
  --md-text-muted: #9f988b;
  --md-mustard: #d69a2f;
  --md-mustard-hot: #e0b552;
  --md-mustard-deep: #8d611e;
  --md-olive: #4f5a3f;
  --md-olive-muted: #303728;
  --md-caution-orange: #bd6537;
  --md-success: #4ade80;
  --md-focus: rgba(224, 181, 82, 0.45);
  --md-panel-shadow: 0 18px 44px rgba(0, 0, 0, 0.28);
  --md-inset-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  --md-texture-opacity: 0.18;
```

- [ ] **Step 2: Run a build check**

Run:

```bash
npm run build
```

Expected: build succeeds. If it fails, the failure should be unrelated to CSS variables because unused variables are valid CSS.

- [ ] **Step 3: Commit token setup**

Run:

```bash
git add src/styles.css
git commit -m "style: add foundation identity tokens"
```

---

### Task 2: Update Shared App Shell Hooks

**Files:**
- Modify: `src/components/foundation/AppFrame.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add shell markup hooks**

In `src/components/foundation/AppFrame.tsx`, replace the current brand button body:

```tsx
<Shield size={22} />
<span>MusterDeck</span>
```

with:

```tsx
<span className="foundation-brand-mark" aria-hidden="true">
  <Shield size={18} />
</span>
<span className="foundation-brand-copy">
  <span>MusterDeck</span>
  <small>Operations board</small>
</span>
```

In the same file, update each utility action button inside `.foundation-actions` to include `className="foundation-icon-action"`. The block should become:

```tsx
<div className="foundation-actions">
  <button
    className="foundation-icon-action"
    onClick={() => onRouteChange('notifications')}
    type="button"
    title="Notifications"
  >
    <Bell size={17} />
  </button>
  <button className="foundation-icon-action" onClick={() => onRouteChange('account')} type="button" title={viewer.displayName}>
    <UserRound size={17} />
  </button>
  <button className="foundation-icon-action" onClick={() => onRouteChange('login')} type="button" title="Log in">
    <LogIn size={17} />
  </button>
  <button className="foundation-icon-action mobile-menu-button" type="button" title="Menu">
    <Menu size={17} />
  </button>
</div>
```

Update the status strip spans to include a reusable class:

```tsx
<div className="foundation-status-strip">
  <span className="foundation-status-chip">Rally Point v0.1</span>
  <span className="foundation-status-chip">Fleet Command v0.1</span>
  <span className="foundation-status-chip">S.P.O.I.L.S. v0.1</span>
  <span className="foundation-status-chip">Proving Ground v0.1</span>
  <span className="foundation-status-chip">Star Citizen data: 4.8.0-LIVE.11825000</span>
</div>
```

- [ ] **Step 2: Replace shell CSS**

In `src/styles.css`, replace the existing foundation shell section from `.foundation-header,` through `.foundation-footer button` with this block:

```css
.foundation-shell {
  min-height: 100vh;
  background:
    linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
    radial-gradient(circle at 86% 0%, rgba(214, 154, 47, 0.12), transparent 28rem),
    radial-gradient(circle at 12% 8%, rgba(79, 90, 63, 0.16), transparent 24rem),
    var(--md-bg);
  background-size:
    24px 24px,
    24px 24px,
    auto,
    auto,
    auto;
  color: var(--md-text);
}

.foundation-header,
.foundation-brand,
.foundation-brand-copy,
.foundation-nav,
.foundation-actions,
.foundation-status-strip,
.landing-actions,
.activity-grid,
.foundation-footer,
.foundation-footer div {
  display: flex;
  align-items: center;
}

.foundation-header {
  position: sticky;
  top: 0;
  z-index: 40;
  gap: 16px;
  justify-content: space-between;
  min-height: 68px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--md-border-caution);
  background:
    linear-gradient(180deg, rgba(18, 20, 19, 0.98), rgba(9, 11, 11, 0.96)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.026) 0 1px, transparent 1px 26px);
  box-shadow: var(--md-panel-shadow);
  backdrop-filter: blur(12px);
}

.foundation-brand {
  position: relative;
  gap: 10px;
  min-width: 0;
  border: 1px solid var(--md-border-caution);
  border-radius: 8px;
  padding: 7px 10px 7px 7px;
  background:
    linear-gradient(180deg, rgba(214, 154, 47, 0.16), rgba(20, 22, 21, 0.96)),
    var(--md-surface);
  color: var(--md-text);
  box-shadow: var(--md-inset-highlight);
  font-weight: 900;
  text-transform: uppercase;
}

.foundation-brand::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: var(--md-texture-opacity);
  background:
    linear-gradient(128deg, transparent 0 22%, rgba(255, 255, 255, 0.22) 22.2%, transparent 23%),
    radial-gradient(circle at 12% 22%, rgba(0, 0, 0, 0.45) 0 2px, transparent 3px);
}

.foundation-brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 6px;
  background:
    linear-gradient(180deg, var(--md-mustard-hot), var(--md-mustard-deep)),
    repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.22) 0 2px, transparent 2px 9px);
  color: #15110a;
}

.foundation-brand-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
  align-items: flex-start;
  flex-direction: column;
  gap: 2px;
}

.foundation-brand-copy span,
.foundation-brand-copy small {
  min-width: 0;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.foundation-brand-copy small {
  color: var(--md-text-muted);
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.foundation-nav {
  flex: 1;
  gap: 6px;
  justify-content: center;
  min-width: 0;
}

.foundation-nav button,
.foundation-actions button,
.foundation-footer button {
  border: 0;
  background: transparent;
  color: inherit;
}

.foundation-nav button {
  position: relative;
  min-height: 38px;
  border-radius: 7px;
  padding: 8px 10px;
  color: var(--md-text-secondary);
  font-size: 0.84rem;
  font-weight: 800;
}

.foundation-nav button.active {
  background:
    linear-gradient(180deg, var(--md-mustard-hot), var(--md-mustard));
  color: #15110a;
  box-shadow:
    var(--md-inset-highlight),
    inset 0 -3px 0 rgba(0, 0, 0, 0.22);
}

.foundation-actions {
  gap: 8px;
}

.foundation-icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--md-border-subtle);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.045);
  color: var(--md-text-secondary);
  box-shadow: var(--md-inset-highlight);
}

.foundation-icon-action:hover,
.foundation-nav button:hover {
  border-color: var(--md-border-caution);
  color: var(--md-text);
}

.mobile-menu-button {
  display: none;
}

.foundation-status-strip {
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background:
    linear-gradient(90deg, rgba(214, 154, 47, 0.1), transparent 38rem),
    var(--md-olive-muted);
  color: #d6dccb;
  font-size: 0.72rem;
  font-weight: 800;
}

.foundation-status-chip {
  border: 1px solid rgba(245, 240, 230, 0.08);
  border-radius: 999px;
  padding: 4px 8px;
  background: rgba(7, 8, 8, 0.3);
  white-space: nowrap;
}

.foundation-main {
  min-height: calc(100vh - 174px);
}

.foundation-main .app-shell {
  min-height: calc(100vh - 174px);
}

.foundation-page {
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 42px 0;
}

.narrow-page {
  width: min(720px, calc(100vw - 32px));
}

.foundation-footer {
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-top: 1px solid var(--md-border-subtle);
  background: rgba(7, 8, 8, 0.96);
  color: var(--md-text-muted);
  font-size: 0.74rem;
}

.foundation-footer p {
  max-width: 820px;
  line-height: 1.5;
}

.foundation-footer div {
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

.foundation-footer button {
  color: var(--md-mustard-hot);
  font-weight: 800;
}
```

- [ ] **Step 3: Run foundation route build check**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 4: Commit app shell changes**

Run:

```bash
git add src/components/foundation/AppFrame.tsx src/styles.css
git commit -m "style: refresh foundation app shell"
```

---

### Task 3: Add Module Card Hooks To Landing And Hub

**Files:**
- Modify: `src/components/foundation/PublicLanding.tsx`
- Modify: `src/components/foundation/OperationsHub.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Update public landing module cards**

In `src/components/foundation/PublicLanding.tsx`, replace each module card icon usage with an icon plate. The first card should become:

```tsx
<article className="foundation-module-card">
  <span className="foundation-module-icon" aria-hidden="true">
    <Radio size={22} />
  </span>
  <h2>{moduleSummaries.rallyPoint.title}</h2>
  <p>{moduleSummaries.rallyPoint.description}</p>
</article>
```

Apply the same pattern to the other three cards with `ClipboardList`, `Coins`, and `Trophy`.

- [ ] **Step 2: Update hub module buttons**

In `src/components/foundation/OperationsHub.tsx`, add `className="foundation-module-card foundation-module-action"` to each pillar button and wrap each icon in `foundation-module-icon`.

The Rally Point button should become:

```tsx
<button className="foundation-module-card foundation-module-action" type="button" onClick={() => onRouteChange('rally-browse')}>
  <span className="foundation-module-icon" aria-hidden="true">
    <Radio size={22} />
  </span>
  <strong>{moduleSummaries.rallyPoint.action}</strong>
  <span>{moduleSummaries.rallyPoint.description}</span>
</button>
```

Apply the same pattern to the other three buttons with their existing route targets and icons.

Update the two activity articles to use a future panel hook:

```tsx
<div className="activity-grid">
  <article className="foundation-activity-panel">{foundationCopy.hub.emptyApprovals}</article>
  <article className="foundation-activity-panel">{foundationCopy.hub.emptySettlements}</article>
</div>
```

- [ ] **Step 3: Replace landing, card, and button CSS**

In `src/styles.css`, replace the current CSS from `.landing-hero {` through `.notification-card small { ... }` with this block:

```css
.landing-page {
  position: relative;
}

.landing-page::before {
  content: "";
  position: absolute;
  top: 28px;
  right: 0;
  width: min(420px, 42vw);
  height: 220px;
  pointer-events: none;
  opacity: 0.16;
  background:
    repeating-linear-gradient(135deg, var(--md-mustard) 0 8px, transparent 8px 14px),
    linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5));
  mask-image: linear-gradient(90deg, transparent, #000 35%, transparent);
}

.landing-hero {
  position: relative;
  max-width: 780px;
  padding: 52px 0;
}

.landing-hero h1,
.foundation-page h1 {
  margin: 6px 0 12px;
  color: var(--md-text);
  font-size: 3rem;
  line-height: 1.04;
  letter-spacing: 0;
}

.landing-hero p,
.foundation-subtitle {
  max-width: 760px;
  color: var(--md-text-secondary);
  font-size: 1.04rem;
  line-height: 1.6;
}

.landing-actions,
.activity-grid {
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.foundation-primary,
.foundation-secondary,
.pillar-grid button,
.foundation-form-panel button {
  min-height: 42px;
  border: 0;
  border-radius: 7px;
  padding: 11px 14px;
  font: inherit;
  font-weight: 900;
}

.foundation-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background:
    linear-gradient(180deg, var(--md-mustard-hot), var(--md-mustard));
  color: #15110a;
  box-shadow:
    var(--md-inset-highlight),
    inset 0 -3px 0 rgba(0, 0, 0, 0.24);
}

.foundation-secondary {
  background: var(--md-olive);
  color: var(--md-text);
  box-shadow: var(--md-inset-highlight);
}

.pillar-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.foundation-module-card,
.foundation-activity-panel,
.foundation-form-panel,
.admin-table,
.notification-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--md-border-subtle);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent),
    var(--md-surface);
  color: inherit;
  text-align: left;
  box-shadow: var(--md-inset-highlight);
}

.foundation-module-card::before,
.foundation-activity-panel::before,
.foundation-form-panel::before,
.admin-table::before,
.notification-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: var(--md-texture-opacity);
  background:
    linear-gradient(126deg, transparent 0 18%, rgba(255, 255, 255, 0.18) 18.3%, transparent 19%),
    linear-gradient(84deg, transparent 0 63%, rgba(0, 0, 0, 0.34) 63.2%, transparent 64%);
}

.foundation-module-card > *,
.foundation-activity-panel > *,
.foundation-form-panel > *,
.admin-table > *,
.notification-card > * {
  position: relative;
  z-index: 1;
}

.foundation-module-card {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 18px;
}

.foundation-module-action {
  width: 100%;
}

.foundation-module-action:hover {
  border-color: var(--md-border-caution);
  transform: translateY(-1px);
}

.foundation-module-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 7px;
  background:
    linear-gradient(180deg, rgba(214, 154, 47, 0.2), rgba(141, 97, 30, 0.18)),
    var(--md-bg-elevated);
  color: var(--md-mustard-hot);
  box-shadow: var(--md-inset-highlight);
}

.pillar-grid h2,
.pillar-grid strong {
  display: block;
  margin: 0;
  color: var(--md-text);
}

.pillar-grid p,
.pillar-grid span,
.foundation-activity-panel {
  color: var(--md-text-secondary);
  line-height: 1.5;
}

.foundation-activity-panel {
  flex: 1 1 260px;
  min-height: 74px;
  padding: 18px;
}
```

- [ ] **Step 4: Run build check**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 5: Commit module card changes**

Run:

```bash
git add src/components/foundation/PublicLanding.tsx src/components/foundation/OperationsHub.tsx src/styles.css
git commit -m "style: add foundation module card identity"
```

---

### Task 4: Add Form, Admin, And Notification State Hooks

**Files:**
- Modify: `src/components/foundation/AuthScreen.tsx`
- Modify: `src/components/foundation/AccountSettings.tsx`
- Modify: `src/components/foundation/AdminPortal.tsx`
- Modify: `src/components/foundation/NotificationCenter.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Update auth buttons**

In `src/components/foundation/AuthScreen.tsx`, update the first two buttons inside `.foundation-form-panel`:

```tsx
<button className="foundation-provider-button" type="button">
  {foundationCopy.auth.discord}
</button>
<button className="foundation-provider-button" type="button">
  {foundationCopy.auth.google}
</button>
```

Leave the email submit button as `className="foundation-primary"`.

- [ ] **Step 2: Update account identity rows**

In `src/components/foundation/AccountSettings.tsx`, replace the two identity rows with:

```tsx
<div className="identity-row identity-row-linked">
  <span>Discord linked</span>
</div>
<div className="identity-row identity-row-linked">
  <span>Google linked</span>
</div>
```

- [ ] **Step 3: Update admin row classes**

In `src/components/foundation/AdminPortal.tsx`, update the mapped admin row class to include account status:

```tsx
<div className={`admin-row admin-row-${user.accountStatus}`} role="row" key={user.id}>
```

- [ ] **Step 4: Update notification card classes**

In `src/components/foundation/NotificationCenter.tsx`, replace the `article` class expression with:

```tsx
<article
  className={`notification-card ${notification.read ? 'read' : 'unread'} notification-${notification.category}`}
  key={notification.id}
>
```

- [ ] **Step 5: Add calm form, admin, and notification CSS**

In `src/styles.css`, after the Task 3 block, add this CSS:

```css
.foundation-form-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  margin-top: 22px;
}

.foundation-form-panel label {
  display: grid;
  gap: 6px;
  color: var(--md-text-secondary);
  font-size: 0.86rem;
  font-weight: 800;
}

.foundation-form-panel input {
  width: 100%;
  border: 1px solid var(--md-border-strong);
  border-radius: 7px;
  padding: 11px 12px;
  background: var(--md-bg-elevated);
  color: var(--md-text);
}

.foundation-form-panel input:focus {
  border-color: var(--md-border-caution);
  box-shadow: 0 0 0 3px var(--md-focus);
  outline: 0;
}

.foundation-provider-button {
  border: 1px solid var(--md-border-subtle);
  background: rgba(255, 255, 255, 0.045);
  color: var(--md-text);
}

.form-note,
.identity-row {
  color: var(--md-text-secondary);
}

.identity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  border: 1px solid var(--md-border-subtle);
  border-radius: 7px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.035);
}

.identity-row-linked::after {
  content: "Linked";
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 999px;
  padding: 3px 8px;
  color: var(--md-success);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
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
  border-top: 1px solid rgba(245, 240, 230, 0.08);
  color: var(--md-text-secondary);
}

.admin-row strong {
  color: var(--md-text);
}

.admin-row.header {
  border-top: 0;
  color: var(--md-mustard-hot);
  font-weight: 900;
  text-transform: uppercase;
}

.admin-row-restricted,
.admin-row-suspended {
  box-shadow: inset 4px 0 0 var(--md-caution-orange);
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

.notification-card.unread {
  border-color: var(--md-border-caution);
  box-shadow:
    inset 4px 0 0 var(--md-mustard),
    var(--md-inset-highlight);
}

.notification-card.read {
  opacity: 0.72;
}

.notification-card span,
.notification-card em,
.notification-card small {
  color: var(--md-text-secondary);
}

.notification-card small {
  width: fit-content;
  border: 1px solid rgba(214, 154, 47, 0.28);
  border-radius: 999px;
  padding: 3px 8px;
  color: var(--md-mustard-hot);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}
```

- [ ] **Step 6: Run build check**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 7: Commit form, admin, and notification changes**

Run:

```bash
git add src/components/foundation/AuthScreen.tsx src/components/foundation/AccountSettings.tsx src/components/foundation/AdminPortal.tsx src/components/foundation/NotificationCenter.tsx src/styles.css
git commit -m "style: refine foundation state surfaces"
```

---

### Task 5: Tighten Responsive Behavior

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Replace foundation mobile CSS**

In `src/styles.css`, replace the foundation media-query portion from `@media (max-width: 1180px) {` through the closing `@media (max-width: 760px)` block with:

```css
@media (max-width: 1180px) {
  .pillar-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .foundation-header {
    align-items: flex-start;
    gap: 10px;
  }

  .foundation-brand {
    max-width: calc(100vw - 190px);
  }

  .foundation-nav {
    display: none;
  }

  .mobile-menu-button {
    display: inline-flex;
  }

  .foundation-status-strip {
    gap: 6px;
    padding: 8px 12px;
  }

  .foundation-status-chip {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .foundation-page {
    width: min(100% - 24px, 1180px);
    padding: 28px 0;
  }

  .landing-hero {
    padding: 30px 0;
  }

  .landing-hero h1,
  .foundation-page h1 {
    font-size: 2.2rem;
  }

  .pillar-grid {
    grid-template-columns: 1fr;
  }

  .admin-row {
    grid-template-columns: 1fr;
  }

  .foundation-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

- [ ] **Step 2: Run build check**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Commit responsive polish**

Run:

```bash
git add src/styles.css
git commit -m "style: tighten foundation responsive layout"
```

---

### Task 6: Browser Verification And Final Commit Check

**Files:**
- Verify: `src/components/foundation/*.tsx`
- Verify: `src/styles.css`

- [ ] **Step 1: Run full automated checks**

Run:

```bash
npm run test
npm run build
```

Expected: both commands pass.

- [ ] **Step 2: Start local dev server**

Run:

```bash
npm run dev -- --port 5173
```

Expected: Vite serves the app at `http://127.0.0.1:5173/`. If port 5173 is occupied, use the URL printed by Vite.

- [ ] **Step 3: Verify desktop foundation screens in browser**

Open the app in the in-app browser at the Vite URL. Check these routes by using the visible navigation and app controls:

- Public landing page.
- Operations Hub.
- Account.
- Notifications.
- Admin.
- Login.
- Sign up.

Expected:

- Graphite is the dominant surface color.
- Mustard is visible as the brand and active/action signal.
- Olive appears only as support.
- Header, status strip, footer, module cards, forms, admin table, and notifications share one visual system.
- No text overlaps visible controls.
- No custom image asset is required.

- [ ] **Step 4: Verify mobile width**

Use browser responsive tools or a narrow viewport around 390 px wide.

Expected:

- Brand text truncates cleanly when space is tight.
- Mobile menu icon appears.
- Navigation hides.
- Status chips wrap without overlapping.
- Module cards stack.
- Admin rows stack.
- Form controls fit within the viewport.

- [ ] **Step 5: Stop local dev server**

Stop the running Vite process with `Ctrl-C` in the terminal session that started it.

- [ ] **Step 6: Confirm only intended files are changed**

Run:

```bash
git status --short
```

Expected changed files are limited to:

```text
src/components/foundation/AccountSettings.tsx
src/components/foundation/AdminPortal.tsx
src/components/foundation/AppFrame.tsx
src/components/foundation/AuthScreen.tsx
src/components/foundation/NotificationCenter.tsx
src/components/foundation/OperationsHub.tsx
src/components/foundation/PublicLanding.tsx
src/styles.css
```

The existing untracked staffing-template files may remain visible and must not be staged by this plan.

- [ ] **Step 7: Create final integration commit if needed**

If browser verification required fixes after the task commits, stage only the foundation files and commit them:

```bash
git add src/components/foundation/AccountSettings.tsx src/components/foundation/AdminPortal.tsx src/components/foundation/AppFrame.tsx src/components/foundation/AuthScreen.tsx src/components/foundation/NotificationCenter.tsx src/components/foundation/OperationsHub.tsx src/components/foundation/PublicLanding.tsx src/styles.css
git commit -m "style: polish foundation visual identity"
```

If there are no post-verification fixes, do not create an empty commit.
