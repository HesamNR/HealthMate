import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import NotificationManager from './NotificationManager';

export default function NotificationWrapper() {
  const { notifications, removeNotification } = useSocket();

  return (
    <NotificationManager 
      notifications={notifications} 
      onRemoveNotification={removeNotification}
    />
  );
}
