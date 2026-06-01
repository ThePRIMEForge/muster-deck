import { foundationCopy } from '../../lib/foundationCopy';
import { demoAdminUsers } from '../../lib/foundationData';

export function AdminPortal() {
  return (
    <section className="foundation-page">
      <p className="eyebrow">Site controls</p>
      <h1>{foundationCopy.admin.title}</h1>
      <p className="foundation-subtitle">{foundationCopy.admin.subtitle}</p>
      <div className="admin-table" role="table" aria-label="Registered users">
        <div className="admin-row header" role="row">
          <span>User</span>
          <span>Status</span>
          <span>Discord</span>
          <span>RSI</span>
          <span>Last active</span>
          <span>Notes</span>
        </div>
        {demoAdminUsers.map((user) => (
          <div className={`admin-row admin-row-${user.accountStatus}`} role="row" key={user.id}>
            <strong>{user.displayName}</strong>
            <span>{user.accountStatus}</span>
            <span>{user.discordLinked ? 'Linked' : 'Not linked'}</span>
            <span>{user.rsiStatus}</span>
            <span>{user.lastActiveAt}</span>
            <span>{user.notes}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
