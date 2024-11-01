import { axios } from "./constants";

export const getChatMessages = async (chatId, page) => {
  try {
    const response = await axios.get(`chat/getChatMessages`, {
      params: { chatId: chatId, page: page },
    });
    if (response?.data) {
      return { messages: response?.data?.messages || [], isSuccess: true };
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return { messages: [], isSuccess: false };
  }
};

export const sendMessage = async (chatId, userId, messageText) => {
  try {
    const response = await axios.post("/chat/sendMessage", {
      chatId: chatId,
      ownerId: userId,
      messageText,
    });
    if (response.status === 200) {
      return { isSuccess: true };
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return { isSuccess: false };
  }
};

export const getChatData = async (chatId, userId) => {
  try {
    const response = await axios.get("/chat/getChatData", {
      params: { chatId: chatId, ownerId: userId },
    });
    if (response?.data) {
      return {
        data: response?.data || {},
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return {
      data: {},
      isSuccess: false,
    };
  }
};
