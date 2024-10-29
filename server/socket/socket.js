// socket.js
import { Server } from "socket.io";

const activeUsers = new Set();

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
  });

  return io;
};

export const getActiveUsers = () => Array.from(activeUsers);
