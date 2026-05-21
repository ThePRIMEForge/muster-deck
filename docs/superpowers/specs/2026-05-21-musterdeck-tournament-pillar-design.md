# MusterDeck Tournament Pillar Design

Date: 2026-05-21

## Purpose

Add a fourth MusterDeck pillar for tournament and competitive event management.

This pillar complements the existing platform:

- Rally Point recruits participants.
- Fleet Command runs coordinated operations.
- S.P.O.I.L.S. settles rewards and payouts.
- Tournament pillar runs structured competitive events, brackets, score reporting, and standings.

The first design target is a Challonge-style tournament manager adapted for MusterDeck, Star Citizen communities, Discord-hosted events, and in-person competitions.

## Recommended Pillar Name

Recommended name: **Proving Ground**

Reason:

- It fits Star Citizen and military-adjacent language without sounding official.
- It works for combat tournaments, racing, industrial challenges, trivia, training events, and real-world meetups.
- It reads naturally beside Rally Point, Fleet Command, and S.P.O.I.L.S.
- It gives clear product language: enter the Proving Ground, seed the bracket, report scores, advance the winners.

Other viable options:

- **The Circuit**: strong for leagues, seasons, leaderboards, and recurring tournaments. Less tactical than Proving Ground.
- **Arena Deck**: direct and easy to understand. Slightly narrower and more combat-coded.
- **Trial Run**: friendly for casual events, but weaker for serious brackets.

Working decision until reviewed: use **Proving Ground**.

## Benchmark Research

Challonge supports the right reference set for this pillar:

- Dedicated tournament pages with brackets, participants, standings, sponsors, stations, discussions, and related tournament details.
- Single elimination, double elimination, round robin, Swiss, free-for-all, leaderboard, race/time-trial/grand-prix, and two-stage tournament structures.
- Round robin variations where participants can play each other more than once.
- Swiss pairings where participants are paired by similar records and ranked at the end with tie breakers.
- Two-stage structures where group-stage winners advance to a final stage.
- Score reporting by organizers and optionally participants.
- Match attachments as result proof.
- Shared admin access for score reporting and participant management.
- Hosted registration pages.
- Team registration.
- Custom registration fields.
- Check-in before the event.
- Match stations, match times, and station queues.
- Standings based on wins, losses, ties, and tie breaks.

Useful source references:

- `https://challonge.com/features/tournaments.html`
- `https://kb.challonge.com/en/article/learn-about-challonge-competition-formats-1f8j1cf/`
- `https://getrivals.com/blog/tournament-bracket-types-explained/`
- `https://en.wikipedia.org/wiki/Swiss-system_tournament`

## Scope Classification

Build Now:

- Tournament landing/signup page.
- Tournament setup wizard.
- Participant and team registration.
- Core bracket formats: single elimination, double elimination, round robin, Swiss, leaderboard.
- Team sizes: 1v1, 2v2, 3v3, 4v4, 5v5, and custom.
- Admin score entry.
- Public bracket/standings view.
- Manual and random seeding.
- Match waves/round scheduling.
- Discord-hosted and in-person event location fields.

Draft Now:

- Two-stage group-to-playoff tournaments.
- Free-for-all events.
- Match proof uploads.
- Participant self-reporting with admin confirmation.
- Station/voice-channel queue display.
- Advanced tie-break rules.
- Losers bracket reset options.

Later:

- Paid registration.
- Deep Discord bot automation.
- Streaming overlay views.
- Prediction brackets.
- Sponsor/ad panels.
- API integrations with external tournament systems.
- Automated anti-cheat or result verification.

## Core Concepts

### Tournament

Top-level competitive event.

Fields:

- Name.
- Description/briefing.
- Game/activity type.
- Host profile.
- Visibility: public, unlisted, private, org-only.
- Venue type: Discord, in-person, hybrid, other.
- Discord server/channel/link.
- Physical venue/address/room.
- Start date/time.
- Check-in window.
- Region/time zone.
- Team size mode.
- Format.
- Registration status.
- Tournament status.
- Admin notes.

### Participant

An individual user or invited external entrant.

Fields:

- Display name.
- MusterDeck profile link when available.
- Discord handle.
- RSI handle when relevant.
- Contact note.
- Check-in status.
- Eligibility status.

### Team

A tournament entrant made of one or more participants.

Team size presets:

- 1v1: one participant per side.
- 2v2: two participants per team.
- 3v3: three participants per team.
- 4v4: four participants per team.
- 5v5: five participants per team.
- Custom: host chooses team size, substitutes, and max roster size.

Fields:

- Team name.
- Captain.
- Members.
- Substitutes.
- Seed.
- Status: registered, checked in, dropped, disqualified.

