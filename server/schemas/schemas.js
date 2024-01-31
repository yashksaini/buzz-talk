import mongoose from "mongoose";

// Users Schema
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  fullName: String,
});
export const User = mongoose.model("users", userSchema);
