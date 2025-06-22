import { useEffect, useRef, useState } from 'react';
import './App.css';

type UserMessage =
  | { type: 'join'; payload: { roomId: string } }
  | { type: 'chat'; payload: { message: string } };

export default function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // cleanup on unmount or when ws changes
  useEffect(() => {
    return () => {
      ws?.close();
    };
  }, [ws]);

  const handleJoin = () => {
    const id = inputRef.current?.value?.trim();
    if (!id) return alert('Room ID can’t be blank!');
    // tear down old socket
    ws?.close();
    setMessages([]);
    setJoined(true);
    setRoomId(id);

    // make a fresh socket
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      // only send join once you're actually connected
      const joinMsg: UserMessage = { type: 'join', payload: { roomId: id } };
      socket.send(JSON.stringify(joinMsg));
    };

    socket.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data]);
    };

    socket.onerror = (err) => console.error('WS error', err);
    socket.onclose = () => console.log('Socket closed');

    setWs(socket);
  };

  const handleChat = () => {
    const txt = inputRef.current?.value?.trim();
    if (!txt || !ws) return;
    const chatMsg: UserMessage = { type: 'chat', payload: { message: txt } };
    ws.send(JSON.stringify(chatMsg));
    inputRef.current!.value = '';
  };

  return (
    <div className="app">
      {!joined ? (
        <>
          <h2>🔑 Join a Room</h2>
          <input ref={inputRef} placeholder="Room ID" />
          <button onClick={handleJoin}>Join</button>
        </>
      ) : (
        <>
          <h2>Room: {roomId}</h2>
          <div className="chat-feed">
            {messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>
          <input ref={inputRef} placeholder="Type your message…" />
          <button onClick={handleChat}>Send</button>
        </>
      )}
    </div>
  );
}
