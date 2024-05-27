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
    let isSenderOwner = true;
    if (friendship) {
      // If other user (Receiver) visit the profile of the sender
      if (
        String(friendship.sender) === String(profileUserId) &&
        friendship.status === friendshipStatuses.pending
      ) {
        isSenderOwner = false;
      }
      friendshipStatus = friendship.status;
    }
    // Send the response with the determined status
    res.status(200).json({
      message: "Friend status fetched successfully",
      friendshipStatus: friendshipStatus,
      isSenderOwner,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while fetching friend status",
      error: error.message,
    });
  }
};
export const addFriendRequest = async (req, res) => {
  // ownerId represents the currently logged-in user
  // profileUserId represents the id of the profile being visited by the owner
  const { ownerId, profileUsername } = req.body;

  try {
    const user = await User.findOne({ username: profileUsername }).lean();
    const profileUserId = user._id;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const friendship = await Friend.findOne({
      $or: [
        { sender: ownerObjectId, receiver: profileUserId },
        { sender: profileUserId, receiver: ownerObjectId },
      ],
    });
    if (friendship) {
      friendship.sender = ownerObjectId;
      friendship.receiver = profileUserId;
      friendship.status = friendshipStatuses.pending;
      friendship.requestDate = new Date();

      await friendship.save();
    } else {
      const newFriendship = new Friend({
        sender: ownerObjectId,
        receiver: profileUserId,
        status: friendshipStatuses.pending,
        requestDate: new Date(),
      });
      await newFriendship.save();
    }

    res.status(200).json({
      message: "Friend request sent successfully",
      friendshipStatus: friendshipStatuses.pending,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while sending friend request",
      error: error.message,
    });
  }
};
export const acceptRequest = async (req, res) => {
  // ownerId represents the currently logged-in user
  // profileUserId represents the id of the profile being visited by the owner
  const { ownerId, profileUsername } = req.body;

  try {
    const user = await User.findOne({ username: profileUsername }).lean();
    const profileUserId = user._id;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const friendship = await Friend.findOne({
      $or: [
        { sender: ownerObjectId, receiver: profileUserId },
        { sender: profileUserId, receiver: ownerObjectId },
      ],
    });
    if (friendship) {
      friendship.status = friendshipStatuses.accepted;
      friendship.startTime = new Date();
      await friendship.save();
    }

    res.status(200).json({
      message: "Friend request accepted",
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
export const getFriendsList = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const friends = await Friend.find({
      $or: [{ sender: ownerObjectId }, { receiver: ownerObjectId }],
      status: friendshipStatuses.accepted,
    }).populate("sender receiver");

    const friendsData = friends.map((friend) => {
      const friendUser = friend.sender._id.equals(ownerObjectId)
        ? friend.receiver
        : friend.sender;
      return {
        username: friendUser.username,
        fullName: friendUser.fullName,
        imgUrl: friendUser.imgUrl,
        about: friendUser.about,
      };
    });

    res.status(200).json({
      message: "All friends found successfully",
      friends: friendsData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in getting friends list" });
    console.log("Error in gettings friends list ", error);
  }
};
