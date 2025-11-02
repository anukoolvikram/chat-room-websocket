import React, { useState } from 'react';
import type { User } from '../types';

interface UserProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user.name);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateUser({
        ...user,
        name: editName.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(user.name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-3">
      {isEditing ? (
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="bg-transparent border border-white/30 rounded px-2 py-1 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Enter name"
            maxLength={20}
          />
          <button 
            onClick={handleSave}
            className="text-white hover:text-green-300 transition-colors"
          >
            ✓
          </button>
          <button 
            onClick={handleCancel}
            className="text-white hover:text-red-300 transition-colors"
          >
            ✗
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div 
            className="px-2 py-1 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-white font-medium">{user.name}</span>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✏️
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;