# MusterDeck Product Backlog

Date: 2026-05-20

## Recommended Starting Point

Start with the shared shell and identity foundation before building the four pillars deeply.

Reason:

- Landing page, welcome screen, signup/login, account settings, admin portal, footer/legal, and the post-login pillar selector are shared by Rally Point, Fleet Command, S.P.O.I.L.S., and Proving Ground.
- Rally Point, S.P.O.I.L.S., and Proving Ground all need profiles, permissions, verification, and notification preferences.
- Fleet Command already has the most backend/prototype work, so the biggest missing unlock is persistent users and navigation.

Project hygiene reference:

- Follow `docs/handoff/2026-05-20-project-organization-guide.md`.
- Record major product, architecture, naming, visual, and archive decisions in `docs/handoff/project-change-log.md`.
- Keep mockup-only artifacts in `docs/mockups/` until accepted or archived.

Recommended first build sequence:

1. MusterDeck landing/welcome page.
2. Signup/login with email/password, Discord SSO, and Google SSO.
3. Persistent user profile/account section.
4. Footer/legal/disclaimer component on every page.
5. Logged-in app hub with three pillar cards.
6. Admin portal foundation.
7. Rally Point design and data model.
8. S.P.O.I.L.S. mockup and data model.
9. Proving Ground tournament design and data model.
10. Flow between Rally Point, Fleet Command, S.P.O.I.L.S., and Proving Ground.

## Foundation Tasks

### Branding And Site Shell

- Add platform name: MusterDeck.
- Use domain direction: `www.muster-deck.com`.
- Add global navigation.
- Add a compact header/version strip showing:
  - Rally Point version.
  - Fleet Command version.
  - S.P.O.I.L.S. version.
  - Proving Ground version.
  - Star Citizen patch/data version the app has been updated to.
  - Optional last catalog sync timestamp.
- Add responsive app shell for desktop, tablet, and phone.
- Add compact footer on every public and authenticated page.
- Add fan-project disclaimer, legal links, status link, and Discord/community link.

### Landing And Welcome

- Public landing page explaining MusterDeck.
- Short descriptions of the four pillars:
  - Rally Point: find or publish operations.
  - Fleet Command: plan and run organization events.
  - S.P.O.I.L.S.: settle loot, payouts, and rewards.
  - Proving Ground: run tournaments, brackets, scores, and standings.
- Calls to action:
  - Sign in.
  - Create account.
  - Browse public Rally Point listings.
  - Learn how the four pillars connect.

### Authentication

- Signup.
- Login.
- Logout.
- Email/password as the easiest baseline signup path.
- Password reset.
- Discord OAuth.
- Google OAuth.
- Account settings flow to link Discord SSO after signing up with email/password.
- Account settings flow to link Google SSO after signing up with email/password.
- Preserve one MusterDeck profile across linked identities.
- Auth callback page.
- Session persistence.
- Redirect users back to intended event/listing after login.

### User Account

- Profile display name/callsign.
- Bio.
- Avatar.
- Discord identity display.
- Google identity display.
- Linked identity management.
- RSI handle field.
- RSI verification challenge/token flow.
- Verification status.
- Notification preferences.
- Password management if email/password is enabled.
- Account deletion request or self-service deletion.
- Privacy/data export later.

### Admin Portal

- View all registered users.
- Search/filter users.
- View Discord-linked status.
- View RSI verification status.
- View account creation date and last activity.
- View banned/restricted users.
- Ban/unban users.
- Restrict users.
- Require manual approval for a user.
- View moderation notes.
- View user event participation.
- View S.P.O.I.L.S. payout/reward history later.
- Audit log for admin actions.

### Logged-In Home

- Main hub after login.
- Four large but operational pillar entries:
  - Rally Point.
  - Fleet Command.
  - S.P.O.I.L.S.
  - Proving Ground.
- Short descriptions of each pillar.
- Explain how they connect:
  - Rally Point recruits participants.
  - Fleet Command runs the operation.
  - S.P.O.I.L.S. settles rewards after completion.
  - Proving Ground runs structured competitive events and can feed prizes or results into S.P.O.I.L.S.
- Show recent activity:
  - Joined operations.
  - Hosted operations.
  - Pending approvals.
  - Recent messages/notifications.
  - Open S.P.O.I.L.S. settlements.

## Rally Point Tasks

### CrewTerminal Research Notes

Public CrewTerminal pages show these useful listing fields:

