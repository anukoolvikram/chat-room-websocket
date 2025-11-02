import { WebSocketServer, WebSocket } from "ws";

interface UserSocket extends WebSocket {
  user?: any; 
}

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map<string, Set<UserSocket>>();
const socketToRoom = new Map<UserSocket, string>();

function broadcastUserList(roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;
  const usersInRoom = Array.from(room).map(socket => socket.user).filter(Boolean); // Get all users
  const userListMessage = JSON.stringify({
    type: 'user-list',
    payload: { users: usersInRoom }
  });

  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(userListMessage);
    }
  }
}

wss.on('connection', (socket: UserSocket) => {
  console.log('Client connected');
  
  socket.on('message', (message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.toString());
    } catch (error) {
      console.error('Failed to parse message:', message.toString());
      return;
    }

    if (parsedMessage.type === 'join' && parsedMessage.payload?.roomId && parsedMessage.payload?.user) {
      const { roomId, user } = parsedMessage.payload;
      
      const oldRoomId = socketToRoom.get(socket);
      if (oldRoomId) {
        const oldRoom = rooms.get(oldRoomId);
        oldRoom?.delete(socket);
        if (oldRoom && oldRoom.size === 0) rooms.delete(oldRoomId);
        broadcastUserList(oldRoomId); 
      }

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      const room = rooms.get(roomId)!; 
      
      socket.user = user; 
      room.add(socket);
      socketToRoom.set(socket, roomId);
      console.log(`${user.name} joined room: ${roomId}`);
      broadcastUserList(roomId);
    }

    if (parsedMessage.type === 'chat') {
      const roomId = socketToRoom.get(socket);
      if (!roomId) {
        socket.send(JSON.stringify({ type: 'error', message: 'You must join a room before chatting.' }));
        return;
      }
      
      const room = rooms.get(roomId);
      if (room) {
        socket.user = parsedMessage.payload.user;
        
        const messageToSend = JSON.stringify({
          type: 'chat',
          payload: {
            message: parsedMessage.payload.message,
            user: socket.user, 
            timestamp: new Date().toISOString()
          }
        });
        
        for (const client of room) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(messageToSend);
          }
        }
      }
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    const roomId = socketToRoom.get(socket);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        room.delete(socket);
        if (room.size === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted.`);
        } else {
          broadcastUserList(roomId);
        }
      }
      socketToRoom.delete(socket);
    }
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server started on port 8080');