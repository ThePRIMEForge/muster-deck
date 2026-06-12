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
    description:
      'Browse LFG listings, find open crews, offer your ship or role, and join operations that need your station.',
    detail:
      'Rally Point is the public-facing LFG board. Guests can inspect open listings before creating an account, but posting, joining, messaging, and crew coordination require a MusterDeck account.',
    publicAccess: 'Guest access: open LFG listings only.',
  },
  fleetCommand: {
    title: 'Fleet Command',
    action: 'Command an operation',
    description:
      'Build rosters, assign crew, track ship requests, and keep an operation organized from setup through launch.',
    detail:
      'Fleet Command is the working board for hosts and officers. It manages ship staffing, role assignments, team structure, check-ins, and the operational messages that keep a crew aligned.',
    publicAccess: 'Account required for command tools.',
  },
  spoils: {
    title: 'S.P.O.I.L.S.',
    action: 'Settle rewards',
    description:
      'Log hauls, review claims, approve payout splits, and settle shares after the job is done.',
    detail:
      'S.P.O.I.L.S. is the settlement lane. It turns messy post-op payout math into a clear review flow for claims, approvals, adjustments, and final shares.',
    publicAccess: 'Account required for settlement access.',
  },
  provingGround: {
    title: 'Proving Ground',
    action: 'Run a tournament',
    description:
      'Run events, open signups, seed brackets, report scores, and publish standings or leaderboards.',
    detail:
      'Proving Ground supports competitions and repeatable event formats. Guests may be able to view selected leaderboards, while signup, reporting, moderation, and bracket tools belong to account holders.',
    publicAccess: 'Guest access: selected event leaderboards.',
  },
} as const;

export const foundationCopy = {
  landing: {
    heroTitle: 'Rally, Command, Settle.',
    heroSubtitle: "Coordinate crews, cargo, combat, tournaments, and payouts across the 'verse.",
    primaryCta: 'Create Account',
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
    consentPrefix: 'I agree to the',
    termsLink: 'Terms of Service',
    consentAnd: 'and',
    privacyLink: 'Privacy Policy',
    consentSuffix: '.',
  },
  admin: {
    title: 'Admin Portal',
    subtitle: 'Review accounts, manage access, and keep the deck in order.',
  },
  notifications: {
    title: 'Messages and Notifications',
    empty: 'No messages or alerts yet.',
    markAllRead: 'Mark all as read',
  },
  account: {
    title: 'Account Settings',
    subtitle: 'Complete your profile so hosts know who is reporting in.',
  },
} as const;
