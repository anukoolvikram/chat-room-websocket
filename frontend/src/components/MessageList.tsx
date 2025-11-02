import React from 'react';
import type { Message, User } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">No messages yet. Start the conversation!</p>
            <p className="text-sm mt-2">Send a message to begin chatting</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          // The duplicate check was removed from ChatRoom, 
          // but this check for rendering is fine if you still want it.
          // However, server-side duplicate prevention is better.
          // For now, we just render every message in the state.
          return (
            <div
              key={message.id}
              className={`flex ${message.user.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.user.id === currentUser?.id
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
              }`}>
                {message.user.id !== currentUser?.id && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: message.user.color }}
                    >
                      {message.user.name}
                    </span>
                  </div>
                )}
                <div className="break-words text-sm leading-relaxed">
                  {message.text}
                </div>
                <div className={`text-xs mt-1 ${
                  message.user.id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;