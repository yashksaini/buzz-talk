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
  lastOnline: { type: Date, default: null },
  dateJoined: { type: Date, default: Date.now },
});
export const User = mongoose.model("users", userSchema);

// Friends Schema
const friendSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "canceled", "blocked"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Friend = mongoose.model("Friend", friendSchema);
