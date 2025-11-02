import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import Notification from './Notification';
import type {
  User,
  OutgoingWebSocketMessage,
  IncomingWebSocketMessage,
  IncomingChatMessage,
  ErrorMessage
} from '../types';

interface ChatRoomProps {
  roomId: string;
  user: User;
  onLeaveRoom: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, user, onLeaveRoom }) => {
  const [message, setMessage] = useState<string>('');
  const { state, dispatch } = useChat();
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Connect WebSocket when component mounts or dependencies change ---
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomId, user]);

  // --- Scroll to bottom when new messages arrive ---
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const connectWebSocket = () => {
    // Close any previous connection first
    if (wsRef.current) {
      wsRef.current.close();
    }

    const websocket = new WebSocket('ws://localhost:8080');
    wsRef.current = websocket;

    websocket.onopen = () => {
      console.log('Connected to WebSocket');
      dispatch({ type: 'SET_CONNECTED' });

      const joinMessage: OutgoingWebSocketMessage = {
        type: 'join',
        payload: { roomId, user }
      };
      websocket.send(JSON.stringify(joinMessage));
    };

    websocket.onmessage = (event: MessageEvent) => {
      try {
        const data: IncomingWebSocketMessage = JSON.parse(event.data);

        if (data.type === 'error') {
          const errorData = data as ErrorMessage;
          dispatch({
            type: 'SET_ERROR',
            payload: errorData.message || 'An error occurred'
          });
          return;
        }

        if (data.type === 'user-list' && data.payload?.users) {
          dispatch({
            type: 'SET_ONLINE_USERS',
            payload: data.payload.users as User[]
          });
          return;
        }

        if (data.type === 'chat') {
          const chatData = data as IncomingChatMessage;
          const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: chatData.payload.message,
            timestamp: chatData.payload.timestamp || new Date().toISOString(),
            user: chatData.payload.user
          };
          dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        console.log('Received non-JSON message:', event.data);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket');
      dispatch({ type: 'SET_DISCONNECTED' });
      dispatch({ type: 'SET_ONLINE_USERS', payload: [] });
    };

    websocket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Connection error' });
    };
  };

  const sendMessage = (text: string) => {
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && text.trim()) {
      const chatMessage: OutgoingWebSocketMessage = {
        type: 'chat',
        payload: {
          message: text,
          user: user
        }
      };
      socket.send(JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLeave = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SET_ONLINE_USERS', payload: [] });
    onLeaveRoom();
  };

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-800">Room: #{roomId}</div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                state.isConnected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  state.isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              {state.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button 
            onClick={handleLeave} 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Content Area - Fixed scrolling issue */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* Messages Section - Fixed scrolling */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Message List with proper scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <MessageList messages={state.messages} currentUser={user} />
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 shrink-0">
            <MessageInput
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              disabled={!state.isConnected}
            />
          </div>
        </div>

        {/* Sidebar - Only when needed */}
        {state.onlineUsers.length > 0 && (
          <div className="w-64 shrink-0">
            <OnlineUsers />
          </div>
        )}
      </div>

      {/* Notification */}
      {state.error && (
        <Notification
          message={state.error}
          type="error"
          onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}
        />
      )}
    </div>
  );
};

export default ChatRoom;