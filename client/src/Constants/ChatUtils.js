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

export const sendMessage = async (chatId, newMessage,userId) => {
  try {
    const response = await axios.post("/chat/sendMessage", {
      ownerId: userId,
      chatId: chatId,
      messageData: newMessage,
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
export const markMessagesAsRead = async ({chatId, ownerId} ) => {
  try {
    const response = await axios.post("/chat/markMessagesAsRead", {
      chatId: chatId,
      ownerId: ownerId,
    });
    if (response.status === 200) {
      return {
        isSuccess: true,
        newReadMessages: response?.data?.newReadMessages,
      };
    }
  } catch (error) {
    console.error("Error marking as read", error);
    return { isSuccess: false };
  }
};
export const unblockUserInChat = async (chatId, userId ) => {
  try {
    const response = await axios.post("/chat/unBlockUser", {
      chatId: chatId,
      userId: userId,
    });
    if (response.status === 200) {
      return {
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error in unblocking user", error);
    return { isSuccess: false };
  }
};

export const blockUserInChat = async(chatId,userId)=>{
  try {
    const response = await axios.post("/chat/blockUser", {
      chatId: chatId,
      userId: userId,
    });
    if (response.status === 200) {
      return {
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error in blocking user", error);
    return { isSuccess: false };
  }
}