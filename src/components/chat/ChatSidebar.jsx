import React, { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';
import FriendList from './FriendList';
import UserDiscovery from './UserDiscovery';

export default function ChatSidebar({ user, onFriendSelect, selectedFriend }) {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, [user.email]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/friends?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/friends/pending?email=${encodeURIComponent(user.email)}`);
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendshipId })
      });
      
      if (response.ok) {
        fetchFriends();
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex space-x-2">
                     <button
             onClick={() => setActiveTab('friends')}
             className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
               activeTab === 'friends'
                 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
             }`}
           >
             <Users size={16} className="inline mr-2" />
             Friends ({friends.length})
           </button>
           <button
             onClick={() => setActiveTab('discover')}
             className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
               activeTab === 'discover'
                 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
             }`}
           >
             <UserPlus size={16} className="inline mr-2" />
             Discover
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeTab === 'friends' && (
          <FriendList
            friends={friends}
            pendingRequests={pendingRequests}
            onFriendSelect={onFriendSelect}
            selectedFriend={selectedFriend}
            onAcceptRequest={handleAcceptRequest}
            onRefresh={fetchFriends}
          />
        )}
        {activeTab === 'discover' && (
          <UserDiscovery
            user={user}
            onFriendAdded={fetchFriends}
          />
        )}
      </div>
    </div>
  );
}
