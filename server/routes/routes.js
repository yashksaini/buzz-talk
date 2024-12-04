import express from "express";
import {
  checkAuth,
  login,
  signup,
  logout,
} from "../controllers/authController.js";
import {
  getAllUsers,
  getRecentUsers,
  getUserNameAndImage,
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
  getAllFriendsStatus,
} from "../controllers/friendsController.js";
import {
  addMessage,
  blockUserInChat,
  createNewChat,
  getChatById,
  getChatMessages,
  getChatsList,
  markMessagesAsRead,
  unBlockUserInChat,
} from "../controllers/chatsController.js";
import {
  deleteAllReadNotifications,
  deleteNotificationById,
  getNotificationsOfUser,
  getUnreadNotificationsOfUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notificationsController.js";
import {
  addComment,
  createPost,
  getAllFriendsPosts,
  getAllPublicPosts,
  getPostById,
  toggleLike,
} from "../controllers/postsController.js";

const router = express.Router();

// Authentication Routes
router.get("/auth", checkAuth);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);

// User Profile Routes
router.get("/user/:username", getUserProfile);
router.get("/userImage/:username", getUserNameAndImage);
router.get("/users/recent-users", getRecentUsers);
router.get("/users/all-users", getAllUsers);
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
router.get("/friends/getAllFriendsStatus", getAllFriendsStatus);

//Chats Routes
router.post("/chat/create-new", createNewChat);
router.get("/chat/getChatsList", getChatsList);
router.get("/chat/getChatData", getChatById);
router.post("/chat/sendMessage", addMessage);
router.get("/chat/getChatMessages", getChatMessages);
router.post("/chat/markMessagesAsRead", markMessagesAsRead);
router.post("/chat/blockUser", blockUserInChat);
router.post("/chat/unBlockUser", unBlockUserInChat);

// Notifications Routes
router.get("/notifications/getNotificationsOfUser", getNotificationsOfUser);
router.get(
  "/notifications/getUnreadNotificationsOfUser",
  getUnreadNotificationsOfUser
);
router.post("/notifications/deleteNotificationById", deleteNotificationById);
router.post("/notifications/markNotificationAsRead", markNotificationAsRead);
router.post(
  "/notifications/markAllNotificationsAsRead",
  markAllNotificationsAsRead
);
router.post(
  "/notifications/deleteAllReadNotifications",
  deleteAllReadNotifications
);

// Posts Routes
router.post("/posts/createPost", createPost);
router.get("/posts/publicPosts", getAllPublicPosts);
router.post("/posts/toggleLike", toggleLike);
router.get("/posts/getPostById", getPostById);
router.post("/posts/addComment", addComment);
router.get("/posts/friendsPosts", getAllFriendsPosts);
export default router;