### Match

A competitive pairing or group contest.

Fields:

- Round/wave.
- Bracket side: winners, losers, finals, group, Swiss, leaderboard.
- Team A.
- Team B or multi-team entrants.
- Match status: pending, ready, active, reported, disputed, confirmed, complete.
- Score fields.
- Winner.
- Admin-assigned station, table, room, or Discord voice channel.
- Scheduled time.
- Proof/attachment links later.
- Notes/dispute reason.

### Wave

A scheduling group for matches that can run at roughly the same time.

Wave controls:

- Randomize all eligible pairings.
- Use manual pairings.
- Use seeded pairings.
- Avoid rematches when possible.
- Assign stations or Discord channels.
- Lock wave after publishing.
- Reopen wave for admin correction.

## Tournament Formats

### Single Elimination

Use when the event needs to finish quickly.

Rules:

- One loss eliminates a team.
- Winners advance until one winner remains.
- Optional third-place match.
- Supports random, manual, or seeded bracket placement.
- Supports byes when entrant count is not a power of two.

Best for:

- Fast one-night events.
- Large casual events.
- Simple community tournaments.

### Double Elimination

Use when one bad match should not end a run.

Rules:

- First loss sends a team to the losers bracket.
- Second loss eliminates a team.
- Winners bracket champion faces losers bracket champion.
- Optional grand-final reset: losers bracket finalist must beat winners bracket finalist twice.
- Option to disable the reset for shorter events, with clear label that it is modified double elimination.

Controls:

- Losers bracket enabled by selecting double elimination.
- Grand-final reset on/off.
- Split participants into winners/losers bracket at start later.
- Admin can advance, correct, or disqualify teams.

Best for:

- Competitive Discord tournaments.
- Events where fairness matters more than speed.
- 8 to 32 teams.

### Round Robin

Use when every team should play every other team.

Rules:

- Each team plays all others once by default.
- Optional 2x or 3x round robin for repeat meetings.
- Standings decide the winner or seed a playoff stage.
- Ties use configured tie breakers.

Best for:

- Small groups.
- League nights.
- Group stages.
- Events where more playtime matters.

### Swiss

Use when there are too many entrants for full round robin, but the host wants multiple matches per team.

Rules:

- Round count is fixed before the event starts.
- First round is random, seeded, or manually paired.
- Later rounds pair teams with similar records.
- Avoid repeat pairings.
- Final standings rank teams by score and tie breakers.

Best for:

- Larger competitive fields.
- Qualifiers.
- Multi-round Discord events.
- Events where teams should keep playing even after one loss.

### Leaderboard

Use when the event is scored by points, time, kills, cargo moved, mining yield, salvage value, racing time, or another custom metric.

Rules:

- Admin defines scoring categories.
- Participants submit or admins enter score records.
- Standings sort by configured score fields.
- Can be open-ended or locked to a time window.

Best for:

- Racing/time trials.
- Mining, salvage, or cargo challenges.
- Multi-day score competitions.
- Physical meetups with flexible activities.

### Two-Stage Group To Finals

Use when a tournament starts with pools/groups and ends with a playoff bracket.

Rules:

- Stage 1 can be round robin, Swiss, single elimination, or double elimination.
- Top teams advance from each group.
- Final stage can be single elimination or double elimination for first build; round robin and Swiss finals can remain later options.

Best for:

- Larger tournaments.
- Events with multiple Discord channels or physical stations.
- Events where organizers want guaranteed early matches before elimination.

## Signup Page

Signup page goals:

- Explain the tournament clearly.
- Let individuals or teams register.
- Collect the minimum useful information.
- Support Discord-hosted and in-person events.
- Let admins approve, waitlist, or reject entrants.

Required sections:

- Tournament name, date, format, team size, location/Discord.
- Rules summary.
- Registration status.
- Team registration form.
- Individual registration form for 1v1 or captain-free events.
- Discord handle.
- RSI handle when relevant.
- Optional notes/custom fields.
- Check-in instructions.
- Public bracket/standings link when published.

Admin controls:

- Open/close registration.
- Approve, waitlist, reject, drop, or disqualify entrants.
- Bulk add teams.
- Export participant list.
- Send announcement.

## Admin Panel

Primary admin tabs:

1. Setup
2. Registration
3. Seeding
4. Bracket / Waves
5. Score Desk
6. Standings
7. Announcements
8. Settings

### Setup

Controls:

- Tournament title.
- Format.
- Team size.
- Venue type.
- Discord or physical location.
- Registration rules.
- Check-in rules.
- Public/private visibility.

### Registration

Controls:

- Review entrants.
- Approve/waitlist/reject.
- Check in teams.
- Mark no-shows.
- Manage substitutes.

