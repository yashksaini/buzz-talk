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
} from "../controllers/friendsController.js";

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

export default router;
