import { io, Socket } from "socket.io-client";

const SERVER_LOCAL = "http://localhost:3000";
const SERVER_CLOUD = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

// const SOCKET_URL = SERVER_CLOUD || SERVER_LOCAL;
const SOCKET_URL = SERVER_LOCAL;

let socket = null;

export const initializeSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ No token found - cannot connect to socket");
    return null;
  }

  if (socket?.connected) {
    console.log("✅ Socket already connected");
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token, // ✅ Matches your backend authentication
    },
    withCredentials: true,
    transports: ["websocket", "polling"], // Try websocket first
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Connection events
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};
