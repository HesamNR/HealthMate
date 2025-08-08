import React, { useState, useEffect } from 'react';
import NotificationPopup from './NotificationPopup';

export default function NotificationManager({ notifications, onRemoveNotification }) {
  const [activeNotifications, setActiveNotifications] = useState([]);

  useEffect(() => {
    console.log('NotificationManager: Received notifications:', notifications);
    if (notifications.length > 0) {
      // Get notifications that are not already in activeNotifications
      const newNotifications = notifications.filter(
        notification => !activeNotifications.some(active => active.id === notification.id)
      );
      
      if (newNotifications.length > 0) {
        console.log('NotificationManager: Adding new notifications:', newNotifications);
        setActiveNotifications(prev => {
          const newActiveNotifications = [...prev, ...newNotifications];
          console.log('NotificationManager: Active notifications:', newActiveNotifications);
          return newActiveNotifications;
        });
      }
    }
  }, [notifications, activeNotifications]);

  const handleCloseNotification = (notificationId) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== notificationId));
    onRemoveNotification(notificationId);
  };

  return (
    <div className="fixed top-4 right-4 z-[9998] space-y-3">
      {activeNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 20}px)`,
            zIndex: 1000 - index
          }}
        >
          <NotificationPopup
            notification={notification}
            onClose={() => handleCloseNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}
