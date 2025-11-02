// App.tsx
import { useState, useEffect } from 'react';
import RoomSelector from './components/RoomSelector';
import ChatRoom from './components/ChatRoom';
import UserProfile from './components/UserProfile';
import { ChatProvider } from './context/ChatContext';
import type { User } from './types';
import './App.css';

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const randomUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: `User${Math.floor(Math.random() * 1000)}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setUser(randomUser);
      localStorage.setItem('chatUser', JSON.stringify(randomUser));
    }
  }, []);

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
  };

  return (
    <ChatProvider>
      <div className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <img src="/titleLogo.svg" alt="" className="h-12 w-12" />
              <h2 className="text-2xl font-bold text-white">ChatterBox</h2>
              {user && <UserProfile user={user} onUpdateUser={updateUser} />}
            </div>
          </div>
        </header>

        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!user ? (
              <div className="text-center text-white font-medium">Loading user...</div>
            ) : !currentRoom ? (
              <RoomSelector onJoinRoom={handleJoinRoom} user={user} />
            ) : (
              <ChatRoom 
                roomId={currentRoom} 
                user={user} // No '!' needed
                onLeaveRoom={handleLeaveRoom}
              />
            )}
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}

export default App;