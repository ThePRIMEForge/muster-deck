import { foundationCopy } from '../../lib/foundationCopy';
import { demoNotifications } from '../../lib/foundationData';

export function NotificationCenter() {
  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Orders and updates</p>
      <h1>{foundationCopy.notifications.title}</h1>
      <button className="foundation-secondary" type="button">
        {foundationCopy.notifications.markAllRead}
      </button>
      <div className="notification-list">
        {demoNotifications.map((notification) => (
          <article className={notification.read ? 'notification-card read' : 'notification-card'} key={notification.id}>
            <strong>{notification.title}</strong>
            <span>{notification.body}</span>
            <em>{notification.createdAt}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
