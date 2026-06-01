import { foundationCopy } from '../../lib/foundationCopy';

type AuthScreenProps = {
  mode: 'login' | 'signup';
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const title = mode === 'login' ? foundationCopy.auth.loginTitle : foundationCopy.auth.signupTitle;

  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Account access</p>
      <h1>{title}</h1>
      <div className="foundation-form-panel">
        <button className="foundation-provider-button" type="button">
          {foundationCopy.auth.discord}
        </button>
        <button className="foundation-provider-button" type="button">
          {foundationCopy.auth.google}
        </button>
        <label>
          <span>Email</span>
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" placeholder="Password" />
        </label>
        <button className="foundation-primary" type="button">
          {foundationCopy.auth.email}
        </button>
        {mode === 'signup' && <p className="form-note">{foundationCopy.auth.terms}</p>}
      </div>
    </section>
  );
}
