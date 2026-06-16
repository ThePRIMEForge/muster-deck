# MusterDeck copy master plan

Date: 2026-05-22
Owner: Christoph
Status: Draft for review. No final copy yet. Structure only, plus article outlines for help.
Scope: All product copy, help taxonomy, and legal structure. Tournament and setup disclaimers included.

## How this document is used

This is a planning inventory, not finished copy. Every section below names the surfaces, the copy slots inside each surface, and the disclaimers attached. Once you approve the structure, we draft copy surface by surface, starting with whichever pillar is most useful first.

Translation note: product copy is English only. Terms of Service and Privacy Policy will be planned in English with a parallel German version flagged as required for German users and German hosting context.

## Global rules anchoring all copy

Voice: operational, not marketing-y. Plain-spoken. Confident without slogans. Treat the reader as a competent crewmember who needs a clear path, not a prospect being sold to.

Banned across the product: em dashes, en dashes, and the vocabulary list already locked in your writing rules. Passive voice only where it reads more naturally than active. No section-ending summaries inside the product itself.

Capitalization: sentence case for all headings, including legal. Pillar names always written exactly: Rally Point, Fleet Command, S.P.O.I.L.S., Proving Ground. The periods in S.P.O.I.L.S. are part of the name.

Naming locks (do not drift):
- "Operations Hub" is the signed-in home label.
- "Create account" and "Log in" are the public CTAs. Never "Report in" on public surfaces.
- "SC Operations" is the small preheading on the public landing. Not "Star Citizen operations."
- Hero headline: "Rally, Command, Settle."
- Pillar cards on the public landing open modal briefs, never deep-link.

## Global copy elements (present on every page)

### Top header (Lane A on landing/hub, Lane C inside pillars, Lane D inside dense panels)

Slots:
- Brand mark wordmark: MusterDeck
- Small caption near logo (optional): "SC operations console"
- Primary nav labels per surface (defined per pillar below)
- Account menu trigger label when signed in: handle or callsign
- Account menu trigger label when signed out: "Log in" and "Create account"

### Footer caution band

Slots:
- Centered fan-project disclaimer (full text below)
- Version chips: Rally v0.1, Fleet v0.1, S.P.O.I.L.S. v0.1, Ground v0.1, SC data 4.8.0-LIVE.11825000
- Link row: Terms, Privacy, Acceptable use, Tournament rules, Help, Status, Contact
- Locale and timezone indicator (read-only for now): "EN, UTC"
- Build hash, small mono text

Fan-project disclaimer (universal, lives in footer and in setup screen):

> MusterDeck is an independent fan-made tool. It is not affiliated with, endorsed by, sponsored by, or officially connected to Cloud Imperium Games, Roberts Space Industries, or their affiliates. Star Citizen and Squadron 42 are trademarks of Cloud Imperium Games. All in-universe names, ships, locations, and artwork remain the property of their respective owners.

### Cookie and tracking notice (banner on first visit)

Slots:
- Headline: short, one line
- Body: two sentences max, what is stored and why
- Actions: "Accept all", "Only essentials", "Manage preferences"
- Link to Privacy Policy
- Persistent reopen control in footer ("Cookie preferences")

GDPR note: pre-ticked boxes are not allowed. Only essential cookies may load before consent. This is enforced in implementation, not just copy.

### Always-on legal microcopy locations

- Bottom of every form that creates content (events, prizes, tournament brackets): one-line reminder that user content must follow Acceptable Use and may be removed.
- Bottom of every payment-adjacent surface in S.P.O.I.L.S.: a reminder that MusterDeck does not transfer real currency, ships, or in-game items. Payouts in S.P.O.I.L.S. are bookkeeping only.
- Bottom of every tournament setup screen: tournament disclaimer (full text in legal section).

## Public landing page

URL: /

Goal: explain what MusterDeck is in under ten seconds, prove it is operational not promotional, push the visitor to "Create account" or "Log in" without pressure.

### Section A: Hero

- Preheading: "SC Operations" (small, mustard, stencil)
- Headline: "Rally, Command, Settle."
- Subheadline: one line, plain. Describe what crews can do here.
- Primary CTA: Create account
- Secondary CTA: Log in
- Tertiary link: "What is this?" anchors to section B

### Section B: What MusterDeck is

- Heading: "An operations console for Star Citizen crews"
- Body: 3 to 5 short sentences. Position as fan-built operations tooling, not a marketing site, not a guild manager, not a Discord replacement.
- Inline reassurance line: "Independent fan project. Not affiliated with Cloud Imperium Games or RSI."

### Section C: The four pillars (cards open modal briefs)

Card 1: Rally Point
- One-line role: "Find or publish operations."
- Modal brief contents (planned in pillar section below)

Card 2: Fleet Command
- One-line role: "Plan ships, staff crews, run ops."
- Modal brief contents (planned below)

Card 3: S.P.O.I.L.S.
- One-line role: "Settle loot, payouts, and prize ledgers."
- Modal brief contents (planned below)

Card 4: Proving Ground
- One-line role: "Run tournaments and competitive events."
- Modal brief contents (planned below)

### Section D: Who it is for

