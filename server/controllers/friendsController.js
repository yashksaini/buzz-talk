import mongoose from "mongoose";
import { friendshipStatuses } from "../constants/friendsConstants.js";
import { Friend, User } from "../schemas/schemas.js";

export const getFriendshipStatus = async (req, res) => {
  const { ownerId, profileUsername } = req.query;

  try {
    // Find the friendship document between the two users
    const user = await User.findOne({ username: profileUsername }).lean();
    const profileUserId = user._id;

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const friendship = await Friend.findOne({
      $or: [
        { sender: ownerObjectId, receiver: profileUserId },
        { sender: profileUserId, receiver: ownerObjectId },
      ],
    });

    // Determine the status of the friendship
    let friendshipStatus = "default";
    if (friendship) {
      friendshipStatus = friendship.status;
    }
    // Send the response with the determined status
    res.status(200).json({
      message: "Friend status fetched successfully",
      friendshipStatus: friendshipStatus,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while fetching friend status",
      error: error.message,
    });
  }
};
export const addFriend = async (req, res) => {
  // ownerId represents the currently logged-in user
  // profileUserId represents the id of the profile being visited by the owner
  const { ownerId, profileUsername } = req.body;

  try {
    const user = await User.findOne({ username: profileUsername }).lean();
    const profileUserId = user._id;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const friendship = new Friend(
      {
        _id: new mongoose.Types.ObjectId(),
        sender: ownerObjectId,
        receiver: profileUserId,
        status: friendshipStatuses.pending, // Default status for a new friend request
        requestDate: new Date(), // Current date and time
        startTime: null,
        timestamp: new Date(),
      },
      {
        upsert: true, // Create a new document if no matching document is found
        new: true, // Return the updated document if it was modified
      }
    );
    await friendship.save();
    res.status(200).json({
      message: "Friend status fetched successfully",
      friendshipStatus: friendship.status,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while fetching friend status",
      error: error.message,
    });
  }
};
