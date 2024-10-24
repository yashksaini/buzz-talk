import mongoose from "mongoose";
import { Chat } from "../schemas/schemas.js";

export const createNewChat = async (req, res) => {
  try {
    // Extract ownerId (current user) and profileUserId (chat creation with user) from the request body
    const { ownerId, profileUserId } = req.body;

    // Check if the chat between these users already exists for individual chat
    let existingChat = await Chat.findOne({
      type: "individual",
      $and: [{ "users.userId": ownerId }, { "users.userId": profileUserId }],
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists",
        chat: existingChat,
      });
    }

    // Create a new individual chat
    const chatId = new mongoose.Types.ObjectId(); // Unique chat ID

    const newChat = new Chat({
      chatId,
      type: "individual",
      users: [
        { userId: ownerId, permission: "admin" }, // Both users are admins in individual chat
        { userId: profileUserId, permission: "admin" },
      ],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newChat.save();

    // Send the new chat back in response
    return res.status(201).json({
      message: "New individual chat created",
      chat: newChat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, unable to create chat",
    });
  }
};