- Heading: "Built for the whole crew"
- Body: short paragraph naming roles served (pilots, gunners, miners, salvagers, haulers, medics, marines, quartermasters, organizers, tournament admins, support).
- One-line value statement: "Not just combat-focused."

### Section E: What it is not

- Heading: "What MusterDeck does not do"
- Bullet list (allowed here because clarity beats prose):
  - Not a Discord replacement.
  - Not a launcher, mod, or game add-on.
  - Not an in-game overlay.
  - Not affiliated with CIG, RSI, or any in-game faction.
  - Does not move real money or in-game items between players.

### Section F: Status and roadmap

- Heading: "Where we are right now"
- Body: 2 sentences on current state (pre-launch, foundation shell, four pillars in early build).
- Link: "Read the changelog" goes to public changelog page.
- Link: "Status" goes to status page.

### Section G: Final CTA strip

- Heading: "Ready to join a crew?"
- Sub: short line about creating an account being free.
- CTAs: Create account, Log in

### Section H: Footer (global, defined above)

### Microcopy slots on landing

- Image alt text for hero background plate.
- Aria labels for pillar card modal triggers.
- Skip-to-content link copy.
- 404 page copy (lives at /404).
- Maintenance page copy (lives at /maintenance).

## Account flow

### Sign up screen

URL: /signup

Slots:
- Headline: "Create your MusterDeck account"
- Sub: one-line on why we collect what we collect
- Field labels: Email, Password, Callsign or display name, RSI handle (optional at signup)
- Consent checkboxes:
  - Accept Terms of Service (link)
  - Accept Privacy Policy (link)
  - Confirm age (16+ for EU users, see Privacy section)
  - Optional: opt in to product update emails
- Submit button: "Create account"
- Provider buttons: "Continue with Discord", "Continue with Google"
- Footer link: "Already have an account? Log in"
- Error states, all defined below in system messaging
- Disclaimer below the form: short fan-project notice, links to full notice

### Email verification screen

URL: /verify

Slots:
- Headline: "Check your email"
- Sub: explain that a verification link was sent
- Body: 2 lines, plain
- Buttons: "Resend email", "Use a different address"
- Edge case: link expired page copy

### Log in screen

URL: /login

Slots:
- Headline: "Log in"
- Sub: one short line
- Field labels: Email or callsign, Password
- Link: "Forgot password?"
- Provider buttons: "Continue with Discord", "Continue with Google"
- Footer link: "New here? Create account"

### Password reset

URL: /reset

Two states:
- Request reset: short form, one line of explanation.
- New password set: short form, password rules listed inline.

### Setup / onboarding flow (post-verification)

URL: /setup

This is where the binding disclaimer lives. Multi-step:

Step 1, Welcome:
- Headline: "Welcome to MusterDeck"
- Body: 2 to 3 short sentences. Set expectations. State fan-project status up front.
- Required acceptance block (separate from sign up consent):
  - Title: "Before you continue"
  - Body: the full setup disclaimer (drafted in legal section below)
  - Checkbox: "I understand MusterDeck is an unofficial fan-made tool and I agree to the Terms of Service, Acceptable Use, and Privacy Policy."
  - Continue button disabled until checked
- Note: this is a hard gate. It exists so we can prove informed consent if challenged.

Step 2, Identity:
- Set callsign / display name
- Link RSI handle (optional, with explanation of what verification does)
- Choose primary roles you play (pilot, gunner, miner, etc.) for matching
- Choose preferred timezone
- Choose preferred languages

Step 3, Comms preferences:
- Email notifications opt-in toggles
- Discord notifications opt-in (if Discord linked)
- Frequency settings

Step 4, Optional org link:
- "Join an org now or later"
- Search box for orgs
- Skip link

Step 5, Done:
- Headline: "You're in."
- Sub: short line on where to go next
- CTAs: "Go to Operations Hub", "Open Rally Point"

### Account deletion flow

URL: /account/delete

Required for GDPR compliance.

Slots:
- Headline: "Delete your account"
- Body: what gets deleted, what is retained for legal reasons (e.g. financial-style audit trails in S.P.O.I.L.S.), how long retention runs
- Confirmation pattern: type "DELETE" to confirm
- Final button: "Delete my account permanently"
- Confirmation screen and email confirmation

## Operations Hub (signed-in home)

URL: /hub

Goal: a calm landing surface that orients the user, shows what is current, and routes them into a pillar.

### Section A: Greeting strip

- Headline: "Welcome back, {callsign}."
- Sub: one-line operational status (e.g., "3 active operations, 1 awaiting your response")

### Section B: Quick actions

- Buttons: "Post an op" (Rally), "Open Fleet" (Fleet), "Settle an event" (S.P.O.I.L.S.), "Run a tournament" (Proving Ground)

### Section C: Your current involvement

- Heading: "Where you're already deployed"
- Empty state copy if user has no involvement
- Card list of active engagements (events, ops, tournaments, settlement claims)

### Section D: Recently published in your orgs

- Heading: "From your orgs"
- Empty state copy if user has no org links

### Section E: Public board preview

- Heading: "Open ops on Rally Point"
- 3 to 5 recent public ops with a "See all" link

### Section F: System messages strip

- For announcements, planned outages, version notes
- Inline dismiss

### Microcopy slots on hub

