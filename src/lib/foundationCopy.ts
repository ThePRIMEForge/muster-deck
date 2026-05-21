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
    title: 'Messages and Notifications',
    empty: 'No messages or alerts yet.',
    markAllRead: 'Mark all as read',
  },
  account: {
    title: 'Account Settings',
    subtitle: 'Complete your profile so hosts know who is reporting in.',
  },
} as const;
