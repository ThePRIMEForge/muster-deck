import { useEffect, useState } from 'react';
import { foundationCopy } from '../../lib/foundationCopy';
import type { FoundationViewer } from '../../lib/foundationTypes';
import {
  type AuthIdentity,
  deleteMyAccount,
  getAuthIdentities,
  getOrCreateProfile,
  hasSupabaseConfig,
  linkProvider,
  unlinkProvider,
  updateMyProfile,
} from '../../lib/supabase';

type AccountSettingsProps = {
  viewer: FoundationViewer;
};

export function AccountSettings({ viewer }: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(viewer.displayName);
  const [primaryOrg, setPrimaryOrg] = useState('');
  const [rsiHandle, setRsiHandle] = useState('');
  const [identities, setIdentities] = useState<AuthIdentity[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkingProvider, setLinkingProvider] = useState<'discord' | 'google' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;

    void getOrCreateProfile().then((profile) => {
      if (!profile) return;
      setDisplayName(profile.display_name);
      setPrimaryOrg(profile.primary_org ?? '');
      setRsiHandle(profile.rsi_handle ?? '');
    });

    void getAuthIdentities().then(setIdentities);
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateMyProfile({ displayName, primaryOrg, rsiHandle: rsiHandle || undefined });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleLink(provider: 'discord' | 'google') {
    setLinkingProvider(provider);
    setError(null);
    try {
      await linkProvider(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to link ${provider}`);
      setLinkingProvider(null);
    }
  }

  async function handleUnlink(identity: AuthIdentity) {
    setError(null);
    try {
      await unlinkProvider(identity);
      setIdentities((current) => current.filter((i) => i.identity_id !== identity.identity_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to unlink ${identity.provider}`);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMyAccount();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
      setDeleting(false);
    }
  }

  const discordIdentity = identities.find((i) => i.provider === 'discord');
  const googleIdentity = identities.find((i) => i.provider === 'google');
  const canUnlink = identities.length > 1;

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

      <div className="foundation-form-panel">
        <p className="form-section-label">Linked accounts</p>
        <div className="identity-row">
          <span>Discord</span>
          {discordIdentity ? (
            <>
              <span className="identity-status-chip linked">Linked</span>
              {canUnlink && (
                <button
                  className="foundation-secondary small"
                  type="button"
                  onClick={() => void handleUnlink(discordIdentity)}
                  disabled={!hasSupabaseConfig}
                >
                  Unlink
                </button>
              )}
            </>
          ) : (
            <>
              <span className="identity-status-chip">Not linked</span>
              <button
                className="foundation-secondary small"
                type="button"
                onClick={() => void handleLink('discord')}
                disabled={!hasSupabaseConfig || linkingProvider === 'discord'}
              >
                {linkingProvider === 'discord' ? 'Redirecting…' : 'Link Discord'}
              </button>
            </>
          )}
        </div>
        <div className="identity-row">
          <span>Google</span>
          {googleIdentity ? (
            <>
              <span className="identity-status-chip linked">Linked</span>
              {canUnlink && (
                <button
                  className="foundation-secondary small"
                  type="button"
                  onClick={() => void handleUnlink(googleIdentity)}
                  disabled={!hasSupabaseConfig}
                >
                  Unlink
                </button>
              )}
            </>
          ) : (
            <>
              <span className="identity-status-chip">Not linked</span>
              <button
                className="foundation-secondary small"
                type="button"
                onClick={() => void handleLink('google')}
                disabled={!hasSupabaseConfig || linkingProvider === 'google'}
              >
                {linkingProvider === 'google' ? 'Redirecting…' : 'Link Google'}
              </button>
            </>
          )}
        </div>
        {!canUnlink && identities.length > 0 && (
          <p className="form-hint">Link a second account before unlinking your only one.</p>
        )}
      </div>

      <div className="foundation-form-panel">
        <p className="form-section-label">Notification preferences</p>
        <p className="foundation-subtitle">
          Notification preferences will be configurable once the notification system launches.
          You can opt in to push notifications now from the{' '}
          <strong>Notifications</strong> page.
        </p>
      </div>

      <div className="foundation-form-panel danger-zone">
        <p className="form-section-label">Danger zone</p>
        {!confirmDelete ? (
          <button
            className="foundation-danger"
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={!hasSupabaseConfig}
          >
            Delete account
          </button>
        ) : (
          <div className="delete-confirm-block">
            <p>
              This will anonymize your profile data and sign you out. Your account history will
              be removed. This cannot be undone.
            </p>
            {deleteError && <p className="form-error">{deleteError}</p>}
            <div className="delete-confirm-actions">
              <button
                className="foundation-danger"
                type="button"
                onClick={() => void handleDeleteAccount()}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, delete my account'}
              </button>
              <button
                className="foundation-secondary"
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