- Empty state for every section
- Loading states
- Stale-data indicator copy ("Last refreshed 4 minutes ago")

## Rally Point pillar

Role: LFG and operations board. Guest-browsable public list; posting and joining require an account.

### Surfaces

1. Public board: /rally
2. Single op view, public: /rally/op/{id}
3. My ops, signed in: /rally/mine
4. Post an op: /rally/new
5. Manage an op (host view): /rally/op/{id}/manage
6. Applicant review (host view): /rally/op/{id}/applicants
7. Join code redemption: /rally/join/{code}

### Copy slots per surface

Public board:
- Page heading: "Rally Point"
- Sub: one line on what this board is
- Filter labels: Activity type, Crew size, Skill or trust level, Timeframe, Language, Region/timezone, Voice required, Roles wanted
- Sort labels: Newest, Soonest, Closing, Most applicants
- Card slots: title, host callsign + verified badge if RSI-verified, activity tags, time block, crew size, roles wanted, trust requirements, language, voice, join CTA label
- Empty state copy

Single op view:
- Title (host-defined)
- Host block
- Mission brief
- Roles wanted
- Ship requirements
- Trust / experience requirements
- Time and timezone
- Voice channel info
- Apply / Join CTA copy
- "Report this op" link copy (links to moderation form)

Post an op (form):
- Field labels (full list)
- Helper text under each field, short
- Visibility selector: Public, Org-only, Invite-only
- Submit button: "Post operation"
- Save draft button
- Form-level warning: user content must follow Acceptable Use; safety wording about not sharing real-world contact info

Manage an op:
- Tabs: Brief, Roster, Applicants, Logistics, Updates
- Per-tab copy slots
- "Cancel operation" confirmation modal copy
- "Mark complete" confirmation modal copy

Applicant review:
- Action labels: Approve, Decline, Waitlist, Block
- Note field placeholder text
- Decline reason templates (selectable, editable): too full, missing experience, missing ship, declined by host
- Bulk action labels

Join code redemption:
- Headline: "You've been invited"
- Body: short
- Action: "Accept invitation" or "Decline"

### Disclaimers attached to Rally Point

- On Post an op form: standard Acceptable Use reminder
- On Apply: short note that approval is at the host's discretion and that MusterDeck does not mediate disputes between players in-game
- On any free-text field: standard content moderation notice

## Fleet Command pillar

Role: org-officer planning. Ship requests, staffing, rosters, command views. Account required, additional role gating inside the pillar.

### Surfaces

1. Fleet home: /fleet
2. Org dashboard: /fleet/org/{orgId}
3. Ship roster: /fleet/org/{orgId}/ships
4. Crew roster: /fleet/org/{orgId}/crew
5. Operations planning board: /fleet/op/{id}/plan
6. Staffing template editor: /fleet/templates
7. Live ops view (read-only for non-officers): /fleet/op/{id}/live
8. Officer-only tools and audit log: /fleet/org/{orgId}/audit

### Copy slots per surface

Fleet home:
- Headline: "Fleet Command"
- Sub: one line
- Cards: each org the user belongs to, role chip, quick actions
- Empty state if user belongs to no orgs

Org dashboard:
- Org name, banner, motto field
- Quick stats: active ops, pending requests, ships deployed
- Tabs: Overview, Ships, Crew, Operations, Settings, Audit
- Settings text labels

Ship roster:
- Column headers: Hull, Tail number, Owner, Status, Loadout notes, Last flown
- Status chip labels: Available, In op, Maintenance, Lost, Recovered, Loaner
- Filter copy
- "Request a ship" CTA copy

Crew roster:
- Column headers: Callsign, RSI handle, Roles, Trust tier, Timezone, Languages, Joined
- Trust tier labels: defined per org, presets named
- Bulk action labels

Operations planning board:
- Tabs: Mission brief, Ship plan, Crew plan, Comms, Timeline, Risk notes
- Helper text on each tab
- Save and lock states
- "Roster lock" confirmation copy
- "Unlock roster" confirmation copy

Staffing template editor:
- Headline: "Staffing templates"
- Sub: one line on what templates do
- Editor labels: Template name, Activity type, Roles + counts, Ship requirements, Notes
- Save and publish buttons

Live ops view:
- Banner: "Live operation"
- Status feed copy (officer updates push here)
- Crewmember check-in CTA copy
- Stand-down confirmation copy

Audit log:
- Column headers: Time, Actor, Action, Target, Notes
- Filter copy
- Export CSV button

### Disclaimers attached to Fleet Command

- On any free-text broadcast: reminder it is recorded in audit log
- On audit export: short statement on data retention and that exports are user-controlled
- On role management: short statement that MusterDeck does not verify in-game ranks; trust is org-set

## S.P.O.I.L.S. pillar

Role: post-event settlement, payouts, prize ledger. Account required. Highest legal sensitivity after Proving Ground because money words appear here.

### Critical naming and framing

Do not use "wallet," "payment," "transfer," "balance," "cash out," or "deposit" anywhere in S.P.O.I.L.S. The product is a ledger and a record-keeper, not a payment system. Replace with: ledger, distribution, allocation, payout record, claim, share.

### Surfaces

