import mongoose from "mongoose";

// Users Schema
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, default: "" },
  imgUrl: { type: String, default: "" },
  banner: { type: String, default: "" },
  about: { type: String, default: "" },
  status: { type: String, default: "Available" },
  lastOnline: { type: Date, default: null },
  dateJoined: { type: Date, default: Date.now },
});
export const User = mongoose.model("users", userSchema);
