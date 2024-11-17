import express from "express";
import {
  checkAuth,
  login,
  signup,
  logout,
} from "../controllers/authController.js";
import {
  getRecentUsers,
  getUserProfile,
  searchUser,
  updateProfile,
} from "../controllers/usersController.js";
import {
  addFriendRequest,
  getFriendshipStatus,
  acceptRequest,
  getFriendsList,
  getRequestsList,
  getSentRequestsList,
  withdrawFriendRequest,
  removeFriend,
  rejectRequest,
} from "../controllers/friendsController.js";
import {
  addMessage,
  createNewChat,
  getChatById,
  getChatMessages,
  getChatsList,
  markMessagesAsRead,
} from "../controllers/chatsController.js";
import { deleteAllReadNotifications, deleteNotificationById, getNotificationsOfUser, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notificationsController.js";

const router = express.Router();

// Authentication Routes
router.get("/auth", checkAuth);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);

// User Profile Routes
router.get("/user/:username", getUserProfile);
router.get("/users/recent-users", getRecentUsers);
router.post("/update-profile", updateProfile);
router.get("/search/:query", searchUser);

//Friends Routes
router.get("/friends/friendship-status", getFriendshipStatus);
router.post("/friends/add-friend-request", addFriendRequest);
router.post("/friends/accept-request", acceptRequest);
router.post("/friends/withdraw-request", withdrawFriendRequest);
router.post("/friends/remove-friend", removeFriend);
router.post("/friends/reject-request", rejectRequest);
router.get("/friends/getFriendsList", getFriendsList);
router.get("/friends/getRequestsList", getRequestsList);
router.get("/friends/getSentRequestsList", getSentRequestsList);

//Chats Routes
router.post("/chat/create-new", createNewChat);
router.get("/chat/getChatsList", getChatsList);
router.get("/chat/getChatData", getChatById);
router.post("/chat/sendMessage", addMessage);
router.get("/chat/getChatMessages", getChatMessages);
router.post("/chat/markMessagesAsRead", markMessagesAsRead);

// Notifications Routes
router.get("/notifications/getNotificationsOfUser", getNotificationsOfUser);
router.post("/notifications/deleteNotificationById",deleteNotificationById);
router.post("/notifications/markNotificationAsRead",markNotificationAsRead);
router.post("/notifications/markAllNotificationsAsRead",markAllNotificationsAsRead);
router.post("/notifications/deleteAllReadNotifications",deleteAllReadNotifications);
export default router;