1. S.P.O.I.L.S. home: /spoils
2. Settlement for an op or event: /spoils/event/{id}
3. Prize and reward catalog: /spoils/catalog
4. Org bank reserves: /spoils/org/{orgId}/reserves
5. Claim review queue: /spoils/event/{id}/claims
6. My distribution history: /spoils/me
7. Tournament prize ledger (linked from Proving Ground): /spoils/tournament/{id}

### Copy slots per surface

S.P.O.I.L.S. home:
- Headline: "S.P.O.I.L.S."
- Sub: one short line; remove any ambiguity: "Distribution and prize records. No real money handling."
- Quick actions: New settlement, Open catalog, View my history
- Persistent legal strip below the headline: short one-liner that S.P.O.I.L.S. is a bookkeeping tool

Settlement for an op or event:
- Tabs: Yield, Shares, Distribution, History, Notes
- Yield entry labels: item, source (mining, salvage, cargo, sale, prize), quantity, value (aUEC or in-game currency), notes
- Share scheme labels: Equal, Weighted by role, Weighted by contribution, Custom
- Distribution confirmation copy
- "Lock distribution" confirmation modal
- "Reopen distribution" confirmation modal

Prize and reward catalog:
- Headline: "Prize catalog"
- Filter copy
- Card slots: prize name, type (ship, component, weapon, currency, custom), value, source, status
- Add prize CTA

Org bank reserves:
- Headline: "Reserves"
- Sub: one line on what reserves represent (org-held, not personal)
- Column headers: Item, Quantity, Notes, Last change, By
- Audit link

Claim review queue:
- Action labels: Approve, Adjust, Decline, Hold, Request evidence
- Template decline reasons

My distribution history:
- Filter copy
- Empty state
- Export CSV button

### Disclaimers attached to S.P.O.I.L.S.

A persistent banner near every action that records or modifies a distribution:

> S.P.O.I.L.S. is a record-keeping tool. It does not move real money, in-game currency, or in-game items. Actual transfers happen in Star Citizen by the players involved. MusterDeck only records what was agreed and reported.

Full legal version appears in the Terms.

## Proving Ground pillar

Role: tournaments and competitive events. Account required. Some leaderboards may be public read-only.

### Surfaces

1. Proving Ground home: /ground
2. Tournament browse (public read-only): /ground/browse
3. Tournament page (public read for many fields, signed-in actions): /ground/t/{id}
4. Bracket view (read for spectators): /ground/t/{id}/bracket
5. Tournament setup wizard (organizer only): /ground/t/new
6. Manage tournament (organizer): /ground/t/{id}/manage
7. Score entry: /ground/t/{id}/score
8. Standings and leaderboards: /ground/t/{id}/standings
9. Team registration: /ground/t/{id}/register
10. Public leaderboards (multi-tournament): /ground/leaderboards

### Copy slots per surface

Proving Ground home:
- Headline: "Proving Ground"
- Sub: one line
- Quick actions: Browse tournaments, Run a tournament, My teams, My match history

Tournament page:
- Title, host, status chip (Draft, Open, Locked, In progress, Final)
- Format label (Single elimination, Double elimination, Round robin, Swiss, Leaderboard, Group + finals)
- Crew size label (1v1, 2v2, 3v3, 4v4, 5v5, custom)
- Schedule block
- Prize block (links to S.P.O.I.L.S. prize ledger if attached)
- Rules summary block
- Disclaimers block (full text below)
- CTAs: Register team, Watch, Report scores (role-gated)

Bracket view:
- Match cards
- Score entry CTA, role-gated
- Dispute CTA copy

Tournament setup wizard (organizer):
- Step 1, Basics: name, format, crew size, schedule
- Step 2, Rules: rules text, screenshot proof requirements, dispute window, no-show window
- Step 3, Registration: open/close windows, fee model (if any, see legal note below), eligibility
- Step 4, Prizes: link to S.P.O.I.L.S. prize ledger or describe externally
- Step 5, Conduct policy: link to MusterDeck Acceptable Use and any additional organizer rules
- Step 6, Required acceptance gate (this is the binding disclaimer for tournaments)

The organizer acceptance gate text is the full tournament disclaimer (drafted in legal section).

Manage tournament:
- Tabs: Registration, Bracket, Scores, Standings, Disputes, Conduct, Audit
- Per-tab labels and helper text

Score entry:
- Field labels: Round, Match, Team A, Team B, Score A, Score B, Result, Evidence link
- "Submit score" button
- "Dispute this match" button
- Helper text on evidence

Standings and leaderboards:
- Column headers
- Tie-break rule description copy
- Time-window label

Team registration:
- Field labels: Team name, Captain, Roster, Region, Time availability
- Roster size warnings
- Roster lock copy

### Disclaimers attached to Proving Ground (critical)

Persistent at top of every tournament page, every setup screen, and every bracket:

> Tournaments hosted via MusterDeck are organized by independent users. MusterDeck provides scheduling, registration, bracket, scoring, and ledger tools only. MusterDeck does not host, sponsor, or guarantee tournaments, prizes, or fair play. All disputes, eligibility decisions, prize delivery, and conduct enforcement remain with the tournament organizer. Star Citizen and all related trademarks are owned by Cloud Imperium Games. MusterDeck is not affiliated with CIG or RSI.

