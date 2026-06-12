export type SiteRole = 'registered_user' | 'moderator' | 'admin' | 'super_admin';
export type OperationRole = 'fleet_admiral' | 'fleet_officer' | 'team_officer' | 'crew';
export type AppPage = 'setup' | 'operation' | 'crew';

export const roleLabels: Record<OperationRole, string> = {
  fleet_admiral: 'Fleet Admiral',
  fleet_officer: 'Fleet Officer',
  team_officer: 'Team Officer',
  crew: 'Crew',
};

export function canAccessPage(role: OperationRole, page: AppPage) {
  if (page === 'setup') {
    return role === 'fleet_admiral';
  }

  if (page === 'operation') {
    return role === 'fleet_admiral' || role === 'fleet_officer' || role === 'team_officer';
  }

  return true;
}

export function canManageFleetSetup(role: OperationRole) {
  return role === 'fleet_admiral';
}

export function canManageOperation(role: OperationRole) {
  // Fleet-wide control of the live roster. Team Officers manage only their own
  // team and must be checked with canManageTeam instead.
  return role === 'fleet_admiral' || role === 'fleet_officer';
}

export function canManageTeam(
  role: OperationRole,
  viewerTeam: string | null,
  targetTeam: string,
) {
  if (role === 'fleet_admiral' || role === 'fleet_officer') {
    return true;
  }

  if (role === 'team_officer') {
    return viewerTeam !== null && viewerTeam === targetTeam;
  }

  return false;
}

export function canChangeRanks(role: OperationRole) {
  return role === 'fleet_admiral';
}

export function canEndDeployment(role: OperationRole) {
  return role === 'fleet_admiral';
}

export function isSiteAdminOrAbove(role: SiteRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

export function isModeratorOrAbove(role: SiteRole): boolean {
  return role === 'moderator' || role === 'admin' || role === 'super_admin';
}

export function defaultPageForRole(role: OperationRole): AppPage {
  if (role === 'fleet_admiral') {
    return 'setup';
  }

  if (role === 'fleet_officer' || role === 'team_officer') {
    return 'operation';
  }

  return 'crew';
}
