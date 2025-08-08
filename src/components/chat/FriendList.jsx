import React from 'react';
import { Circle, UserPlus } from 'lucide-react';

export default function FriendList({ friends, pendingRequests, onFriendSelect, selectedFriend, onAcceptRequest, onRefresh }) {
  return (
    <div className="p-4 space-y-6">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-700">
              Pending Requests ({pendingRequests.length})
            </h4>
          </div>
                     <div className="space-y-2">
             {pendingRequests.map((request) => (
               <div key={request._id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                       {request.userId.name ? request.userId.name.charAt(0).toUpperCase() : request.userId.username.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <p className="text-sm font-semibold text-gray-900">
                         {request.userId.name || request.userId.username}
                       </p>
                       <p className="text-xs text-gray-500">{request.userId.email}</p>
                     </div>
                   </div>
                   <button
                     onClick={() => onAcceptRequest(request._id)}
                     className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                   >
                     Accept
                   </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-[#f0743e] rounded-full"></div>
          <h4 className="text-sm font-semibold text-gray-700">
            Friends ({friends.length})
          </h4>
        </div>
        {friends.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No friends yet</h4>
            <p className="text-sm text-gray-500">Use the Discover tab to find friends</p>
          </div>
                 ) : (
           <div className="space-y-2">
             {friends.map((friend) => (
               <button
                 key={friend._id}
                 onClick={() => onFriendSelect(friend)}
                 className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                   selectedFriend?._id === friend._id
                     ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                     : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                 }`}
               >
                 <div className="relative">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                     selectedFriend?._id === friend._id
                       ? 'bg-white/20 text-white'
                       : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-sm'
                   }`}>
                     {friend.name ? friend.name.charAt(0).toUpperCase() : friend.username.charAt(0).toUpperCase()}
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                     selectedFriend?._id === friend._id ? 'border-white' : 'border-white'
                   } ${
                     friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                   }`}></div>
                 </div>
                 <div className="flex-1 text-left">
                   <p className={`text-sm font-medium truncate ${
                     selectedFriend?._id === friend._id ? 'text-white' : 'text-gray-900'
                   }`}>
                     {friend.name || friend.username}
                   </p>
                   <p className={`text-xs truncate ${
                     selectedFriend?._id === friend._id ? 'text-white/80' : 'text-gray-500'
                   }`}>
                     {friend.isOnline ? 'Online' : 'Offline'}
                   </p>
                 </div>
               </button>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