Additional disclaimer surfaces:
- On any tournament that mentions prizes with real-world value: an extra warning that prize distribution is the organizer's responsibility, and that local laws apply.
- On score disputes: a notice that final ruling rests with the named organizer.
- On any setup that suggests entry fees or paid-prize structure: a strong warning that paid-entry skill tournaments are regulated differently in different jurisdictions, and a recommendation to consult local law. MusterDeck does not handle payments.

## Help and Guides system

Structure approved scope: top-level taxonomy plus per-article outlines.

URL pattern: /help, /help/{category}, /help/{category}/{article-slug}

### Help home (/help)

Slots:
- Search bar
- Featured guides row
- Category cards (defined below)
- "What's new" feed (changelog mirror)
- Contact link

### Category structure

1. Getting started
2. Rally Point guides
3. Fleet Command guides
4. S.P.O.I.L.S. guides
5. Proving Ground guides
6. Account, identity, and privacy
7. Org administration
8. Tournament organizer playbook
9. Trust, verification, and reputation
10. Notifications and integrations
11. Troubleshooting and known issues
12. Policies and legal

### Article outlines

Each outline lists the article title plus the headings and key points to cover. Body prose is drafted later.

#### 1. Getting started

Article 1.1, What MusterDeck is and is not
- What this tool actually does
- Who it is for
- Who it is not for
- Fan-project status, plain language
- What to do next

Article 1.2, Creating your account
- Sign-up options (email, Discord, Google)
- What we ask for and why
- Verifying your email
- Linking your RSI handle and what verification gets you
- Choosing a callsign

Article 1.3, Touring the Operations Hub
- The four pillars at a glance
- The signed-in home
- Where to find your activity
- Where the disclaimers live

Article 1.4, Joining or creating an org
- Difference between solo and org use
- Joining an org via invite or code
- Creating an org and who should
- Org roles and trust tiers

#### 2. Rally Point guides

Article 2.1, Finding an operation as a player
- Browsing the public board
- Filtering effectively
- Reading a mission brief
- How applications work
- Etiquette and trust signals

Article 2.2, Posting an operation as a host
- Choosing visibility
- Writing a clear brief (template-style guidance)
- Specifying roles and ship needs
- Setting trust requirements
- Managing applicants

Article 2.3, Trust tiers and verification on Rally
- Why trust tiers exist
- What "RSI verified" means and does not mean
- Host-set trust filters
- Reporting bad behavior

Article 2.4, Cancelling or completing an op
- Cancellation reasons
- Notifying applicants
- Marking complete and linking to settlement

#### 3. Fleet Command guides

Article 3.1, Setting up your org in Fleet Command
- Org basics
- Inviting officers
- Setting trust tiers
- Linking comms

Article 3.2, Building a ship roster
- Adding ships and tail numbers
- Status and maintenance flags
- Loaners and shared ships
- Loss and recovery records

Article 3.3, Building a crew roster
- Inviting members
- Role tags and primary roles
- Trust tier assignment
- Inactive and parted-ways handling

Article 3.4, Planning an operation
- Using staffing templates
- Locking rosters
- Coordinating ship and crew plans
- Live ops view and stand-down

Article 3.5, The audit log
- What gets logged
- How long it is kept
- Who can see it
- How to export it

#### 4. S.P.O.I.L.S. guides

Article 4.1, What S.P.O.I.L.S. is
- The bookkeeping framing
- What it does not do (real-money, in-game transfers)
- How it fits with Rally and Fleet

Article 4.2, Setting up a settlement
- Yield entry
- Share schemes
- Custom weightings
- Locking and history

Article 4.3, Org bank reserves
- What reserves represent
- Adding and removing items
- Audit and accountability

Article 4.4, Using the prize catalog
- Adding prizes
- Attaching prizes to tournaments
- Status flags

Article 4.5, Distribution disputes
- How to raise a dispute
- What MusterDeck can and cannot do
- Org-level resolution paths

#### 5. Proving Ground guides

Article 5.1, Tournament formats explained
- Single elimination
- Double elimination with losers
- Round robin
- Swiss
- Leaderboards
- Group stage to finals

Article 5.2, Running your first tournament
- Setup wizard walk-through
- Required acceptance gate
- Setting eligibility
- Setting dispute windows

Article 5.3, Registration and roster locks
- Open and close windows
- Eligibility checks
- Substitutes and roster changes
- Roster lock timing

Article 5.4, Bracket management
- Seeding methods
- Manual overrides
- Re-seeding rules
- Handling no-shows

Article 5.5, Score entry, evidence, and disputes
- How scores are submitted
- Evidence types accepted
- Dispute timing
- Organizer ruling

Article 5.6, Prizes and the law
- Skill-based vs. chance-based events
- Why MusterDeck does not handle prize payouts
- Local-law reminder
- Recommended structures

Article 5.7, Public leaderboards
- What gets shown
- Privacy considerations
- Opting out as a competitor

#### 6. Account, identity, and privacy

Article 6.1, Linking your RSI handle
- The verification flow
- What changes after verification
- What we do not access

Article 6.2, Notification preferences
- Email, Discord, in-app
- Frequency controls
- Quiet hours

Article 6.3, Your data, simply explained
- What we collect
- Why we collect it
- Where it is stored
- How to export or delete

