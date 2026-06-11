import type { FoundationViewer } from './foundationTypes';

export type FoundationNotification = {
  id: string;
  category:
    | 'general'
    | 'direct_message'
    | 'group_message'
    | 'assignment'
    | 'application'
    | 'settlement'
    | 'tournament'
    | 'admin';
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
  siteRole: 'super_admin',
};

export const demoNotifications: FoundationNotification[] = [
  {
    id: 'note-general',
    category: 'general',
    title: 'Deck notice',
    body: 'Ship position review is locked for this patch.',
    createdAt: 'Just now',
    read: false,
  },
  {
    id: 'note-direct-message',
    category: 'direct_message',
    title: 'Message from Cargo Lead Vale',
    body: 'Can you review the hauling crew before signups open?',
    createdAt: '1 min ago',
    read: false,
  },
  {
    id: 'note-group-message',
    category: 'group_message',
    title: 'Logistics group',
    body: "Three pilots confirmed for tonight's supply run.",
    createdAt: '2 min ago',
    read: false,
  },
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
    id: 'note-tournament',
    category: 'tournament',
    title: 'Wave published',
    body: 'Proving Ground Wave 2 is ready for score desk review.',
    createdAt: '2 hr ago',
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