### Seeding

Controls:

- Random seed.
- Manual drag ordering.
- Seed by registration order.
- Seed by prior leaderboard later.
- Lock bracket.
- Re-randomize before lock.

### Bracket / Waves

Controls:

- Generate next wave.
- Randomize eligible pairings.
- Manually edit pairings.
- Assign station, table, room, or Discord voice channel.
- Publish wave.
- Lock wave.
- Reopen wave.
- Advance winners.
- Send losers to losers bracket when format supports it.

### Score Desk

Controls:

- Enter scores.
- Mark winner.
- Confirm match.
- Reopen match.
- Mark forfeit.
- Mark dispute.
- Add admin note.
- Upload proof later.

### Standings

Controls:

- Show wins/losses/ties.
- Show points for/against.
- Show score differential.
- Show tie-break columns.
- Publish or hide standings.

### Announcements

Controls:

- Message all participants.
- Message checked-in teams.
- Message active wave.
- Message specific match.
- Message admins only.

## Tie Breakers

Recommended first tie-break options:

1. Match wins.
2. Head-to-head result.
3. Score differential.
4. Points scored.
5. Opponents' match win percentage / strength of schedule.
6. Buchholz or Median-Buchholz for Swiss.
7. Admin manual override.

The admin UI should show tie-break order clearly before the tournament starts.

## Cross-Pillar Fit

Rally Point:

- A public tournament can appear as a Rally Point listing.
- Players can discover open tournaments from Rally Point.
- Tournament signup can use the same profile/trust fields.

Fleet Command:

- Some tournaments may produce Fleet Command events for scheduled matches, scrims, or finals.
- Fleet Command can be used for large team-based Star Citizen events that need live command after tournament registration.

S.P.O.I.L.S.:

- Prize payouts, entry pools, donations, and post-event rewards can flow into S.P.O.I.L.S.
- Tournament winners and placements can become payout recipients.

Shared foundation:

- Uses the same profiles, auth, notifications, access rules, admin portal, and fan-project/legal shell.
- Needs its own module version in the header/status strip.

## Notifications

Tournament notification categories:

- Registration approved.
- Registration waitlisted/rejected.
- Check-in open.
- Check-in missing.
- Match assigned.
- Wave published.
- Score reported.
- Score disputed.
- Match confirmed.
- Advanced to next round.
- Eliminated.
- Tournament complete.
- Admin announcement.

Channels:

- In-app notifications first.
- Event message feed.
- Optional Discord bridge later.
- Email only for important account/security and possibly tournament reminders later.

## Public Views

Public views:

- Tournament overview.
- Signup page.
- Participant/team list.
- Bracket view.
- Wave/match schedule.
- Standings/leaderboard.
- Rules page.

Public visibility controls:

- Hide entrants until bracket lock.
- Show only approved teams.
- Hide scores until confirmed.
- Publish standings after each wave or only at the end.

## Admin Safety And Correction

Admins need correction tools because tournaments are live and mistakes happen.

Required:

- Reopen match before next dependent match starts.
- Manual winner override with admin note.
- Drop/no-show/disqualify team.
- Replace a team before bracket lock.
- Re-seed before bracket lock.
- Lock bracket once tournament begins.
- Audit log for score and advancement changes.

## First Build Recommendation

The first implementation should be a planning and admin foundation, not a full Challonge replacement.

Recommended first slice:

1. Add Proving Ground to the shared app map and hub as Draft Now.
2. Create tournament types and copy constants.
3. Create demo data for tournament formats, teams, waves, matches, and standings.
4. Build draft screens:
   - Proving Ground overview.
   - Tournament signup.
   - Tournament admin setup.
   - Bracket/wave desk.
   - Standings.
5. Defer real bracket algorithms until the UI and data model are reviewed.

Recommended algorithm priority after the draft shell:

1. Single elimination.
2. Double elimination.
3. Round robin.
4. Swiss.
5. Leaderboard/custom scoring.
6. Two-stage group-to-finals.

## Open Decisions

1. Confirm the pillar name: Proving Ground, The Circuit, Arena Deck, or another name.
2. Decide whether tournaments are a fourth top-level pillar or a sub-module under Rally Point/Event Management.
3. Decide first supported formats: single elimination plus double elimination only, or include round robin/Swiss/leaderboard in the first UI shell.
4. Decide whether Discord-hosted tournaments require Discord-linked accounts.
5. Decide whether in-person tournament entrants can be external guests without MusterDeck accounts.
6. Decide whether participant self-reporting is allowed in the first build or admin-only score entry.
7. Decide whether prizes/payouts connect to S.P.O.I.L.S. in the first version or later.
