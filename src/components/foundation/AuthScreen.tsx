import { useState } from 'react';
import { foundationCopy } from '../../lib/foundationCopy';
import { hasSupabaseConfig, supabase } from '../../lib/supabase';

type AuthScreenProps = {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
};

export function AuthScreen({ mode, onSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = mode === 'login' ? foundationCopy.auth.loginTitle : foundationCopy.auth.signupTitle;

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
          disabled={loading || !hasSupabaseConfig}
          onClick={() => void handleOAuth('discord')}
        >
          {foundationCopy.auth.discord}
        </button>
        <button
          className="foundation-provider-button"
          type="button"
          disabled={loading || !hasSupabaseConfig}
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
          disabled={loading || !email || !password || !hasSupabaseConfig}
          onClick={() => void handleEmailAuth()}
        >
          {foundationCopy.auth.email}
        </button>
        {mode === 'signup' && <p className="form-note">{foundationCopy.auth.terms}</p>}
      </div>
    </section>
  );
}
