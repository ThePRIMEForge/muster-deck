import { useEffect, useState } from 'react';
import { getPublicProfile, hasSupabaseConfig, type PublicProfileRow } from '../../lib/supabase';

const tierLabels: Record<string, string> = {
  captain: 'Captain',
  admiral: 'Admiral',
  praetorian: 'Praetorian',
};

type Props = {
  rsiHandle: string;
};

export function PublicProfilePage({ rsiHandle }: Props) {
  const [profile, setProfile] = useState<PublicProfileRow | null | 'loading'>('loading');

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setProfile(null);
      return;
    }
    void getPublicProfile(rsiHandle).then(setProfile);
  }, [rsiHandle]);

  return (
    <div className="public-profile-shell">
      <header className="public-profile-header">
        <a href="/" className="public-profile-home-link">MusterDeck</a>
      </header>

      <main className="public-profile-main">
        {profile === 'loading' && (
          <p className="public-profile-loading">Loading profile…</p>
        )}

        {profile === null && (
          <section className="foundation-page narrow-page">
            <p className="eyebrow">Citizen not found</p>
            <h1>No profile for &ldquo;{rsiHandle}&rdquo;</h1>
            <p className="foundation-subtitle">
              This RSI handle does not match any registered MusterDeck pilot, or the profile is not public.
            </p>
            <a href="/" className="foundation-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Go to MusterDeck
            </a>
          </section>
        )}

        {profile && profile !== 'loading' && (
          <section className="foundation-page narrow-page">
            <p className="eyebrow">Pilot profile</p>
            <h1>{profile.display_name}</h1>

            <div className="profile-badges">
              {profile.rsi_verification_status === 'verified' ? (
                <span className="profile-badge verified">RSI Verified</span>
              ) : (
                <span className="profile-badge unverified">RSI Unverified</span>
              )}
              {profile.patreon_tier !== 'none' && tierLabels[profile.patreon_tier] && (
                <span className="profile-badge supporter">
                  {tierLabels[profile.patreon_tier]} Supporter
                </span>
              )}
            </div>

            <dl className="profile-detail-list">
              <div className="profile-detail-row">
                <dt>RSI Handle</dt>
                <dd>{profile.rsi_handle}</dd>
              </div>
              {profile.primary_org && (
                <div className="profile-detail-row">
                  <dt>Organization</dt>
                  <dd>{profile.primary_org}</dd>
                </div>
              )}
              <div className="profile-detail-row">
                <dt>Operations</dt>
                <dd className="profile-detail-pending">Tracking coming soon</dd>
              </div>
            </dl>

            <a href="/" className="foundation-secondary" style={{ display: 'inline-block', marginTop: '2rem' }}>
              Open MusterDeck
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
