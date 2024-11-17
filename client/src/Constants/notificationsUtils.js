import { axios } from "./constants";

export const getNotifications = async (userId) => {
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
export const markNotificationRead = async (userId,notificationId)=>{
  try {
    const response = await axios.post("/notifications/markNotificationAsRead", {
       userId: userId ,
       notificationId: notificationId,
    });
    if (response?.data) {
      return {
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error in marking notification as read:", error);
    return {
      isSuccess: false,
    };
  }
}
export const deleteNotification = async (userId,notificationId)=>{
  try {
    const response = await axios.post("/notifications/deleteNotificationById", {
       userId: userId ,
       notificationId: notificationId,
    });
    if (response?.data) {
      return {
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      isSuccess: false,
    };
  }
}

export const markAllNotificationsAsRead = async (userId)=>{
  try {
    const response = await axios.post("/notifications/markAllNotificationsAsRead", {
       userId: userId ,
    });
    if (response?.data) {
      return {
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error marking all notifications as read :", error);
    return {
      isSuccess: false,
    };
  }
}

export const deleteAllReadNotifications = async (userId)=>{
  try {
    const response = await axios.post("/notifications/deleteAllReadNotifications", {
       userId: userId ,
    });
    if (response?.data) {
      return {
        isSuccess: true,
      };
    }
  } catch (error) {
    console.error("Error deleting all read notifications:", error);
    return {
      isSuccess: false,
    };
  }
}