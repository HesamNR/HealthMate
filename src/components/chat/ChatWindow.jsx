import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatHeader from './ChatHeader';
import { useSocket } from '../../contexts/SocketContext';
import EmojiPicker from 'emoji-picker-react';

export default function ChatWindow({ user, friend, conversationId, onConversationIdChange }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Join conversation room when conversationId changes
  useEffect(() => {
    if (socket && conversationId) {
      socket.emit('join-conversation', conversationId);
      fetchMessages();
    }
  }, [socket, conversationId]);

  // Mark messages as read when messages are loaded or new messages arrive
  useEffect(() => {
    if (socket && conversationId && messages.length > 0) {
      const unreadMessages = messages.filter(msg => 
        msg.senderId.email !== user.email && msg.status !== 'read'
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg._id);
        console.log('Marking messages as read:', messageIds);
        socket.emit('message-read', { conversationId, messageIds });
      }
    }
  }, [socket, conversationId, messages, user.email]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (data.conversationId === conversationId) {
        console.log('Received message:', data);
        
        // Don't add the message if it's from the current user (to prevent duplicates)
        if (data.senderEmail === user.email) {
          console.log('Ignoring own message to prevent duplicate');
          return;
        }
        
        setMessages(prev => [...prev, {
          _id: data.messageId,
          content: data.content,
          senderId: { email: data.senderEmail },
          timestamp: data.timestamp,
          status: data.status || 'delivered'
        }]);
        
        // Mark received message as read after a short delay if it's from another user
        if (data.senderEmail !== user.email) {
          setTimeout(() => {
            console.log('Marking received message as read:', data.messageId);
            socket.emit('message-read', { 
              conversationId, 
              messageIds: [data.messageId] 
            });
          }, 1000);
        }
      }
    };

    const handleMessageSent = (data) => {
      if (data.conversationId === conversationId) {
        console.log('Message sent:', data.messageId);
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId ? { ...msg, status: 'sent' } : msg
        ));
      }
    };

    const handleMessageDelivered = (data) => {
      if (data.conversationId === conversationId) {
        console.log('Message delivered:', data.messageId);
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId ? { ...msg, status: 'delivered' } : msg
        ));
      }
    };

    const handleUserTyping = (data) => {
      if (data.conversationId === conversationId && data.userEmail !== user.email) {
        setTypingUsers(prev => new Set(prev).add(data.userEmail));
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (data) => {
      if (data.conversationId === conversationId && data.userEmail !== user.email) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userEmail);
          return newSet;
        });
        setIsTyping(typingUsers.size > 1);
      }
    };

    const handleMessagesRead = (data) => {
      if (data.conversationId === conversationId) {
        console.log('Messages marked as read:', data.messageIds);
        setMessages(prev => prev.map(msg => 
          data.messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg
        ));
      }
    };

    // Connection events
    const handleConnect = () => {
      console.log('Connected to chat server');
    };

    const handleDisconnect = () => {
      console.log('Disconnected from chat server');
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('message-delivered', handleMessageDelivered);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('messages-read', handleMessagesRead);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('message-delivered', handleMessageDelivered);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('messages-read', handleMessagesRead);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, conversationId, user.email, typingUsers]);

  const fetchMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/chat/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    try {
      // Create message in database
      const response = await fetch('http://localhost:5000/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: user._id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const messageData = await response.json();
        
        // Add message to local state with "sent" status
        setMessages(prev => [...prev, {
          ...messageData,
          senderId: { email: user.email },
          status: 'sent'
        }]);

        // Send via socket
        socket.emit('send-message', {
          conversationId,
          senderEmail: user.email,
          content: newMessage.trim(),
          messageId: messageData._id
        });

        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && conversationId) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing start
      socket.emit('typing-start', {
        conversationId,
        userEmail: user.email
      });

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing-stop', {
          conversationId,
          userEmail: user.email
        });
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  if (!friend) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p>Select a friend to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ChatHeader friend={friend} />
      </div>
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId.email === user.email}
                formatTime={formatTime}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Fixed Input Area */}
      <div className="flex-shrink-0">
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            {/* Emoji Picker Button */}
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={!conversationId}
            >
              <Smile size={20} />
            </button>
            
            {/* Message Input */}
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!conversationId}
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim() || !conversationId}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute bottom-20 left-4 z-50"
            >
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
                searchPlaceholder="Search emoji..."
                skinTonesDisabled
                lazyLoadEmojis
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
