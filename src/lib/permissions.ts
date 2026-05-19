export type OperationRole = 'fleet_admiral' | 'officer' | 'crew';
export type AppPage = 'setup' | 'operation' | 'crew';

export const roleLabels: Record<OperationRole, string> = {
  fleet_admiral: 'Fleet Admiral',
  officer: 'Officer',
  crew: 'Crew',
};

export function canAccessPage(role: OperationRole, page: AppPage) {
  if (page === 'setup') {
    return role === 'fleet_admiral';
  }

  if (page === 'operation') {
    return role === 'fleet_admiral' || role === 'officer';
  }

  return true;
}

export function canManageFleetSetup(role: OperationRole) {
  return role === 'fleet_admiral';
}

export function canManageOperation(role: OperationRole) {
  return role === 'fleet_admiral' || role === 'officer';
}

export function defaultPageForRole(role: OperationRole): AppPage {
  if (role === 'fleet_admiral') {
    return 'setup';
  }

  if (role === 'officer') {
    return 'operation';
  }

  return 'crew';
}
