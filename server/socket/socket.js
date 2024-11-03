// socket.js
import { Server } from "socket.io";
// import { addNewMessage } from "../utils/chatUtils.js";

const activeUsers = new Set();
const chatPools = {}; // Store active users per chatId
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: true, // Allow requests from this origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    io.emit("activeUsers", Array.from(activeUsers));

    socket.on("login", async (userData) => {
      const user = {
        userId: userData.id,
        fullName: userData.fullName,
        socketId: socket.id,
        username: userData.username,
      };
      const existingUser = Array.from(activeUsers).find(
        (user) => user.userId === userData.id
      );

      if (!existingUser) {
        activeUsers.add(user);
      }
      io.emit("activeUsers", Array.from(activeUsers));
    });

    socket.on("logout", async (socketId) => {
      const userToRemove = Array.from(activeUsers).find(
        (user) => user.socketId === socketId
      );
      if (userToRemove) {
        activeUsers.delete(userToRemove);
      }
      io.emit("activeUsers", Array.from(activeUsers));
    });

    socket.on("disconnect", () => {
      const disconnectedUserId = socket.id;
      const userToRemove = Array.from(activeUsers).find(
        (user) => user.socketId === disconnectedUserId
      );
      if (userToRemove) {
        activeUsers.delete(userToRemove);
      }

      io.emit("activeUsers", Array.from(activeUsers));
    });

    socket.on("profileVisit", ({ visitedUserId, visitorName }) => {
      const visitedUser = Array.from(activeUsers).find(
        (user) => user.userId === visitedUserId
      );

      if (visitedUser) {
        io.to(visitedUser.socketId).emit("profileVisit", {
          visitorName,
          visitedUserId,
        });
      }
    });

    // Chat Sockets
    socket.on("joinChatPool", ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on("leaveChatPool", ({ chatId }) => {
      socket.leave(chatId);
    });

    socket.on("startTyping", ({ chatId, userId }) => {
      io.to(chatId).emit("userTyping", { typingUser: userId, isTyping: true });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      io.to(chatId).emit("userTyping", { typingUser: userId, isTyping: false });
    });

    socket.on("sendMessage", async ({ chatId, newMessage }) => {
      try {
        io.to(chatId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error adding new message:", error);
      }
    });

    socket.on("disconnectChat", () => {
      for (const chatId in chatPools) {
        chatPools[chatId] = new Set(
          Array.from(chatPools[chatId]).filter(
            (user) => user.socketId !== socket.id
          )
        );
        io.to(chatId).emit("chatPoolUpdate", Array.from(chatPools[chatId]));
      }
    });
  });

  return io;
};

export const getActiveUsers = () => Array.from(activeUsers);
