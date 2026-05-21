import { foundationCopy } from '../../lib/foundationCopy';
import type { FoundationViewer } from '../../lib/foundationTypes';

type AccountSettingsProps = {
  viewer: FoundationViewer;
};

export function AccountSettings({ viewer }: AccountSettingsProps) {
  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Profile</p>
      <h1>{foundationCopy.account.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.account.subtitle}</p>
      <div className="foundation-form-panel">
        <label>
          <span>Callsign</span>
          <input defaultValue={viewer.displayName} />
        </label>
        <label>
          <span>Primary organization</span>
          <input placeholder="Organization name" />
        </label>
        <label>
          <span>RSI handle</span>
          <input placeholder="RSI handle" />
        </label>
        <div className="identity-row">Discord linked</div>
        <div className="identity-row">Google linked</div>
        <button className="foundation-primary" type="button">
          Save changes
        </button>
      </div>
    </section>
  );
}
