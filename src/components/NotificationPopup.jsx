import React, { useEffect, useState } from 'react';
import { X, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPopup({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('NotificationPopup: Rendering notification:', notification);
    
    // Show notification with a slight delay for smooth animation
    const timer = setTimeout(() => {
      console.log('NotificationPopup: Making notification visible');
      setIsVisible(true);
    }, 100);

    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade out animation
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoHideTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!notification) {
    console.log('NotificationPopup: No notification provided, returning null');
    return null;
  }

  return (
    <div
      className={`fixed top-4 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 transform transition-all duration-300 z-[9999] ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <MessageCircle size={18} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">New Message</h4>
            <p className="text-xs text-gray-500">HealthMate Chat</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Sender Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="font-medium text-gray-900 text-sm truncate">
                {notification.senderName || 'Unknown User'}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {notification.content}
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 pb-3">
        <button
          onClick={() => {
            // Navigate to chat using React Router
            navigate('/chat');
            handleClose();
          }}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
        >
          Open Chat
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-5000 ease-linear"
          style={{
            width: isVisible ? '0%' : '100%',
            transition: 'width 5s linear'
          }}
        />
      </div>
    </div>
  );
}
