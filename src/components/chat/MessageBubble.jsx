import React, { useState } from 'react';
import { Check, CheckCheck, Clock, Calendar } from 'lucide-react';

export default function MessageBubble({ message, isOwn, formatTime }) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check size={14} className="text-gray-600" strokeWidth={3} />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-600" strokeWidth={3} />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" strokeWidth={3} />;
      default:
        return <Check size={14} className="text-gray-600" strokeWidth={3} />;
    }
  };

  const getStatusText = () => {
    switch (message.status) {
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
      default:
        return 'Sent';
    }
  };

  const formatFullDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      date: date.toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const handleContextMenu = (e) => {
    if (isOwn) {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    }
  };

  const handleClickOutside = () => {
    setShowContextMenu(false);
  };

  React.useEffect(() => {
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  const { time: fullTime, date: fullDate } = formatFullDateTime(message.timestamp);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-green-500 text-white rounded-br-md'
            : 'bg-gray-200 text-gray-800 rounded-bl-md'
        }`}
        onContextMenu={handleContextMenu}
      >
        <div className="break-words">{message.content}</div>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon()}
        </div>
      </div>

      {/* Context Menu for Sent Messages */}
      {showContextMenu && isOwn && (
        <div 
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]"
          style={{ 
            left: contextMenuPosition.x, 
            top: contextMenuPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCheck size={16} className="text-green-600" />
              <span className="text-sm font-medium text-gray-900">
                {getStatusText()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{fullTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{fullDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
