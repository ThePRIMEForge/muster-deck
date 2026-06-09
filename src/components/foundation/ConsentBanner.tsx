import { Cookie } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  acceptAllCategories,
  closeConsentManager,
  openConsentManager,
  rejectAllCategories,
  saveConsent,
  useConsent,
} from '../../lib/useConsent';
import type { FoundationRouteId } from '../../lib/foundationTypes';

type ConsentBannerProps = {
  onRouteChange: (route: FoundationRouteId) => void;
};

export function ConsentBanner({ onRouteChange }: ConsentBannerProps) {
  const { hasDecided, isManagerOpen, record } = useConsent();
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  // When the manager is opened from the footer, drop into the detailed view
  // and seed the toggle from the saved choice.
  useEffect(() => {
    if (isManagerOpen) {
      setAnalytics(record?.categories.analytics ?? false);
      setCustomizing(true);
    }
  }, [isManagerOpen, record]);

  const visible = !hasDecided || isManagerOpen;

  // Once a choice has been made and the manager is closed, keep a small,
  // always-available control so consent can be changed at any time (GDPR
  // requires withdrawal to be as easy as giving consent).
  if (!visible) {
    return (
      <button
        type="button"
        className="consent-fab"
        aria-label="Cookie preferences"
        title="Cookie preferences"
        onClick={() => openConsentManager()}
      >
        <Cookie size={18} aria-hidden="true" />
      </button>
    );
  }

  function handleClose() {
    setCustomizing(false);
    closeConsentManager();
  }

  return (
    <div className="consent-root" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="consent-panel">
        {customizing ? (
          <>
            <div className="consent-copy">
              <h2>Cookie preferences</h2>
              <p>
                Choose what MusterDeck may store. Strictly necessary storage keeps you signed in and
                cannot be turned off. Everything else is your choice and off unless you opt in.
              </p>
            </div>
            <div className="consent-categories">
              <div className="consent-category">
                <div className="consent-category-copy">
                  <strong>Strictly necessary</strong>
                  <span>Required for sign-in and core app function.</span>
                </div>
                <span className="consent-locked">Always on</span>
              </div>
              <div className="consent-category">
                <div className="consent-category-copy">
                  <strong>Analytics</strong>
                  <span>Usage insights. Not in use today; stays off unless you turn it on.</span>
                </div>
                <label className="consent-switch">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                  />
                  <span>{analytics ? 'On' : 'Off'}</span>
                </label>
              </div>
            </div>
            <div className="consent-actions">
              {isManagerOpen && (
                <button type="button" className="consent-secondary" onClick={handleClose}>
                  Cancel
                </button>
              )}
              <button
                type="button"
                className="consent-secondary"
                onClick={() => saveConsent(rejectAllCategories)}
              >
                Reject all
              </button>
              <button
                type="button"
                className="consent-primary"
                onClick={() => saveConsent({ essential: true, analytics })}
              >
                Save preferences
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="consent-copy">
              <h2>Cookies &amp; your privacy</h2>
              <p>
                MusterDeck uses only essential cookies to keep you signed in, and no third-party
                tracking today. See our{' '}
                <button
                  type="button"
                  className="consent-link"
                  onClick={() => onRouteChange('privacy')}
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
            <div className="consent-actions">
              <button
                type="button"
                className="consent-secondary"
                onClick={() => setCustomizing(true)}
              >
                Customize
              </button>
              <button
                type="button"
                className="consent-secondary"
                onClick={() => saveConsent(rejectAllCategories)}
              >
                Reject all
              </button>
              <button
                type="button"
                className="consent-primary"
                onClick={() => saveConsent(acceptAllCategories)}
              >
                Accept all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
