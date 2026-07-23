import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? true
        : "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("========== SOCKET CONNECT ==========");
  console.log("Socket ID:", socket.id);
  console.log("Query:", socket.handshake.query);

  const userId = socket.handshake.query.userId;

  console.log("User ID:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  console.log("Online Users Map:", userSocketMap);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    delete userSocketMap[userId];

    console.log("After Disconnect:", userSocketMap);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
