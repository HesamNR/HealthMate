import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users } from 'lucide-react';

export default function UserDiscovery({ user, onFriendAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/users?email=${encodeURIComponent(user.email)}`);
      
      if (response.ok) {
        const usersData = await response.json();
        console.log('Fetched users:', usersData);
        setUsers(usersData);
      } else {
        const errorData = await response.json();
        console.error('Error loading users:', errorData);
        setMessage('Error loading users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (friendEmail) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          friendEmail: friendEmail
        })
      });

      if (response.ok) {
        setMessage('Friend request sent successfully!');
        // Refresh the users list to update the UI
        fetchUsers();
        if (onFriendAdded) onFriendAdded();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Error sending friend request');
      }
    } catch (error) {
      setMessage('Error sending friend request');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(userData => 
    userData.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userData.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Discover Users</h3>
        <p className="text-sm text-gray-500">Find and connect with other HealthMate users</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, username, or email..."
            className="w-full px-4 py-3 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f0743e] focus:border-[#f0743e] bg-white shadow-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 border ${
          message.includes('Error')
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Users List */}
      <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f0743e] mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 font-medium">Loading users...</p>
          </div>
                 ) : filteredUsers.length > 0 ? (
           filteredUsers.map((userData) => (
             <div key={userData._id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
               <div className="flex items-center space-x-3">
                 {/* Avatar */}
                 <div className="relative">
                   <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                     {userData.name ? userData.name.charAt(0).toUpperCase() : userData.username.charAt(0).toUpperCase()}
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                     userData.isOnline ? 'bg-green-500' : 'bg-gray-400'
                   }`}></div>
                 </div>
                 
                 {/* User Info */}
                 <div className="flex-1 min-w-0">
                   <p className="font-semibold text-gray-900 truncate text-sm">
                     {userData.name || userData.username}
                   </p>
                   <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                 </div>
                 
                 {/* Add Button */}
                 <button
                   onClick={() => handleSendRequest(userData.email)}
                   className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                 >
                   <UserPlus size={14} />
                   <span>Add</span>
                 </button>
               </div>
             </div>
           ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No users found</h4>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
