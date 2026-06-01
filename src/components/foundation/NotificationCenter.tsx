import { foundationCopy } from '../../lib/foundationCopy';
import { demoNotifications } from '../../lib/foundationData';
import type { FoundationNotification } from '../../lib/foundationData';

const categoryLabels: Record<FoundationNotification['category'], string> = {
  general: 'General',
  direct_message: 'Direct message',
  group_message: 'Group message',
  assignment: 'Assignment',
  application: 'Application',
  settlement: 'Settlement',
  tournament: 'Tournament',
  admin: 'Admin',
};

export function NotificationCenter() {
  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Messages and alerts</p>
      <h1>{foundationCopy.notifications.title}</h1>
      <button className="foundation-secondary" type="button">
        {foundationCopy.notifications.markAllRead}
      </button>
      <div className="notification-list">
        {demoNotifications.map((notification) => (
          <article
            className={`notification-card ${notification.read ? 'read' : 'unread'} notification-${notification.category}`}
            key={notification.id}
          >
            <small>{categoryLabels[notification.category]}</small>
            <strong>{notification.title}</strong>
            <span>{notification.body}</span>
            <em>{notification.createdAt}</em>
          </article>
        ))}
      </div>
    </section>
  );
}
