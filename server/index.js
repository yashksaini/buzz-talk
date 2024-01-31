import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Connection } from "./database/db.js";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true, // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const URL = `mongodb+srv://${username}:${password}@buzz-talk.cawopel.mongodb.net/?retryWrites=true&w=majority`;
Connection(username, password);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Trust the first proxy in the chain
app.set("trust proxy", 1);
app.use(
  session({
    secret: "asdfefna",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
      httpOnly: true,
      secure: false, // For development; set to true in production (requires HTTPS)
    },
  })
);

// To initialize CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

import Routes from "./routes/routes.js";
app.use("/", Routes);

// Created a list of new logged in users
const activeUsers = new Set();

io.on("connection", (socket) => {
  io.emit("activeUsers", () => {}, Array.from(activeUsers));

  socket.on("login", async (userData) => {
    const user = {
      userId: userData.id,
      fullName: userData.fullName,
      socketId: socket.id,
    };
    const existingUser = Array.from(activeUsers).find(
      (user) => user.userId === userData.id
    );
    if (!existingUser) {
      activeUsers.add(user);
    }

    activeUsers.add(user);

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
    // Find the user object in activeUsers and remove it
    const disconnectedUserId = socket.id;
    const userToRemove = Array.from(activeUsers).find(
      (user) => user.socketId === disconnectedUserId
    );
    if (userToRemove) {
      activeUsers.delete(userToRemove);
    }

    io.emit("activeUsers", Array.from(activeUsers));
  });

  // Handle profile visit event
  socket.on("profileVisit", ({ visitedUserId, visitorName }) => {
    // Assuming you have a user socketId saved in activeUsers
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

app.get("/active-users", (req, res) => {
  res.json(Array.from(activeUsers));
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
