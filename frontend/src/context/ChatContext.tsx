import React, { createContext, useReducer, useContext } from 'react';
import type { ChatState, ChatAction } from '../types';
import type { Dispatch } from 'react';

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
  isConnected: false,
  error: null,
};

const ChatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: true, error: null };
    case 'SET_DISCONNECTED':
      return { ...state, isConnected: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_MESSAGE':
      // Prevent duplicates just in case
      if (state.messages.some(msg => msg.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    // You can add more actions like ADD/REMOVE user if needed
    case 'ADD_ONLINE_USER':
      if (state.onlineUsers.find(u => u.id === action.payload.id)) return state;
      return { ...state, onlineUsers: [...state.onlineUsers, action.payload] };
    case 'REMOVE_ONLINE_USER':
      return { 
        ...state, 
        onlineUsers: state.onlineUsers.filter(u => u.id !== action.payload) 
      };
    default:
      return state;
  }
};

interface ChatContextProps {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(ChatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};