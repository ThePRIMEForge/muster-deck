import { useEffect, useState } from 'react';
import { foundationCopy } from '../../lib/foundationCopy';
import type { FoundationViewer } from '../../lib/foundationTypes';
import {
  generateRsiVerificationToken,
  getOrCreateProfile,
  hasSupabaseConfig,
  submitRsiVerification,
  supabase,
  updateMyProfile,
} from '../../lib/supabase';

type AccountSettingsProps = {
  viewer: FoundationViewer;
};

type IdentityState = { discord: boolean; google: boolean };

type VerificationStatus =
  | 'unverified'
  | 'token_generated'
  | 'submitted'
  | 'verified';

export function AccountSettings({ viewer }: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(viewer.displayName);
  const [primaryOrg, setPrimaryOrg] = useState('');
  const [rsiHandle, setRsiHandle] = useState('');
  const [savedRsiHandle, setSavedRsiHandle] = useState('');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [identities, setIdentities] = useState<IdentityState>({ discord: false, google: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) return;

    void getOrCreateProfile().then((profile) => {
      if (!profile) return;
      setDisplayName(profile.display_name);
      setPrimaryOrg(profile.primary_org ?? '');
      setRsiHandle(profile.rsi_handle ?? '');
      setSavedRsiHandle(profile.rsi_handle ?? '');
      setVerificationToken(profile.rsi_verification_token ?? null);
      setVerificationStatus((profile.rsi_verification_status as VerificationStatus) ?? 'unverified');
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
      await updateMyProfile({ displayName, primaryOrg, rsiHandle: rsiHandle || undefined });
      setSavedRsiHandle(rsiHandle);
      if (rsiHandle !== savedRsiHandle) {
        setVerificationToken(null);
        setVerificationStatus('unverified');
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateToken() {
    setGeneratingToken(true);
    setError(null);
    try {
      const token = await generateRsiVerificationToken();
      setVerificationToken(token);
      setVerificationStatus('token_generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate token');
    } finally {
      setGeneratingToken(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await submitRsiVerification();
      setVerificationStatus('submitted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!verificationToken) return;
    await navigator.clipboard.writeText(verificationToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const handleChanged = rsiHandle !== savedRsiHandle;

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

      {savedRsiHandle && !handleChanged && (
        <div className="foundation-form-panel">
          <p className="form-section-label">RSI handle verification</p>

          {verificationStatus === 'verified' && (
            <p className="form-success">
              Your RSI handle <strong>{savedRsiHandle}</strong> is verified.
            </p>
          )}

          {verificationStatus === 'submitted' && (
            <p className="form-info">
              Verification pending for <strong>{savedRsiHandle}</strong>. We will confirm your
              token within 24 hours. You can remove it from your bio afterwards.
            </p>
          )}

          {(verificationStatus === 'unverified' || verificationStatus === 'token_generated') && (
            <>
              <p className="foundation-subtitle">
                Prove ownership of <strong>{savedRsiHandle}</strong> by temporarily adding a
                unique code to your RSI bio at{' '}
                <a
                  href={`https://robertsspaceindustries.com/citizens/${savedRsiHandle}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  robertsspaceindustries.com/citizens/{savedRsiHandle}
                </a>
                .
              </p>

              {!verificationToken ? (
                <button
                  className="foundation-secondary"
                  type="button"
                  onClick={() => void handleGenerateToken()}
                  disabled={generatingToken || !hasSupabaseConfig}
                >
                  {generatingToken ? 'Generating…' : 'Generate verification code'}
                </button>
              ) : (
                <>
                  <div className="verification-token-row">
                    <code className="verification-token">{verificationToken}</code>
                    <button
                      className="foundation-secondary small"
                      type="button"
                      onClick={() => void handleCopy()}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <ol className="verification-steps">
                    <li>Copy the code above.</li>
                    <li>
                      Open your{' '}
                      <a
                        href="https://robertsspaceindustries.com/account/settings"
                        target="_blank"
                        rel="noreferrer"
                      >
                        RSI profile settings
                      </a>{' '}
                      and paste it into your bio.
                    </li>
                    <li>Save your RSI profile, then click the button below.</li>
                  </ol>
                  <div className="verification-actions">
                    <button
                      className="foundation-primary"
                      type="button"
                      onClick={() => void handleSubmit()}
                      disabled={submitting || !hasSupabaseConfig}
                    >
                      {submitting ? 'Submitting…' : "I've added it to my bio"}
                    </button>
                    <button
                      className="foundation-secondary"
                      type="button"
                      onClick={() => void handleGenerateToken()}
                      disabled={generatingToken || !hasSupabaseConfig}
                    >
                      {generatingToken ? 'Regenerating…' : 'Regenerate code'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
