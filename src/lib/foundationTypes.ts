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