Article 6.4, Deleting your account
- What gets deleted
- What is retained and why (audit, financial-style records)
- Timeline

#### 7. Org administration

Article 7.1, Org roles and permissions
- Owner, officer, member, guest
- Custom roles

Article 7.2, Invitations and codes
- Invite links
- Single-use codes
- Expiry and revocation

Article 7.3, Org-level Acceptable Use and conduct
- Adding org rules on top of MusterDeck rules
- Enforcement at org level
- Removal of members

Article 7.4, Org settings, branding, and patches
- Brand fields
- Patch upload rules
- Banner and color use

#### 8. Tournament organizer playbook

Article 8.1, Pre-launch checklist
- Rules, eligibility, schedule
- Prize structure decisions
- Comms plan

Article 8.2, Conduct policy and Acceptable Use stacking
- Why your rules must sit on top of ours
- Common conduct issues and templates

Article 8.3, Disputes that protect organizers
- Dispute windows
- Evidence standards
- Final ruling language

Article 8.4, Working with sponsors and prizes
- Disclosure expectations
- Avoiding deceptive framing
- Local-law reminder

#### 9. Trust, verification, and reputation

Article 9.1, RSI handle verification
- What it proves
- What it does not prove

Article 9.2, Trust tiers
- How orgs set them
- How they appear on Rally cards
- Disputes and appeals

Article 9.3, Reports and moderation
- What can be reported
- How reports are reviewed
- Outcomes

#### 10. Notifications and integrations

Article 10.1, Discord integration
- Linking Discord
- Channel notifications
- Privacy notes

Article 10.2, Google sign-in
- What we receive from Google
- Unlinking

Article 10.3, Calendar feeds (planned)
- ICS feeds for ops and tournaments

#### 11. Troubleshooting and known issues

Article 11.1, Login problems
- Reset paths
- Provider linking issues

Article 11.2, Missing notifications
- Email delivery
- Discord delivery
- Browser permissions

Article 11.3, Browser support and PWA
- Supported browsers
- Installing as a PWA

Article 11.4, Known issues and current limits
- Mirrors the status page

#### 12. Policies and legal

Article 12.1, Reading the Terms of Service in plain English
Article 12.2, Reading the Privacy Policy in plain English
Article 12.3, Acceptable Use, what is and is not allowed
Article 12.4, Tournament rules and organizer responsibilities
Article 12.5, Fan-project notice and CIG/RSI trademark policy
Article 12.6, How to contact us or report a violation

## Legal pages structure

All four legal documents need the same shape: clear sections, version + last-updated header, plain-English summary at top, full legal text below. Each section gets a stable anchor link so we can link directly from the product UI.

Lawyer review is required on all four documents before launch. Markers below show where the lawyer must confirm.

### Terms of Service (/terms)

Required sections:

1. Plain-English summary at top, 5 to 8 sentences
2. Who we are and what MusterDeck is
3. Fan-project status and trademark acknowledgment (CIG, RSI)
4. Eligibility (age, jurisdiction restrictions if any, lawyer-confirm)
5. Account registration and security
6. Acceptable Use (full version, or by reference to /acceptable-use)
7. User content
   - You own your content
   - License you grant us to display, store, and process it
   - Right of removal
8. Org content and ownership questions (who owns the data when an org leaves)
9. Tournaments and organizer-hosted events
   - MusterDeck role limited to tooling
   - Organizer responsibility (full)
   - Prize and payment disclaimer
10. S.P.O.I.L.S. and bookkeeping framing
    - Explicit: no real money, no in-game item transfers, no exchange-of-value services
11. Intellectual property
    - Yours, ours, and third-party (CIG/RSI)
    - DMCA-style takedown procedure for international compatibility
12. Privacy reference (links to /privacy)
13. Third-party services
    - Discord, Google, hosting (Supabase, Vercel/Netlify/Cloudflare as applicable)
14. Account suspension and termination
15. Disclaimers of warranty (lawyer-confirm, jurisdictional differences)
16. Limitation of liability (lawyer-confirm)
17. Indemnification (lawyer-confirm, narrow scope appropriate to fan tool)
18. Governing law and venue
    - Likely Germany / EU (lawyer-confirm)
    - Consumer-law carve-out for EU residents (mandatory under EU consumer law)
19. Dispute resolution
    - EU ODR platform link (mandatory for EU)
    - Out-of-court resolution options
20. Changes to the Terms
    - Notice period
    - Material vs. non-material changes
21. Contact information
22. Effective date and version history

International note for lawyer:
- Germany / EU as base jurisdiction implies BGB / EU consumer protection floor (e.g. § 312k BGB, "Kündigungsbutton", revocation rights for paid services, ODR platform link). Even if everything stays free at launch, the scaffolding should already be in place.
- US users get reasonable arbitration / class-action language only if you actually want arbitration; default is to keep it simple and let local consumer law apply.
- UK users post-Brexit need a separate mention of UK GDPR (not just EU GDPR).
- Confirm whether "subject to the laws of Germany" is acceptable or whether we present a "country-of-residence consumer rights" carve-out.

### Privacy Policy (/privacy)

Required sections (GDPR-led, layered for international):