- Activity class.
- System.
- Sector/location.
- Ship profile.
- Ship manufacturer/class.
- Crew cap.
- Contract value.
- Duration.
- Risk/threat level.
- Open roles and filled slots.
- Region.
- Language.
- Start time.
- Commander.
- Listing status.
- Role roster.

CrewTerminal also exposes useful flows:

- Browse listings.
- Sort latest, starting soon, and starting later.
- Filter by activity and system.
- Sign in to join.
- Create listing.
- Track personal activity.
- Show network stats.
- Include legal/footer links on public pages.

MusterDeck should use these concepts but not copy CrewTerminal wording, visual treatment, or page structure.

Sources:

- https://crewterminal.io/
- https://crewterminal.io/discover
- https://crewterminal.io/listings/01KS0QCKQPPMH9VXQQR5YYES97
- https://crewterminal.io/stats

### Rally Point Listing Types

Support Star Citizen activity/game-loop categories, including:

- Mining.
- Salvage.
- Cargo hauling.
- Mercenary contracts.
- Bounty hunting.
- Security escort.
- Logistics/support.
- Medical rescue.
- Exploration.
- Racing.
- Training.
- Piracy if site policy allows it.
- Mixed reputation grind.
- Multi-discipline organization operation.
- General LFG / open session.
- Custom activity.

### Rally Point Listing Fields

- Title.
- Activity type.
- Mission group or specific mission reference.
- System.
- Planet/moon/station/sector.
- Start time.
- Duration estimate.
- Region/time zone.
- Language.
- Risk level.
- Reward model.
- Public/private/unlisted/org-only visibility.
- Discord/RSI verification requirement.
- Manual approval requirement.
- Voice channel/comms instructions.
- Description/briefing.
- Required ships.
- Requested ship classes.
- Requested roles.
- Crew cap.
- Applicant queue.
- Accepted crew roster.
- Calendar export.
- Share link and join code.

### Rally Point User Flows

- Browse public listings.
- Filter by system, activity, role need, ship need, risk, reward, language, and start time.
- Open listing detail.
- Sign in or continue as guest if allowed.
- Apply for a role.
- Offer a ship.
- Host approves or denies applicant.
- Accepted player gets event notifications.
- Listing can be promoted into Fleet Command.
- Completed listing can open S.P.O.I.L.S.

## Fleet Command Tasks

Existing prototype already covers much of this conceptually.

Needed next:

- Wire fleet events to Supabase.
- Replace local fallback role selector with real current user.
- Create event templates.
- Add event duplication.
- Add join links and join codes.
- Add access settings.
- Add applicant approval.
- Add officer workflows.
- Add live event status/phase controls.
- Improve mobile/tablet command notifications.
- Connect completed events to S.P.O.I.L.S.

## S.P.O.I.L.S. Tasks

S.P.O.I.L.S. means:

- Settlement
- Payouts
- Operations
- Inventory
- Loot
- Shares

The Quartermaster manages S.P.O.I.L.S.

### Supported Item Categories

Initial scope should include only:

- Minables.
- Ship components.
- Ship weapons.
- Specialty items.
- Harvestables from Valakar and Yormandi-style encounters.
- Metals and pristine metals.
- Wicklow favors and similar special reward items.
- Sale proceeds from mining, salvage, cargo, contraband, or mixed activity.
- Tournament prize records from Proving Ground.
- Cash, physical, in-game, hangar equipment, and hangar ship prizes as organizer-managed award records.

Out of initial scope:

- FPS weapons.
- FPS armor.
- Full general inventory tracking.

### S.P.O.I.L.S. Core Flows

- Create a S.P.O.I.L.S. list standalone or from a completed Fleet Command event.
- Pull participants from an event.
- Add manual participants.
- Add org bank as a virtual participant.
- Add item or sale proceeds.
- Add notes to an item or payout.
- Crew submit items for approval.
- Quartermaster approves/rejects submissions.
- Crew request specific items.
- Quartermaster approves item rewards.
- Sell items and enter proceeds.
- Split proceeds evenly.
- Reserve org bank percentage.
- Adjust each participant share with up/down controls.
- Override with exact aUEC amount.
- Preview final payout.
- Finalize and lock/version the settlement.
- Record payout history per user.
- Create tournament prize settlements from Proving Ground.
- Assign prizes by placement, leaderboard rank, category award, or admin selection.
- Track prize claim and fulfillment status.

