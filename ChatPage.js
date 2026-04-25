import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { FiSend, FiPlus, FiLogOut, FiHash, FiUsers } from "react-icons/fi";

let socket;

const ChatPage = () => {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket = io("http://localhost:5000", { auth: { token: user.token } });
    return () => socket.disconnect();
  }, [user.token]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("user_joined", ({ message }) =>
      setMessages((prev) => [...prev, { _id: Date.now(), system: true, content: message }]));
    socket.on("user_left", ({ message }) =>
      setMessages((prev) => [...prev, { _id: Date.now(), system: true, content: message }]));
    socket.on("user_typing", ({ username }) => setTypingUser(username));
    socket.on("user_stop_typing", () => setTypingUser(""));
    return () => {
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, []);

  useEffect(() => {
    axios.get("/api/rooms").then(({ data }) => setRooms(data));
  }, []);

  const joinRoom = useCallback(async (room) => {
    if (activeRoom) socket.emit("leave_room", activeRoom._id);
    setActiveRoom(room);
    setMessages([]);
    socket.emit("join_room", room._id);
    const { data } = await axios.get(`/api/messages/${room._id}`);
    setMessages(data);
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;
    socket.emit("send_message", { roomId: activeRoom._id, content: newMessage });
    socket.emit("stop_typing", { roomId: activeRoom._id });
    setNewMessage("");
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!activeRoom) return;
    socket.emit("typing", { roomId: activeRoom._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId: activeRoom._id });
    }, 1500);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const { data } = await axios.post("/api/rooms", { name: newRoomName });
      setRooms((prev) => [...prev, data]);
      setNewRoomName("");
      setShowCreateRoom(false);
      joinRoom(data);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating room");
    }
  };

  const getInitials = (name) => name?.slice(0, 2).toUpperCase();
  const getColor = (name) => {
    const colors = ["#6366f1","#ec4899","#14b8a6","#f59e0b","#10b981","#3b82f6"];
    return colors[name?.charCodeAt(0) % colors.length] || "#6366f1";
  };
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="chat-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-small"> ChatSphere</div>
          <button className="btn-icon logout-btn" onClick={logout}><FiLogOut /></button>
        </div>

        <div className="user-info">
          <div className="avatar" style={{ background: getColor(user.username) }}>
            {getInitials(user.username)}
          </div>
          <div>
            <div className="user-name">{user.username}</div>
            <div className="user-status"> Online</div>
          </div>
        </div>

        <div className="rooms-section">
          <div className="rooms-header">
            <span><FiHash /> Rooms</span>
            <button className="btn-icon" onClick={() => setShowCreateRoom(!showCreateRoom)}>
              <FiPlus />
            </button>
          </div>

          {showCreateRoom && (
            <form onSubmit={createRoom} className="create-room-form">
              <input type="text" placeholder="Room name..." value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)} autoFocus />
              <button type="submit">Create</button>
            </form>
          )}

          <div className="rooms-list">
            {rooms.map((room) => (
              <div key={room._id}
                className={`room-item ${activeRoom?._id === room._id ? "active" : ""}`}
                onClick={() => joinRoom(room)}>
                <FiHash /><span>{room.name}</span>
              </div>
            ))}
            {rooms.length === 0 && <p className="no-rooms">No rooms yet. Create one!</p>}
          </div>
        </div>
      </aside>

      <main className="chat-main">
        {activeRoom ? (
          <>
            <div className="chat-header">
              <div className="chat-room-info">
                <FiHash /><h2>{activeRoom.name}</h2>
              </div>
              <div className="chat-meta"><FiUsers /> Live Chat</div>
            </div>

            <div className="messages-container">
              {messages.map((msg, i) =>
                msg.system ? (
                  <div key={msg._id || i} className="system-message">{msg.content}</div>
                ) : (
                  <div key={msg._id || i}
                    className={`message ${msg.sender?.username === user.username ? "own" : ""}`}>
                    {msg.sender?.username !== user.username && (
                      <div className="msg-avatar" style={{ background: getColor(msg.sender?.username) }}>
                        {getInitials(msg.sender?.username)}
                      </div>
                    )}
                    <div className="msg-content">
                      {msg.sender?.username !== user.username && (
                        <div className="msg-sender">{msg.sender?.username}</div>
                      )}
                      <div className="msg-bubble">{msg.content}</div>
                      <div className="msg-time">{formatTime(msg.createdAt)}</div>
                    </div>
                  </div>
                )
              )}
              {typingUser && (
                <div className="typing-indicator">
                  <span>{typingUser} is typing</span>
                  <span className="dots"><span>.</span><span>.</span><span>.</span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-area" onSubmit={sendMessage}>
              <input type="text" placeholder={`Message #${activeRoom.name}`}
                value={newMessage} onChange={handleTyping} autoFocus />
              <button type="submit" disabled={!newMessage.trim()}><FiSend /></button>
            </form>
          </>
        ) : (
          <div className="no-room-selected">
            <div className="welcome-icon"></div>
            <h2>Welcome to ChatSphere</h2>
            <p>Select a room or create one to start chatting!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;