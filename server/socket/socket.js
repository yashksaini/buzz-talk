// socket.js
import { Server } from "socket.io";
import { addNotification } from "../controllers/notificationsController.js";
import { User } from "../schemas/schemas.js";
import mongoose from "mongoose";
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
      socket.join(userData.id);
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
        // Remove the user from its own room
        socket.leave(userToRemove.userId);
      }
      // Remove user from all chat pools
      for (const chatId in chatPools) {
        chatPools[chatId] = new Set(
          Array.from(chatPools[chatId]).filter(
            (user) => user.socketId !== disconnectedUserId
          )
        );

        // Emit updated chatUsers to the specific chat room if any users are left
        if (chatPools[chatId].size > 0) {
          io.to(chatId).emit("chatUsers", Array.from(chatPools[chatId]));
        } else {
          // If no users are left, emit an empty array and optionally clean up the chat pool
          delete chatPools[chatId];
          io.to(chatId).emit("chatUsers", []);
        }
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
    socket.on("joinChatPool", ({ chatId, userId }) => {
      socket.join(chatId);
      if (!chatPools[chatId]) {
        chatPools[chatId] = new Set();
      }

      // Check if user is already in the chat pool
      const isUserInChat = Array.from(chatPools[chatId]).some(
        (user) => user.userId === userId
      );

      if (!isUserInChat) {
        chatPools[chatId].add({
          userId: userId,
          socketId: socket.id,
        });
      }
      io.to(chatId).emit("chatUsers", Array.from(chatPools[chatId]));
    });

    socket.on("leaveChatPool", ({ chatId, userId }) => {
      if (chatPools[chatId]) {
        chatPools[chatId] = new Set(
          Array.from(chatPools[chatId]).filter((user) => user.userId !== userId)
        );
      }
      socket.leave(chatId);
      if (chatPools[chatId]) {
        io.to(chatId).emit("chatUsers", Array.from(chatPools[chatId]));
      } else {
        io.to(chatId).emit("chatUsers", []);
      }
    });

    socket.on("startTyping", ({ chatId, userId }) => {
      io.to(chatId).emit("userTyping", { typingUser: userId, isTyping: true });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      io.to(chatId).emit("userTyping", { typingUser: userId, isTyping: false });
    });

    socket.on("newReadMessages", ({ chatId, newReadMessages }) => {
      io.to(chatId).emit("broadCastNewMessages", newReadMessages);
    });

    socket.on("sendMessage", async ({ chatId, newMessage, friendId }) => {
      try {
        if(!chatPools) return;
        const otherOnlineUser = Array.from(chatPools[chatId])?.filter(
          (user) => user.userId !== newMessage.senderId
        );
        if (otherOnlineUser.length > 0) {
          newMessage.readBy.push({
            userId: otherOnlineUser.userId,
            readAt: new Date(),
          });
        }
        else{
          const ownerObjectId = new mongoose.Types.ObjectId(newMessage.senderId);
          const owner = await User.findOne({ _id: ownerObjectId }).lean();
      
          await addNotification({
            userId: friendId,
            senderName: owner.fullName,
            title: ` sent you a message.`,
            desc: newMessage.message || "You have a new message in your chat. Visit the chat page to view it.",
            url: `/chats/${chatId}`,
            type: "NEW_MESSAGE",
          });
        }

        io.to(friendId).emit("recentMessage", {
          newMessage: newMessage,
          chatId: chatId,
        });
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
