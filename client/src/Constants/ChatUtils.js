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

export const sendMessage = async (chatId, messageData) => {
  try {
    const response = await axios.post("/chat/sendMessage", {
      chatId: chatId,
      messageData: messageData,
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

export const getActiveUsers = async () => {
  try {
    const response = await axios.get("/active-users");
    return { data: response?.data, isSuccess: true };
  } catch (error) {
    console.error("Error fetching active users:", error);
    return { data: [], isSuccess: false };
  }
};
