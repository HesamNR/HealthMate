import React, { useState, useEffect } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';

export default function Chat({ user }) {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const handleFriendSelect = async (friend) => {
    setSelectedFriend(friend);
    
    try {
      // Create or get conversation
      const response = await fetch('http://localhost:5000/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          friendEmail: friend.email
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-green-500" />
            <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
          </div>
        </div>
        <ChatSidebar 
          user={user} 
          onFriendSelect={handleFriendSelect}
          selectedFriend={selectedFriend}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <ChatWindow
            user={user}
            friend={selectedFriend}
            conversationId={conversationId}
            onConversationIdChange={setConversationId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Welcome to Chat</h2>
              <p className="text-gray-500">Select a friend from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