### S.P.O.I.L.S. Mockup Needs

- Left rail: settlement/event selector and participant list.
- Center: spoils inventory grouped by category.
- Right panel: payout calculator and approval queue.
- Item detail drawer:
  - Item name.
  - Category.
  - Quantity.
  - Estimated value.
  - Actual sale value.
  - Contributor.
  - Source/notes.
  - Approval status.
  - Requests.
- Payout table:
  - Participant.
  - Role or contribution.
  - Base share.
  - Percent adjustment.
  - Fixed adjustment.
  - Final payout.
  - Paid checkbox/status.
- Org bank row:
  - Virtual participant.
  - Percentage or fixed reserve.
  - Notes.
- Tournament prize section:
  - Prize.
  - Type.
  - Sponsor/source.
  - Placement or award rule.
  - Assigned winner/team.
  - Claim status.
  - Fulfillment status.
  - Admin notes.

### S.P.O.I.L.S. Research Needed

- Current list of mineables.
- Current sellable metals and pristine metals.
- Current ship component types.
- Current ship weapon types.
- Valakar and Yormandi harvestable/reward items.
- Wicklow favor and similar special items.
- Which items have stable public value sources and which need manual value estimates.
- Safe disclaimer language for organizer-managed cash, physical, and hangar-attributed tournament prizes.

## Proving Ground Tasks

Current design spec:

- `docs/superpowers/specs/2026-05-21-musterdeck-tournament-pillar-design.md`

Purpose:

- Tournament signup, bracket/wave management, score reporting, standings, and competitive event administration.

Recommended pillar name:

- Proving Ground.

Core tournament modes:

- 1v1.
- 2v2.
- 3v3.
- 4v4.
- 5v5.
- Custom team size.

Core formats:

- Single elimination.
- Double elimination with losers bracket and optional grand-final reset.
- Round robin.
- Swiss.
- Leaderboard/custom scoring.
- Two-stage group-to-finals later.

Core flows:

- Create tournament.
- Open signup.
- Register individuals or teams.
- Approve, waitlist, reject, drop, or disqualify entrants.
- Check in teams.
- Seed randomly, manually, or by configured rules.
- Generate match waves.
- Assign station, room, table, or Discord voice channel.
- Enter and confirm scores.
- Advance winners and move losers when the format supports it.
- Publish brackets, standings, and announcements.

Admin panel needs:

- Setup.
- Registration.
- Seeding.
- Bracket / Waves.
- Score Desk.
- Standings.
- Announcements.
- Settings.

## Cross-Pillar Flow

Recommended product journey:

1. User lands on MusterDeck.
2. User signs in or browses public Rally Point listings.
3. User applies to a Rally Point operation.
4. Host accepts the user.
5. Event opens in Fleet Command for planning and live operation management.
6. Officers send assignments and phase updates during the operation.
7. Event completes.
8. Quartermaster opens S.P.O.I.L.S. from the event.
9. Participants and assignments are imported.
10. Loot/proceeds are entered and approved.
11. Crew request items or receive payout shares.
12. Settlement is finalized and saved to user history.

Proving Ground journey:

1. Organizer creates a tournament.
2. Organizer chooses team size, format, venue type, registration rules, and score rules.
3. Players or teams sign up.
4. Admin approves and checks in entrants.
5. Admin seeds or randomizes the bracket.
6. Admin publishes waves, stations, rooms, or Discord channels.
7. Scores are reported and confirmed.
8. Winners advance, losers drop or move to the losers bracket.
9. Standings publish during or after the event.
10. Tournament winnings can use a custom S.P.O.I.L.S. prize settlement for cash prizes, physical prizes, in-game items, hangar equipment, and hangar ships.

## Decisions To Make Next

1. Should guests be allowed to apply to Rally Point listings by default, or only when the host allows it?
2. Should Rally Point allow public community listings immediately, or only organization-owned listings at first?
3. Should the first S.P.O.I.L.S. mockup use equal split plus org bank only, or include per-user percentage/fixed adjustments immediately?
4. Should the admin portal be site-owner only at first, or support organization admins too?
5. Should the next visual mockup be the logged-in hub, Rally Point listing detail, S.P.O.I.L.S. settlement screen, or Proving Ground tournament admin?
6. Should the tournament pillar be called Proving Ground, The Circuit, Arena Deck, or another name?
7. Should first-version tournament score reporting be admin-only, or allow participant self-reporting with admin confirmation?
