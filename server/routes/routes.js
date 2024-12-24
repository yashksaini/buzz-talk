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
import {
  validateOrigin,
  ensureAuthenticated,
} from "../controllers/middleware.js";

const router = express.Router();

// Authentication Routes
router.get("/auth", validateOrigin, checkAuth);
router.post("/logout", validateOrigin, ensureAuthenticated, logout);
router.post("/signup", validateOrigin, signup);
router.post("/login", validateOrigin, login);

// User Profile Routes
router.get(
  "/user/:username",
  validateOrigin,
  ensureAuthenticated,
  getUserProfile
);
router.get(
  "/userImage/:username",
  validateOrigin,
  ensureAuthenticated,
  getUserNameAndImage
);
router.get(
  "/users/recent-users",
  validateOrigin,
  ensureAuthenticated,
  getRecentUsers
);
router.get(
  "/users/all-users",
  validateOrigin,
  ensureAuthenticated,
  getAllUsers
);
router.post(
  "/update-profile",
  validateOrigin,
  ensureAuthenticated,
  updateProfile
);
router.get("/search/:query", validateOrigin, ensureAuthenticated, searchUser);

//Friends Routes
router.get(
  "/friends/friendship-status",
  validateOrigin,
  ensureAuthenticated,
  getFriendshipStatus
);
router.post(
  "/friends/add-friend-request",
  validateOrigin,
  ensureAuthenticated,
  addFriendRequest
);
router.post(
  "/friends/accept-request",
  validateOrigin,
  ensureAuthenticated,
  acceptRequest
);
router.post(
  "/friends/withdraw-request",
  validateOrigin,
  ensureAuthenticated,
  withdrawFriendRequest
);
router.post(
  "/friends/remove-friend",
  validateOrigin,
  ensureAuthenticated,
  removeFriend
);
router.post(
  "/friends/reject-request",
  validateOrigin,
  ensureAuthenticated,
  rejectRequest
);
router.get(
  "/friends/getFriendsList",
  validateOrigin,
  ensureAuthenticated,
  getFriendsList
);
router.get(
  "/friends/getRequestsList",
  validateOrigin,
  ensureAuthenticated,
  getRequestsList
);
router.get(
  "/friends/getSentRequestsList",
  validateOrigin,
  ensureAuthenticated,
  getSentRequestsList
);
router.get(
  "/friends/getAllFriendsStatus",
  validateOrigin,
  ensureAuthenticated,
  getAllFriendsStatus
);

//Chats Routes
router.post(
  "/chat/create-new",
  validateOrigin,
  ensureAuthenticated,
  createNewChat
);
router.get(
  "/chat/getChatsList",
  validateOrigin,
  ensureAuthenticated,
  getChatsList
);
router.get(
  "/chat/getChatData",
  validateOrigin,
  ensureAuthenticated,
  getChatById
);
router.post(
  "/chat/sendMessage",
  validateOrigin,
  ensureAuthenticated,
  addMessage
);
router.get(
  "/chat/getChatMessages",
  validateOrigin,
  ensureAuthenticated,
  getChatMessages
);
router.post(
  "/chat/markMessagesAsRead",
  validateOrigin,
  ensureAuthenticated,
  markMessagesAsRead
);
router.post(
  "/chat/blockUser",
  validateOrigin,
  ensureAuthenticated,
  blockUserInChat
);
router.post(
  "/chat/unBlockUser",
  validateOrigin,
  ensureAuthenticated,
  unBlockUserInChat
);

// Notifications Routes
router.get(
  "/notifications/getNotificationsOfUser",
  validateOrigin,
  ensureAuthenticated,
  getNotificationsOfUser
);
router.get(
  "/notifications/getUnreadNotificationsOfUser",
  validateOrigin,
  ensureAuthenticated,
  getUnreadNotificationsOfUser
);
router.post(
  "/notifications/deleteNotificationById",
  validateOrigin,
  ensureAuthenticated,
  deleteNotificationById
);
router.post(
  "/notifications/markNotificationAsRead",
  validateOrigin,
  ensureAuthenticated,
  markNotificationAsRead
);
router.post(
  "/notifications/markAllNotificationsAsRead",
  validateOrigin,
  ensureAuthenticated,
  markAllNotificationsAsRead
);
router.post(
  "/notifications/deleteAllReadNotifications",
  validateOrigin,
  ensureAuthenticated,
  deleteAllReadNotifications
);

// Posts Routes
router.post(
  "/posts/createPost",
  validateOrigin,
  ensureAuthenticated,
  createPost
);
router.get(
  "/posts/publicPosts",
  validateOrigin,
  ensureAuthenticated,
  getAllPublicPosts
);
router.post(
  "/posts/toggleLike",
  validateOrigin,
  ensureAuthenticated,
  toggleLike
);
router.get(
  "/posts/getPostById",
  validateOrigin,
  ensureAuthenticated,
  getPostById
);
router.post(
  "/posts/addComment",
  validateOrigin,
  ensureAuthenticated,
  addComment
);
router.get(
  "/posts/friendsPosts",
  validateOrigin,
  ensureAuthenticated,
  getAllFriendsPosts
);
router.post(
  "/posts/deletePost",
  validateOrigin,
  ensureAuthenticated,
  deletePost
);
router.get(
  "/posts/getAllPostsOfUser",
  validateOrigin,
  ensureAuthenticated,
  getAllPostsOfUser
);
export default router;
