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

export const getChatsList = async (req, res) => {
  try {
    const { ownerId } = req.query;

    // Find all chats where the owner is a participant
    const chats = await Chat.find({ "users.userId": ownerId })
      .populate({
        path: "users.userId",
        select: "username imgUrl fullName",
      })
      .sort({ updatedAt: -1 })
      .exec();

    // Format the chats response
    const formattedChats = chats
      .map((chat) => {
        // Find the other user in the chat
        const otherUser = chat.users.find(
          (user) => user.userId._id.toString() !== ownerId
        );

        // Ensure the other user exists before extracting details
        if (otherUser) {
          return {
            chatId: chat.chatId,
            lastMessage: chat.lastMessage,
            updatedAt: chat.updatedAt,
            friendProfile: {
              userId: otherUser.userId._id,
              username: otherUser.userId.username,
              imgUrl: otherUser.userId.imgUrl,
              fullName: otherUser.userId.fullName,
            },
          };
        }
      })
      .filter((chat) => chat !== undefined); // Remove any undefined entries if the other user is not found

    res.status(200).json({ chats: formattedChats });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve chats", error });
  }
};
export const getChatById = async (req, res) => {
  try {
    const { chatId, ownerId } = req.query; // Get chatId and ownerId from query parameters

    // Find the chat by its chatId and populate user data
    const chat = await Chat.findOne({ chatId })
      .populate({
        path: "users.userId",
        select: "username imgUrl fullName",
      })
      .exec();

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const otherUser = chat.users.find(
      (user) => user.userId._id.toString() !== ownerId
    );
    // If the user is not a member of the of the chat
    const isUserOfChat = chat.users.some(
      (user) => user.userId._id.toString() === ownerId
    );
    if (!isUserOfChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    // Format the response
    const formattedChat = {
      totalMessages: chat.messages.length,
      friendsProfile: {
        userId: otherUser.userId._id,
        username: otherUser.userId.username,
        imgUrl: otherUser.userId.imgUrl,
        fullName: otherUser.userId.fullName,
      },
    };

    res.status(200).json({ ...formattedChat });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve chat", error });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId, page = 1 } = req.query;
    const messagesPerPage = 20;
    const skip = (page - 1) * messagesPerPage;

    const chat = await Chat.aggregate([
      { $match: { chatId } },
      { $unwind: "$messages" }, // Unwind messages array
      { $sort: { "messages.sentAt": -1 } }, // Sort by sentAt in descending order
      { $skip: skip }, // Skip messages based on page number
      { $limit: messagesPerPage }, // Limit to messagesPerPage
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Group back to single document
    ]);

    if (!chat || chat.length === 0) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ messages: chat[0].messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve chat", error });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { messageData, chatId } = req.body; // Use body to pass message data
    // Find the chat by its chatId
    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Add the new message to the messages array and update lastMessage
    chat.messages.push(messageData);
    chat.lastMessage = messageData.message;
    chat.updatedAt = new Date();

    // Save the updated chat document
    await chat.save();

    res
      .status(200)
      .json({ message: "Message added successfully", messageData });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message", error });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { ownerId, chatId } = req.body;
    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const newReadMessages = [];
    chat.messages.forEach((message) => {
      const alreadyRead = message.readBy.some(
        (readInfo) => readInfo.userId.toString() === ownerId.toString()
      );
      if (!alreadyRead) {
        message.readBy.push({
          userId: ownerId,
          readAt: new Date(),
        });
        newReadMessages.push(message);
      }
    });

    // Save the updated chat document
    await chat.save();

    res.status(200).json({
      message: "Message marked as read",
      newReadMessages: newReadMessages,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Error marking messages as read:", error });
  }
};
