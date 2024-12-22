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
  deletePost,
  getAllFriendsPosts,
  getAllPostsOfUser,
  getAllPublicPosts,
  getPostById,
  toggleLike,
} from "../controllers/postsController.js";
import validateOrigin from "../controllers/middleware.js";

const router = express.Router();

// Authentication Routes
router.get("/auth", validateOrigin, checkAuth);
router.post("/logout", validateOrigin, logout);
router.post("/signup", validateOrigin, signup);
router.post("/login", validateOrigin, login);

// User Profile Routes
router.get("/user/:username", validateOrigin, getUserProfile);
router.get("/userImage/:username", validateOrigin, getUserNameAndImage);
router.get("/users/recent-users", validateOrigin, getRecentUsers);
router.get("/users/all-users", validateOrigin, getAllUsers);
router.post("/update-profile", validateOrigin, updateProfile);
router.get("/search/:query", validateOrigin, searchUser);

//Friends Routes
router.get("/friends/friendship-status", validateOrigin, getFriendshipStatus);
router.post("/friends/add-friend-request", validateOrigin, addFriendRequest);
router.post("/friends/accept-request", validateOrigin, acceptRequest);
router.post("/friends/withdraw-request", validateOrigin, withdrawFriendRequest);
router.post("/friends/remove-friend", validateOrigin, removeFriend);
router.post("/friends/reject-request", validateOrigin, rejectRequest);
router.get("/friends/getFriendsList", validateOrigin, getFriendsList);
router.get("/friends/getRequestsList", validateOrigin, getRequestsList);
router.get("/friends/getSentRequestsList", validateOrigin, getSentRequestsList);
router.get("/friends/getAllFriendsStatus", validateOrigin, getAllFriendsStatus);

//Chats Routes
router.post("/chat/create-new", validateOrigin, createNewChat);
router.get("/chat/getChatsList", validateOrigin, getChatsList);
router.get("/chat/getChatData", validateOrigin, getChatById);
router.post("/chat/sendMessage", validateOrigin, addMessage);
router.get("/chat/getChatMessages", validateOrigin, getChatMessages);
router.post("/chat/markMessagesAsRead", validateOrigin, markMessagesAsRead);
router.post("/chat/blockUser", validateOrigin, blockUserInChat);
router.post("/chat/unBlockUser", validateOrigin, unBlockUserInChat);

// Notifications Routes
router.get(
  "/notifications/getNotificationsOfUser",
  validateOrigin,
  getNotificationsOfUser
);
router.get(
  "/notifications/getUnreadNotificationsOfUser",
  validateOrigin,
  getUnreadNotificationsOfUser
);
router.post(
  "/notifications/deleteNotificationById",
  validateOrigin,
  deleteNotificationById
);
router.post(
  "/notifications/markNotificationAsRead",
  validateOrigin,
  markNotificationAsRead
);
router.post(
  "/notifications/markAllNotificationsAsRead",
  validateOrigin,
  markAllNotificationsAsRead
);
router.post(
  "/notifications/deleteAllReadNotifications",
  validateOrigin,
  deleteAllReadNotifications
);

// Posts Routes
router.post("/posts/createPost", validateOrigin, createPost);
router.get("/posts/publicPosts", validateOrigin, getAllPublicPosts);
router.post("/posts/toggleLike", validateOrigin, toggleLike);
router.get("/posts/getPostById", validateOrigin, getPostById);
router.post("/posts/addComment", validateOrigin, addComment);
router.get("/posts/friendsPosts", validateOrigin, getAllFriendsPosts);
router.post("/posts/deletePost", validateOrigin, deletePost);
router.get("/posts/getAllPostsOfUser", validateOrigin, getAllPostsOfUser);
export default router;
