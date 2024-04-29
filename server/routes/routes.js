import express from "express";
import { User } from "../schemas/schemas.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/auth", function (req, res) {
  req.session.userData ? res.send(req.session.userData) : res.send(false);
});
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.clearCookie();
      res.json({ message: "Logout successful" });
    }
  });
});
router.post("/signup", async (req, res) => {
  const { fullName, username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username }).lean();
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // If the username is unique, proceed with user creation
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username }).lean();

    if (user) {
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Setting session data upon successful login
        const data = {
          isAuth: true,
          fullName: user.fullName,
          id: user._id,
          username: user.username,
          imgUrl: user.imgUrl,
        };
        req.session.userData = data;
        req.session.save();
        res.send(true);
      } else {
        // Password does not match
        res.send(false);
      }
    } else {
      // User not found
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// After Login Routes

router.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username }).lean();

    if (user) {
      const userData = {
        fullName: user.fullName,
        username: user.username,
        userId: user._id.toString(),
        status: user.status,
        about: user.about,
        imgUrl: user.imgUrl,
        banner: user.banner,
        dateJoined: user.dateJoined,
        DOB: user.DOB,
        lastOnline: user.lastOnline,
      };

      res.json(userData);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/users/recent-users", async (req, res) => {
  const { userId } = req.query;
  try {
    // Find recent users excluding the specified userId
    const recentUsers = await User.find({ _id: { $ne: userId } })
      .sort({ dateJoined: -1 })
      .limit(5)
      .select("fullName username _id imgUrl ") // Specify the fields to retrieve
      .lean();
    res.status(200).json(recentUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/update-profile", async (req, res) => {
  try {
    const { fullName, about, status, profile, banner, userId } = req.body;
    await User.findByIdAndUpdate(
      userId,
      { fullName, about, status, imgUrl: profile, banner },
      { new: true, upsert: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const { page, resultsPerPage } = req.query;
  const skip = (parseInt(page) - 1) * resultsPerPage;

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Case-insensitive search for username
        { fullName: { $regex: query, $options: "i" } }, // Case-insensitive search for fullname
      ],
    })
      .select("_id username fullName imgUrl")
      .skip(skip)
      .limit(parseInt(resultsPerPage)); // Adjust the fields you want to return

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
