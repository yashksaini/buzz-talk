import { axios } from "./constants";

export const getNotifications = async (userId) => {
  console.log({ userId });
  try {
    const response = await axios.get("/notifications/getNotificationsOfUser", {
      params: { userId: userId },
    });
    if (response?.data) {
      console.log("NOTIFICATIONS", response.data);
      return {
        data: response?.data?.notifications || [],
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error fetching notification data:", error);
    return {
      data: [],
      isSuccess: false,
    };
  }
};
