import bcrypt from "bcrypt";
import { User } from "../schemas/schemas.js";

// To logout user (Clear Cookies and destroy session)
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.clearCookie();
      res.json({ message: "Logout successful" });
    }
  });
};

// Check user is authenticated when user first visit app
export const checkAuth = (req, res) => {
  req.session.userData ? res.send(req.session.userData) : res.send(false);
};

// For creating a new user
export const signup = async (req, res) => {
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
};

// To save data in session and logged in new user
export const login = async (req, res) => {
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
          // imgUrl: user.imgUrl,
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
};
