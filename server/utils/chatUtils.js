import { Chat } from "../schemas/schemas";

export const addNewMessage = async (chatId, newMessage) => {
  try {
    // Find the chat by its chatId
    const chat = await Chat.findOne({ chatId });

    // Check if the chat exists
    if (!chat) {
      console.error(`Chat with chatId ${chatId} not found.`);
      return;
    }

    // Add the new message to the messages array and update lastMessage
    chat.messages.push(newMessage);
    chat.lastMessage = newMessage.message;
    chat.updatedAt = new Date();

    // Save the updated chat document
    await chat.save();
    console.log(`Message added to chat ${chatId}`);
  } catch (error) {
    console.error("Error adding message:", error);
  }
};
