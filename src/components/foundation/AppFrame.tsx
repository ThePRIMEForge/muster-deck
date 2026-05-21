import { Bell, LogIn, Menu, Shield, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { appRoutes, visibleFoundationRoutes } from '../../lib/appNavigation';
import { fanProjectDisclaimer } from '../../lib/foundationCopy';
import type { FoundationRouteId, FoundationViewer } from '../../lib/foundationTypes';

type AppFrameProps = {
  activeRoute: FoundationRouteId;
  viewer: FoundationViewer;
  onRouteChange: (route: FoundationRouteId) => void;
  children: ReactNode;
};

export function AppFrame({ activeRoute, viewer, onRouteChange, children }: AppFrameProps) {
  const visibleRoutes = visibleFoundationRoutes(viewer);

  return (
    <div className="foundation-shell">
      <header className="foundation-header">
        <button className="foundation-brand" onClick={() => onRouteChange('landing')} type="button">
          <span className="foundation-brand-mark" aria-hidden="true">
            <Shield size={18} />
          </span>
          <span className="foundation-brand-copy">
            <span>MusterDeck</span>
            <small>Operations board</small>
          </span>
        </button>
        <nav className="foundation-nav" aria-label="Primary navigation">
          {visibleRoutes
            .filter((route) => route.id !== 'landing' && route.id !== 'signup')
            .map((route) => (
              <button
                key={route.id}
                className={route.id === activeRoute ? 'active' : ''}
                onClick={() => onRouteChange(route.id)}
                type="button"
              >
                {route.label}
              </button>
            ))}
        </nav>
        <div className="foundation-actions">
          <button
            className="foundation-icon-action"
            onClick={() => onRouteChange('notifications')}
            type="button"
            title="Notifications"
          >
            <Bell size={17} />
          </button>
          <button className="foundation-icon-action" onClick={() => onRouteChange('account')} type="button" title={viewer.displayName}>
            <UserRound size={17} />
          </button>
          <button className="foundation-icon-action" onClick={() => onRouteChange('login')} type="button" title="Log in">
            <LogIn size={17} />
          </button>
          <button className="foundation-icon-action mobile-menu-button" type="button" title="Menu">
            <Menu size={17} />
          </button>
        </div>
      </header>

      <div className="foundation-status-strip">
        <span className="foundation-status-chip">Rally Point v0.1</span>
        <span className="foundation-status-chip">Fleet Command v0.1</span>
        <span className="foundation-status-chip">S.P.O.I.L.S. v0.1</span>
        <span className="foundation-status-chip">Proving Ground v0.1</span>
        <span className="foundation-status-chip">Star Citizen data: 4.8.0-LIVE.11825000</span>
      </div>

      <main className="foundation-main">{children}</main>

      <footer className="foundation-footer">
        <p>{fanProjectDisclaimer}</p>
        <div>
          <button type="button">Privacy Policy</button>
          <button type="button">Terms of Service</button>
          <button type="button">Status</button>
        </div>
      </footer>
    </div>
  );
}

export const foundationRouteIds = appRoutes.map((route) => route.id);
