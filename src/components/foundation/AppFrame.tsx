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
          <Shield size={22} />
          <span>MusterDeck</span>
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
          <button onClick={() => onRouteChange('notifications')} type="button" title="Notifications">
            <Bell size={17} />
          </button>
          <button onClick={() => onRouteChange('account')} type="button" title={viewer.displayName}>
            <UserRound size={17} />
          </button>
          <button onClick={() => onRouteChange('login')} type="button" title="Log in">
            <LogIn size={17} />
          </button>
          <button className="mobile-menu-button" type="button" title="Menu">
            <Menu size={17} />
          </button>
        </div>
      </header>

      <div className="foundation-status-strip">
        <span>Rally Point v0.1</span>
        <span>Fleet Command v0.1</span>
        <span>S.P.O.I.L.S. v0.1</span>
        <span>Proving Ground v0.1</span>
        <span>Star Citizen data: 4.8.0-LIVE.11825000</span>
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
