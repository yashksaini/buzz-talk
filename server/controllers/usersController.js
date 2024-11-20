import { User } from "../schemas/schemas.js";

export const getUserProfile = async (req, res) => {
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
};
export const getUserNameAndImage = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username }).lean();

    if (user) {
      const userData = {
        fullName: user.fullName,
        imgUrl: user.imgUrl,
      };

      res.json(userData);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllUsers = async(req, res) => {
  const { userId } = req.query;
  try {
    // Find all users excluding the specified userId
    const allUsers = await User.find()
      .sort({ dateJoined: -1 })
      .limit(20)
      .select("fullName username _id imgUrl ") // Specify the fields to retrieve
      .lean();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
export const getRecentUsers = async (req, res) => {
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
};

export const updateProfile = async (req, res) => {
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
};

export const searchUser = async (req, res) => {
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
};
