import { ChevronDown, LogIn, Menu, Shield, UserRound } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { appRoutes, isSignedIn } from '../../lib/appNavigation';
import { fanProjectDisclaimer } from '../../lib/foundationCopy';
import type { FoundationRouteId, FoundationViewer } from '../../lib/foundationTypes';

type AppFrameProps = {
  activeRoute: FoundationRouteId;
  viewer: FoundationViewer;
  onRouteChange: (route: FoundationRouteId) => void;
  children: ReactNode;
};

export function AppFrame({ activeRoute, viewer, onRouteChange, children }: AppFrameProps) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const pillarRoutes = appRoutes.filter((route) => route.module);
  const signedIn = isSignedIn(viewer);

  function handleAccountMenuRoute(route: FoundationRouteId) {
    setIsAccountMenuOpen(false);
    onRouteChange(route);
  }

  return (
    <div className="foundation-shell">
      <div className="foundation-status-strip">
        <span className="foundation-status-chip">Rally v0.1</span>
        <span className="foundation-status-chip">Fleet v0.1</span>
        <span className="foundation-status-chip">S.P.O.I.L.S. v0.1</span>
        <span className="foundation-status-chip">Ground v0.1</span>
        <span className="foundation-status-chip">SC data 4.8.0-LIVE.11825000</span>
      </div>

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
          {pillarRoutes.map((route) => (
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
          {signedIn ? (
            <div className="foundation-account-menu">
              <button
                className="foundation-account-trigger"
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                type="button"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <UserRound size={17} />
                <span>{viewer.displayName}</span>
                <ChevronDown size={15} />
              </button>
              {isAccountMenuOpen && (
                <div className="foundation-account-dropdown" role="menu">
                  <button onClick={() => handleAccountMenuRoute('account')} type="button" role="menuitem">
                    Account page
                  </button>
                  <button onClick={() => handleAccountMenuRoute('notifications')} type="button" role="menuitem">
                    Notification settings
                  </button>
                  {viewer.isSiteAdmin && (
                    <button onClick={() => handleAccountMenuRoute('admin')} type="button" role="menuitem">
                      Page admin
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button className="foundation-login-action" onClick={() => onRouteChange('login')} type="button">
              <LogIn size={17} />
              <span>Log in</span>
            </button>
          )}
          <button className="foundation-icon-action mobile-menu-button" type="button" title="Menu">
            <Menu size={17} />
          </button>
        </div>
      </header>

      <div className="foundation-notification-strip">
        <button onClick={() => onRouteChange('notifications')} type="button">
          Notifications and settings
        </button>
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
