"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server.js
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const rooms = new Map();
const socketToRoom = new Map();
// socketToUser map is no longer needed, we'll store on the socket
// Helper function to broadcast the user list
function broadcastUserList(roomId) {
    const room = rooms.get(roomId);
    if (!room)
        return;
    const usersInRoom = Array.from(room).map(socket => socket.user).filter(Boolean); // Get all users
    const userListMessage = JSON.stringify({
        type: 'user-list',
        payload: { users: usersInRoom }
    });
    for (const client of room) {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(userListMessage);
        }
    }
}
wss.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('message', (message) => {
        var _a, _b;
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        }
        catch (error) {
            console.error('Failed to parse message:', message.toString());
            return;
        }
        // 1. --- JOIN logic ---
        if (parsedMessage.type === 'join' && ((_a = parsedMessage.payload) === null || _a === void 0 ? void 0 : _a.roomId) && ((_b = parsedMessage.payload) === null || _b === void 0 ? void 0 : _b.user)) {
            const { roomId, user } = parsedMessage.payload;
            // Leave old room if any
            const oldRoomId = socketToRoom.get(socket);
            if (oldRoomId) {
                const oldRoom = rooms.get(oldRoomId);
                oldRoom === null || oldRoom === void 0 ? void 0 : oldRoom.delete(socket);
                if (oldRoom && oldRoom.size === 0)
                    rooms.delete(oldRoomId);
                broadcastUserList(oldRoomId); // Update old room's user list
            }
            // Join new room
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }
            const room = rooms.get(roomId);
            socket.user = user; // <-- Store user on the socket
            room.add(socket);
            socketToRoom.set(socket, roomId);
            console.log(`${user.name} joined room: ${roomId}`);
            // Broadcast the new user list to everyone in the room
            broadcastUserList(roomId);
        }
        // 2. --- CHAT logic ---
        if (parsedMessage.type === 'chat') {
            const roomId = socketToRoom.get(socket);
            if (!roomId) {
                socket.send(JSON.stringify({ type: 'error', message: 'You must join a room before chatting.' }));
                return;
            }
            const room = rooms.get(roomId);
            if (room) {
                // Update the user on the socket, in case they changed their name
                socket.user = parsedMessage.payload.user;
                const messageToSend = JSON.stringify({
                    type: 'chat',
                    payload: {
                        message: parsedMessage.payload.message,
                        user: socket.user, // Use the (potentially updated) user from the socket
                        timestamp: new Date().toISOString()
                    }
                });
                // Broadcast to ALL clients in the room (including sender)
                for (const client of room) {
                    if (client.readyState === ws_1.WebSocket.OPEN) {
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
                }
                else {
                    // Broadcast the new user list now that one user has left
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
