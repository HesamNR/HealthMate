import React from 'react';
import { Circle } from 'lucide-react';

export default function ChatHeader({ friend }) {
  return (
    <div className="flex items-center space-x-3 p-4 border-b border-gray-200 bg-gray-50">
      <div className="relative">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
          {friend.name ? friend.name.charAt(0).toUpperCase() : friend.username.charAt(0).toUpperCase()}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}>
          {friend.isOnline && <Circle size={8} className="text-green-500" />}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">
          {friend.name || friend.username}
        </h3>
        <p className="text-sm text-gray-500">
          {friend.isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
}
