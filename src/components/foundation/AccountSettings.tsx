import { useEffect, useState } from 'react';
import { foundationCopy } from '../../lib/foundationCopy';
import type { FoundationViewer } from '../../lib/foundationTypes';
import { getOrCreateProfile, hasSupabaseConfig, supabase, updateMyProfile } from '../../lib/supabase';

type AccountSettingsProps = {
  viewer: FoundationViewer;
};

type IdentityState = { discord: boolean; google: boolean };

export function AccountSettings({ viewer }: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(viewer.displayName);
  const [primaryOrg, setPrimaryOrg] = useState('');
  const [rsiHandle, setRsiHandle] = useState('');
  const [identities, setIdentities] = useState<IdentityState>({ discord: false, google: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;

    void getOrCreateProfile().then((profile) => {
      if (!profile) return;
      setDisplayName(profile.display_name);
      setPrimaryOrg(profile.primary_org ?? '');
      setRsiHandle(profile.rsi_handle ?? '');
    });

    void supabase?.auth.getUser().then(({ data: { user } }) => {
      if (!user?.identities) return;
      setIdentities({
        discord: user.identities.some((id) => id.provider === 'discord'),
        google: user.identities.some((id) => id.provider === 'google'),
      });
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateMyProfile({
        displayName,
        primaryOrg,
        rsiHandle: rsiHandle || undefined,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Profile</p>
      <h1>{foundationCopy.account.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.account.subtitle}</p>
      <div className="foundation-form-panel">
        <label>
          <span>Callsign</span>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label>
          <span>Primary organization</span>
          <input
            placeholder="Organization name"
            value={primaryOrg}
            onChange={(e) => setPrimaryOrg(e.target.value)}
          />
        </label>
        <label>
          <span>RSI handle</span>
          <input
            placeholder="RSI handle"
            value={rsiHandle}
            onChange={(e) => setRsiHandle(e.target.value)}
          />
        </label>
        <div className="identity-row">
          <span>Discord</span>
          <span className="identity-status-chip">{identities.discord ? 'Linked' : 'Not linked'}</span>
        </div>
        <div className="identity-row">
          <span>Google</span>
          <span className="identity-status-chip">{identities.google ? 'Linked' : 'Not linked'}</span>
        </div>
        {error && <p className="form-error">{error}</p>}
        {saved && <p className="form-success">Changes saved.</p>}
        <button
          className="foundation-primary"
          type="button"
          disabled={saving || !hasSupabaseConfig}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </section>
  );
}
