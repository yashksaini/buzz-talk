import { Notifications } from "../schemas/schemas.js";

export const addNotification = async (notificationData) => {
  const { title, desc, url, type, userId } = notificationData;

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
    // Find notifications for the user and sort by time in descending order
    const userNotifications = await Notifications.findOne(
      { userId } // assuming notifications are in embedded array
    ).sort({ "notifications.time": -1 });

    if (!userNotifications) {
      return res.status(200).json({ notifications: [] });
    }

    res.status(200).json({ notifications: userNotifications.notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};
