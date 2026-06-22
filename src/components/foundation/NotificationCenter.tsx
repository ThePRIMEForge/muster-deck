import { useEffect, useState } from 'react';
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

type PermissionState = 'unsupported' | 'default' | 'granted' | 'denied';

function useNotificationPermission(): [PermissionState, () => Promise<void>] {
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission as PermissionState;
  });

  useEffect(() => {
    if (!('Notification' in window)) return;
    setPermission(Notification.permission as PermissionState);
  }, []);

  async function requestPermission() {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as PermissionState);
  }

  return [permission, requestPermission];
}

export function NotificationCenter() {
  const [permission, requestPermission] = useNotificationPermission();

  return (
    <section className="foundation-page narrow-page">
      <p className="eyebrow">Messages and alerts</p>
      <h1>{foundationCopy.notifications.title}</h1>

      {permission === 'default' && (
        <div className="notification-permission-banner">
          <p>Enable push notifications to get real-time alerts for operations, crew assignments, and messages.</p>
          <button
            className="foundation-primary"
            type="button"
            onClick={() => void requestPermission()}
          >
            Enable notifications
          </button>
        </div>
      )}
      {permission === 'denied' && (
        <p className="notification-permission-denied">
          Notifications are blocked in your browser settings. To enable them, update your browser permissions for this site.
        </p>
      )}

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
