import type { FoundationRoute, FoundationRouteId, FoundationViewer } from './foundationTypes';
import { isSiteAdminOrAbove } from './permissions.ts';

export const appRoutes: FoundationRoute[] = [
  {
    id: 'landing',
    label: 'MusterDeck',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'rally-browse',
    label: 'Rally Point',
    module: 'rally_point',
    public: true,
    requiresAuth: false,
    buildPriority: 'draft_now',
  },
  {
    id: 'login',
    label: 'Log in',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'signup',
    label: 'Sign up',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'hub',
    label: 'Operations Hub',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'account',
    label: 'Account',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'admin',
    label: 'Admin',
    public: false,
    requiresAuth: true,
    requiresAdmin: true,
    buildPriority: 'build_now',
  },
  {
    id: 'fleet-command',
    label: 'Fleet Command',
    module: 'fleet_command',
    public: false,
    requiresAuth: true,
    buildPriority: 'build_now',
  },
  {
    id: 'spoils',
    label: 'S.P.O.I.L.S.',
    module: 'spoils',
    public: false,
    requiresAuth: true,
    buildPriority: 'draft_now',
  },
  {
    id: 'proving-ground',
    label: 'Proving Ground',
    module: 'proving_ground',
    public: false,
    requiresAuth: true,
    buildPriority: 'draft_now',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
  {
    id: 'legal',
    label: 'Disclaimer',
    public: true,
    requiresAuth: false,
    buildPriority: 'build_now',
  },
];

export function isSignedIn(viewer: FoundationViewer) {
  return viewer.accountState !== 'guest';
}

export function visibleFoundationRoutes(viewer: FoundationViewer) {
  return appRoutes.filter((route) => {
    if (route.requiresAdmin && !isSiteAdminOrAbove(viewer.siteRole)) {
      return false;
    }

    if (route.requiresAuth) {
      return isSignedIn(viewer);
    }

    return true;
  });
}

export function defaultFoundationRouteForViewer(viewer: FoundationViewer): FoundationRouteId {
  return isSignedIn(viewer) ? 'hub' : 'landing';
}

export function getRouteById(routeId: FoundationRouteId) {
  return appRoutes.find((route) => route.id === routeId);
}
