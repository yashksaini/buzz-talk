import { Notifications } from "../schemas/schemas.js";

export const addNotification = async (notificationData) => {
  const { title, desc, url, type, userId, senderName } = notificationData;
  const LIMIT = 100;
  if (!title || !desc) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }

  try {
    // Find or create notifications document for the user
    let userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      userNotifications = new Notifications({ userId, notifications: [] });
    }

    // Add the new notification
    userNotifications.notifications.push({
      title,
      desc,
      url,
      type,
      senderName,
      time: new Date(),
    });
    if (userNotifications.notifications.length > LIMIT) {
      userNotifications.notifications.splice(0, 1);
    }

    await userNotifications.save();
  } catch (error) {
    console.error(error);
  }
};

export const getUnreadNotificationsOfUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res.status(200).json({ unReadCount: 0 });
    }

    const unreadNotifications = userNotifications.notifications.filter(
      (notification) => !notification.isRead
    );

    res.status(200).json({
      unReadCount: unreadNotifications.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};

export const getNotificationsOfUser = async (req, res) => {
  const { userId } = req.query;

  try {
    // Find notifications for the user and sort by time in descending order
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res.status(200).json({ notifications: [] });
    }
    // Sort the notifications array by 'time' field in descending order
    const sortedNotifications = userNotifications.notifications.sort(
      (a, b) => b.time - a.time
    );

    res.status(200).json({ notifications: sortedNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};
export const deleteNotificationById = async (req, res) => {
  const { userId, notificationId } = req.body;

  try {
    // Find the user's notifications
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res.status(404).json({ error: "User not found." });
    }

    // Filter out the notification by its ID
    const updatedNotifications = userNotifications.notifications.filter(
      (notification) => notification._id.toString() !== notificationId
    );

    // If no notifications were deleted, return an error
    if (
      updatedNotifications.length === userNotifications.notifications.length
    ) {
      return res.status(404).json({ error: "Notification not found." });
    }

    // Update the notifications array and save the document
    userNotifications.notifications = updatedNotifications;
    await userNotifications.save();

    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete notification." });
  }
};
export const markNotificationAsRead = async (req, res) => {
  const { userId, notificationId } = req.body; // Assuming the ID is sent in the request body

  try {
    // Find the user's notifications
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the notification by its ID
    const notification = userNotifications.notifications.find(
      (notification) => notification._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    // Mark the notification as read
    notification.isRead = true;

    // Save the updated user notifications
    await userNotifications.save();

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const { userId } = req.body;

  try {
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res.status(404).json({ error: "User not found." });
    }
    // Iterate through all notifications and mark them as read
    userNotifications.notifications.forEach((notification) => {
      notification.isRead = true;
    });

    // Save the updated user notifications
    await userNotifications.save();

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to mark all notifications as read." });
  }
};

export const deleteAllReadNotifications = async (req, res) => {
  const { userId } = req.body;

  try {
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res.status(404).json({ error: "User not found." });
    }
    // Remove read notifications (isRead === true)
    userNotifications.notifications = userNotifications.notifications.filter(
      (notification) => notification.isRead === false
    );

    // Save the updated user notifications
    await userNotifications.save();

    res.status(200).json({ message: "All read notifications removed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete read notifications" });
  }
};
