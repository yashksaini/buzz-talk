import { Notifications } from "../schemas/schemas.js";

export const addNotification = async (notificationData) => {
  const { title, desc, url, userId } = notificationData;

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
      time: new Date(),
    });

    await userNotifications.save();
    console.log("Notifications saved");
  } catch (error) {
    console.error(error);
  }
};

export const getNotificationsOfUser = async (req, res) => {
  const { userId } = req.query;

  try {
    // Find notifications for the user
    const userNotifications = await Notifications.findOne({ userId });

    if (!userNotifications) {
      return res
        .status(404)
        .json({ error: "No notifications found for this user." });
    }

    res.status(200).json(userNotifications.notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};