1. Plain-English summary at top, 5 to 8 sentences
2. Data controller identification (name, email, postal address)
   - GDPR Art. 13 requires the controller's identity. For a fan project run by an individual, this is your name and a contact email. Lawyer-confirm whether you need an Impressum (Germany requires an Impressum for online services targeting Germany; this is legally separate from privacy).
3. Data Protection Officer status (likely not required; document why)
4. Categories of personal data we collect
   - Account data: email, password hash, callsign, optional RSI handle
   - Provider data: Discord ID, Google sub if used
   - Usage data: IP, user agent, log timestamps
   - Operational data: events posted, ops joined, tournaments entered, scores reported
   - Communications data: messages sent through MusterDeck features
5. Purposes and legal bases (GDPR Art. 6)
   - Contract performance (running your account, your ops, your tournaments)
   - Legitimate interest (security, fraud prevention, abuse moderation)
   - Consent (analytics, marketing emails, optional cookies)
   - Legal obligation (responding to lawful requests)
6. Cookies and similar technologies
   - Strictly necessary
   - Functional
   - Analytics (consent-gated)
   - Link to consent preferences
7. Sharing and recipients
   - Hosting / database provider (Supabase, etc.)
   - Email delivery provider
   - Discord (if linked)
   - Google (if used for sign-in)
   - Optional analytics provider (if any; consent-gated)
   - No sale of personal data
8. International transfers (GDPR Art. 44 ff.)
   - SCCs (Standard Contractual Clauses) for any non-EU processor
   - Adequacy decisions referenced (UK, Canada partial)
9. Data retention
   - Account data: until deletion + a short grace period
   - Audit and financial-style records (S.P.O.I.L.S.): longer retention, lawyer-confirm
   - Backup retention windows
10. Your rights (GDPR Art. 15 to 22)
    - Access, rectification, erasure, restriction, portability, objection
    - Right to lodge a complaint with a supervisory authority (name the authority for Baden-Württemberg if you base it on your residence: Landesbeauftragter für Datenschutz und Informationsfreiheit Baden-Württemberg). Lawyer-confirm.
11. Children
    - Minimum age 16 in EU per GDPR Art. 8 unless local law sets lower (Germany: 16). State 16+ default.
12. Automated decision-making and profiling
    - Confirm whether any matchmaking or trust tier logic counts; lawyer-confirm
13. Security
    - Hashing, encryption in transit, RLS in Postgres, access controls
14. Breach notification
    - Timeline (72h to authority per GDPR Art. 33)
    - User notification triggers
15. Changes to this policy
16. Contact for privacy requests
17. Effective date and version history

Layered approach is recommended:
- Layer 1: short "highlights" page
- Layer 2: full policy with anchor links per section
- Layer 3: deep technical detail (subprocessors list, retention schedule) as a sub-page

Separate from the Privacy Policy but related:
- Impressum page (legally required in Germany under TMG / DDG) at /impressum. Contains: full legal name, postal address, contact email, responsible person. Lawyer-confirm.

### Acceptable Use (/acceptable-use)

Required sections:

1. Plain-English summary
2. Account integrity (one human per account, no automation, no sharing credentials)
3. Content rules (no harassment, hate speech, doxxing, sexual content involving minors, threats, illegal content, malware, scraping)
4. Star Citizen-specific content rules
   - No trading of accounts
   - No trading of real money for in-game assets through MusterDeck
   - No promotion of cheats, exploits, or third-party software that violates CIG/RSI Terms
5. Org and tournament conduct
6. Reporting and moderation
7. Enforcement (warnings, suspension, termination)
8. Appeals

### Tournament rules and disclaimer (/tournament-rules)

This is a separate page so it can be linked from every tournament setup screen and every tournament page.

Required sections:

1. Plain-English summary at top
2. MusterDeck's role is limited to tooling
3. Organizer's responsibilities (the full list)
4. Eligibility, format, scoring, dispute, and conduct rules sit with the organizer
5. Prize disclaimer
   - MusterDeck does not handle payments
   - MusterDeck does not deliver prizes
   - Prize delivery is the organizer's responsibility
   - Local-law applies to the organizer
6. Skill vs. chance language (regulatory caution)
   - Some jurisdictions regulate paid-entry skill events
   - Some jurisdictions classify some formats as gambling
   - The organizer is responsible for compliance
7. Cheating, account-sharing, and conduct (links to Acceptable Use)
8. Dispute path
9. MusterDeck's right to remove a tournament that violates these rules
10. Contact

Setup-wizard acceptance gate (this is the binding moment): the full disclaimer above, plus the universal fan-project notice, plus a checkbox: "I am the organizer. I have read and accept the Tournament Rules. I understand MusterDeck does not host, sponsor, or guarantee this tournament, its prizes, or its conduct, and I am responsible for organizing it in compliance with my local laws."

### Fan-project notice and trademark policy (/fan-project)

Short standalone page that can be linked from the footer and from setup. Contains:

1. The full fan-project disclaimer (already drafted above)
2. Trademark acknowledgment for CIG, RSI, Star Citizen, Squadron 42
3. What we use (community / fan-kit assets, where applicable) and the licenses involved
4. Statement on user-uploaded content involving in-game IP (org logos, ship art) and the user's responsibility to have rights to upload it
5. Takedown contact

