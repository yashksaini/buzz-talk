import mongoose from "mongoose";

// Users Schema
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, default: "" },
  imgUrl: { type: String, default: "" },
  banner: { type: String, default: "" },
  about: { type: String, default: "" },
  status: { type: String, default: "Available for a chat" },
  lastOnline: { type: Date, default: null }, // Change this to online when user logged into the account
  dateJoined: { type: Date, default: Date.now },
});
export const User = mongoose.model("users", userSchema);

// Friends Schema
const friendSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  // It contain who blocked the other
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: false,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "canceled", "blocked"],
    default: "pending",
  },
  requestDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Friend = mongoose.model("friends", friendSchema);

const readBySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  readAt: {
    type: Date,
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  readBy: [readBySchema],
});

const chatUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  permission: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
  },
});

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastMessage: {
    type: String,
    required: false,
  },
  groupName: {
    type: String,
  },
  groupDesc: {
    type: String,
  },
  type: {
    type: String,
    enum: ["individual", "group"],
    required: true,
  },
  users: [chatUserSchema],
  messages: [messageSchema],
});

export const Chat = mongoose.model("chats", chatSchema);
