export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  user: User;
}

export interface ChatState {
  messages: Message[];
  onlineUsers: User[];
  isConnected: boolean;
  error: string | null;
}

export interface JoinMessage {
  type: 'join';
  payload: {
    roomId: string;
    user: User; 
  };
}

export interface ChatMessagePayload {
  message: string;
  user: User;
  timestamp?: string;
}

export interface ChatMessage {
  type: 'chat';
  payload: ChatMessagePayload;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export interface IncomingChatMessage {
  type: 'chat';
  payload: {
    message: string;
    user: User;
    timestamp?: string;
  };
}

export interface UserListMessage {
  type: 'user-list';
  payload: {
    users: User[];
  };
}

export type OutgoingWebSocketMessage = JoinMessage | ChatMessage;

export type IncomingWebSocketMessage =
  | IncomingChatMessage
  | ErrorMessage
  | UserListMessage
  | { type: string; payload?: Record<string, unknown> };

export type ChatAction =
  | { type: 'SET_CONNECTED' }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_ONLINE_USERS'; payload: User[] }
  | { type: 'ADD_ONLINE_USER'; payload: User }
  | { type: 'REMOVE_ONLINE_USER'; payload: string };