## System messaging

### Error messages (categories)

- Authentication errors (sign up, log in, reset, MFA when added)
- Authorization errors (you cannot see or do this)
- Validation errors (form fields)
- Network errors (offline, slow, server)
- Rate-limit errors
- Conflict errors (someone else changed this; reload to continue)
- Server errors with a reference ID

For each category we define a short standard pattern: 1 line of "what happened," 1 line of "what to do," 1 reference ID line for server errors.

### Empty states

Every list and feed needs an empty-state slot. Defined per surface in pillar sections above. Pattern: 1 short line of "what would normally be here," 1 CTA, 1 link to a help article when relevant.

### Success confirmations

Pattern: 1 line, plain, past tense. No celebration language, no exclamation marks. Examples ("Operation posted." "Settlement locked." "Account created.").

### Email templates

Templates to draft once structure is approved:

- Verify your email
- Reset your password
- New applicant on your op
- Application approved
- Application declined
- You were invited to an org
- You were invited to a tournament
- Bracket updated
- Tournament starts soon
- Settlement requires your confirmation
- Account deletion confirmation
- Security: new login from a new device
- Policy update notice

Pattern for every email: short subject line, plain greeting, 1 to 3 short paragraphs, a single primary action button, a footer with the fan-project line and an unsubscribe link where applicable.

## Closed decisions (locked 2026-05-22)

1. Platform payments: no at launch, possibly later. Free to use. Legal scaffolding (PSD2, EU SCA, VAT) is mentioned in Terms so a future paid tier doesn't require a full rewrite, but no payment processing is wired in v1.
2. Operator / legal entity: FrameShift Global Consulting. FrameShift is the controller, the contracting party in the Terms, and the publisher on the Impressum. Lawyer-confirm whether FrameShift's current legal form needs adjustment to carry MusterDeck cleanly.
3. Impressum and controller address: Christoph Mayer's Schwäbisch Hall residential address, listed under the FrameShift name. Acknowledge the home-address-public trade-off; can be swapped for a service address later without legal rewrite.
4. RSI handle verification: public profile page scraping only. User sets a code in their RSI bio; MusterDeck fetches the public profile at robertsspaceindustries.com and checks for the code. No CIG/RSI API is called. Privacy Policy documents the single outbound fetch and what it sees.
5. Paid tournament entry: no at launch, possibly later. Tournament Rules state explicitly that paid entry is not supported. Sets the floor; revising for paid entry later requires a separate legal pass for skill-vs-chance regulation per jurisdiction.
6. Analytics: Plausible. EU-hosted, no personal cookies in standard configuration, often consent-exempt under EU DPA guidance (lawyer-confirm for Baden-Württemberg specifically). Cookie banner can be light; no GA4, no CMP needed.
7. Cookie disclosures: inline section inside the Privacy Policy at /privacy#cookies. No separate /cookies page. Banner deep-links to the anchor.
8. Subprocessors: public page at /subprocessors. Lists Supabase, Vercel or Cloudflare (whichever is used for hosting), email delivery provider, Discord (when linked), Google (when used for sign-in), Plausible, and any backup provider. Privacy Policy links to this page rather than embedding the list, so updates do not require a Privacy Policy version bump.
9. Abuse and conduct reports: signed-in users only at launch. Acceptable Use states reports require an account. Anonymous channel can be added later if moderation capacity grows.
10. Contact channel: contact form on /contact, routing to FrameShift inbox. No publicly listed email address (except the legally required one on the Impressum). Privacy Policy adds a short "form submissions" section covering what the form collects and how long messages are retained.

### Implications carried into the legal drafting pass

- Terms of Service: controller is "FrameShift Global Consulting, [address]". Governing law: Germany / EU. Free-of-charge service language at launch, with a "we may introduce paid features in future with notice" clause. No payment processor section yet.
- Privacy Policy: GDPR-led. Controller block names FrameShift. Plausible processor section is short. RSI verification fetch is documented under "outbound requests we make on your behalf". Subprocessors are linked, not embedded. Cookie section is inline. Contact form is documented.
- Impressum: required by German TMG / DDG. Sits at /impressum. Carries FrameShift name, your home address, contact form link, and the responsible person (you).
- Tournament Rules: paid entry explicitly excluded. Organizer responsibility language is the full version. No payment routing.
- Acceptable Use: reports require a signed-in account. Anonymous reporting is not offered at launch.
- Cookie banner: minimal, since Plausible is the only non-essential processor under consideration. Likely two options: "Accept" and "Manage". The "Manage" panel is short.
- Subprocessors page: standalone, simple, version-stamped.

Lawyer-review markers remain on every legal section. The decisions above let drafting proceed without further blockers.

## Suggested drafting order

1. Public landing page copy
2. Auth flow + setup gate copy (because setup gate ties to legal)
3. Operations Hub copy
4. Pillar copy in order of urgency: Rally Point, Fleet Command, Proving Ground, S.P.O.I.L.S.
5. Help article bodies (start with Getting started and Tournament organizer playbook)
6. Legal full text in this order: Acceptable Use, Tournament Rules, Terms of Service, Privacy Policy, Impressum, Fan-project notice
7. System messaging and email templates
8. German parallels for legal once English is locked
