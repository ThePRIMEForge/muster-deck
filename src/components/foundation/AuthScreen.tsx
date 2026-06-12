import { useState } from 'react';
import type { FoundationRouteId } from '../../lib/foundationTypes';
import { foundationCopy } from '../../lib/foundationCopy';
import { hasSupabaseConfig, supabase } from '../../lib/supabase';

type AuthScreenProps = {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
  onRouteChange?: (route: FoundationRouteId) => void;
};

export function AuthScreen({ mode, onSuccess, onRouteChange }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const title = mode === 'login' ? foundationCopy.auth.loginTitle : foundationCopy.auth.signupTitle;
  const requiresConsent = mode === 'signup';
  const signupBlocked = requiresConsent && !consentGiven;

  async function handleOAuth(provider: 'discord' | 'google') {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
    // Browser redirects on success — useAuth picks up the session on return
  }

  async function handleEmailAuth() {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: authError } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      onSuccess?.();
    }
  }

  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Account access</p>
      <h1>{title}</h1>
      <div className="foundation-form-panel">
        <button
          className="foundation-provider-button"
          type="button"
          disabled={loading || !hasSupabaseConfig || signupBlocked}
          onClick={() => void handleOAuth('discord')}
        >
          {foundationCopy.auth.discord}
        </button>
        <button
          className="foundation-provider-button"
          type="button"
          disabled={loading || !hasSupabaseConfig || signupBlocked}
          onClick={() => void handleOAuth('google')}
        >
          {foundationCopy.auth.google}
        </button>
        <label>
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button
          className="foundation-primary"
          type="button"
          disabled={loading || !email || !password || !hasSupabaseConfig || signupBlocked}
          onClick={() => void handleEmailAuth()}
        >
          {foundationCopy.auth.email}
        </button>
        {requiresConsent && (
          <label className="consent-label">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
            />
            <span>
              {foundationCopy.auth.consentPrefix}{' '}
              <button
                type="button"
                className="inline-link"
                onClick={() => onRouteChange?.('terms')}
              >
                {foundationCopy.auth.termsLink}
              </button>{' '}
              {foundationCopy.auth.consentAnd}{' '}
              <button
                type="button"
                className="inline-link"
                onClick={() => onRouteChange?.('privacy')}
              >
                {foundationCopy.auth.privacyLink}
              </button>
              {foundationCopy.auth.consentSuffix}
            </span>
          </label>
        )}
      </div>
    </section>
  );
}
