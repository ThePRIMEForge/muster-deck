import { useEffect, useState } from 'react';
import { foundationCopy } from '../../lib/foundationCopy';
import { adminSetAccountStatus, type AdminProfileRow, hasSupabaseConfig, listProfilesForAdmin } from '../../lib/supabase';

type ActionState = { profileId: string; acting: boolean } | null;

export function AdminPortal() {
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<ActionState>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setLoading(false);
      return;
    }
    void listProfilesForAdmin()
      .then(setProfiles)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(
    profileId: string,
    act: 'ban' | 'unban' | 'restrict' | 'unrestrict',
  ) {
    setAction({ profileId, acting: true });
    setError(null);
    try {
      await adminSetAccountStatus(profileId, act);
      const updated = await listProfilesForAdmin();
      setProfiles(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setAction(null);
    }
  }

  function actionsFor(profile: AdminProfileRow) {
    const busy = action?.profileId === profile.id && action.acting;
    if (profile.account_status === 'banned') {
      return (
        <button
          className="admin-action-button"
          type="button"
          disabled={busy}
          onClick={() => void handleAction(profile.id, 'unban')}
        >
          Unban
        </button>
      );
    }
    if (profile.account_status === 'restricted') {
      return (
        <>
          <button
            className="admin-action-button"
            type="button"
            disabled={busy}
            onClick={() => void handleAction(profile.id, 'unrestrict')}
          >
            Unrestrict
          </button>
          <button
            className="admin-action-button admin-action-danger"
            type="button"
            disabled={busy}
            onClick={() => void handleAction(profile.id, 'ban')}
          >
            Ban
          </button>
        </>
      );
    }
    return (
      <>
        <button
          className="admin-action-button"
          type="button"
          disabled={busy}
          onClick={() => void handleAction(profile.id, 'restrict')}
        >
          Restrict
        </button>
        <button
          className="admin-action-button admin-action-danger"
          type="button"
          disabled={busy}
          onClick={() => void handleAction(profile.id, 'ban')}
        >
          Ban
        </button>
      </>
    );
  }

  return (
    <section className="foundation-page">
      <p className="eyebrow">Site controls</p>
      <h1>{foundationCopy.admin.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.admin.subtitle}</p>
      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p className="foundation-subtitle">Loading users…</p>
      ) : (
        <div className="admin-table" role="table" aria-label="Registered users">
          <div className="admin-row header" role="row">
            <span>User</span>
            <span>Status</span>
            <span>Discord</span>
            <span>RSI</span>
            <span>Last active</span>
            <span>Actions</span>
          </div>
          {profiles.length === 0 ? (
            <p className="foundation-subtitle">No users found.</p>
          ) : (
            profiles.map((profile) => (
              <div
                className={`admin-row admin-row-${profile.account_status}`}
                role="row"
                key={profile.id}
              >
                <strong>{profile.display_name}</strong>
                <span>{profile.account_status}</span>
                <span>{profile.discord_linked ? 'Linked' : 'Not linked'}</span>
                <span>{profile.rsi_handle ?? '—'}</span>
                <span>
                  {profile.last_active_at
                    ? new Date(profile.last_active_at).toLocaleDateString()
                    : '—'}
                </span>
                <span className="admin-actions">{actionsFor(profile)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
