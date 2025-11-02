import React, { useState } from 'react';
import type { User } from '../types';

interface RoomSelectorProps {
  onJoinRoom: (roomId: string) => void;
  user: User | null;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ onJoinRoom, user }) => {
  const [roomId, setRoomId] = useState<string>('');
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoinRoom(roomId.trim());
    }
  };

  const generateRoomId = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRandomRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsCreatingRoom(true);
  };

  const predefinedRooms = ['general', 'random', 'tech', 'games', 'music'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name}! 👋</h2>
        <p className="text-blue-100 text-lg">Join an existing room or create a new one to start chatting</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Predefined Rooms */}
        <div className="card p-6 animate-slide-up">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Rooms</h3>
          <div className="grid grid-cols-2 gap-3">
            {predefinedRooms.map(room => (
              <button
                key={room}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => onJoinRoom(room)}
              >
                #{room}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Room */}
        <div className="card p-6 animate-slide-up">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Room</h3>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="input-field"
                maxLength={20}
              />
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={createRandomRoom}
              >
                Generate ID
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!roomId.trim()}
              >
                {isCreatingRoom ? 'Create Room' : 'Join Room'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isCreatingRoom && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center animate-fade-in">
          <p className="text-blue-800">
            Room <strong className="font-mono">#{roomId}</strong> created! Share this ID with friends to invite them.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;