import React from 'react';
import { useChat } from '../context/ChatContext';

const OnlineUsers: React.FC = () => {
  const { state } = useChat();
  
  // --- FIX: Read from the global state ---
  const { onlineUsers } = state;

  return (
    <div className="card p-6 h-fit">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Online Users <span className="text-gray-500">({onlineUsers.length})</span>
      </h3>
      <div className="space-y-3">
        {onlineUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">Just you for now!</p>
        ) : (
          onlineUsers.map(user => (
            <div key={user.id} className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span 
                className="text-gray-700 font-medium"
                // Optionally color the name:
                // style={{ color: user.color }}
              >
                {user.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;