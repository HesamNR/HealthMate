import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    console.log('SocketContext: user changed', user ? user.email : 'null');
    
    if (user && user.email) {
      // Create new socket connection
      const newSocket = io('http://localhost:5000');
      
      // Join with user email
      newSocket.emit('join', user.email);
      console.log('SocketContext: Connected socket for', user.email);
      
      // Set up notification listeners
      newSocket.on('receive-message', (data) => {
        console.log('SocketContext: Received message for notification:', data);
        console.log('SocketContext: Current pathname:', location.pathname);
        
        // Only show notification if user is not on chat page
        if (location.pathname !== '/chat') {
          console.log('SocketContext: Creating notification for message');
          const notification = {
            id: Date.now() + Math.random(),
            content: data.content,
            senderName: data.senderName || 'Unknown User',
            timestamp: data.timestamp || new Date(),
            senderEmail: data.senderEmail
          };
          console.log('SocketContext: Notification object:', notification);
          setNotifications(prev => {
            console.log('SocketContext: Previous notifications:', prev);
            const newNotifications = [...prev, notification];
            console.log('SocketContext: New notifications array:', newNotifications);
            return newNotifications;
          });
        } else {
          console.log('SocketContext: User is on chat page, skipping notification');
        }
      });

      // Listen for general chat notifications (for users not in chat)
      newSocket.on('chat-notification', (data) => {
        console.log('SocketContext: Received chat notification:', data);
        console.log('SocketContext: Current pathname:', location.pathname);
        
        // Only show notification if user is not on chat page and it's not their own message
        if (location.pathname !== '/chat' && data.senderEmail !== user.email) {
          console.log('SocketContext: Creating notification from chat-notification event');
          const notification = {
            id: Date.now() + Math.random(),
            content: data.content,
            senderName: data.senderName || 'Unknown User',
            timestamp: data.timestamp || new Date(),
            senderEmail: data.senderEmail
          };
          console.log('SocketContext: Notification object:', notification);
          setNotifications(prev => {
            console.log('SocketContext: Previous notifications:', prev);
            const newNotifications = [...prev, notification];
            console.log('SocketContext: New notifications array:', newNotifications);
            return newNotifications;
          });
        } else {
          console.log('SocketContext: Skipping notification (on chat page or own message)');
        }
      });
      
      setSocket(newSocket);

      return () => {
        // Disconnect socket when user changes or component unmounts
        console.log('SocketContext: Disconnecting socket for', user.email);
        newSocket.disconnect();
      };
    } else {
      // If no user, disconnect existing socket
      if (socket) {
        console.log('SocketContext: Disconnecting existing socket');
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user, location.pathname]); // Added location.pathname to dependencies

  // Clear notifications when user changes
  useEffect(() => {
    setNotifications([]);
  }, [user]);

  const disconnectSocket = () => {
    if (socket) {
      console.log('SocketContext: Manual disconnect called');
      socket.disconnect();
      setSocket(null);
    }
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <SocketContext.Provider value={{ socket, disconnectSocket, notifications, removeNotification }}>
      {children}
    </SocketContext.Provider>
  );
};
