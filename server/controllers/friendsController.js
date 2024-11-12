import mongoose from "mongoose";
import { friendshipStatuses } from "../constants/friendsConstants.js";
import { Friend, User } from "../schemas/schemas.js";
import { addNotification } from "./notificationsController.js";

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
    const owner = await User.findOne({ _id: ownerObjectId }).lean();

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

      await addNotification({
        userId: profileUserId,
        title: `${owner.fullName} wants to be your friend`,
        desc: "Check your user profile to accept the request",
        url: `/profile/${owner.username}`,
      });

      await friendship.save();
    } else {
      const newFriendship = new Friend({
        sender: ownerObjectId,
        receiver: profileUserId,
        status: friendshipStatuses.pending,
        requestDate: new Date(),
      });
      await addNotification({
        userId: profileUserId,
        title: `${owner.fullName} wants to be your friend`,
        desc: "Check your user profile to accept the request",
        url: `/profile/${owner.username}`,
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
export const withdrawFriendRequest = async (req, res) => {
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
      friendship.status = friendshipStatuses.canceled;
      friendship.requestDate = new Date();

      await friendship.save();
    }

    res.status(200).json({
      message: "Friend request withdrawn successfully",
      friendshipStatus: friendshipStatuses.canceled,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while withdrawing friend request",
      error: error.message,
    });
  }
};
export const removeFriend = async (req, res) => {
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
      friendship.status = friendshipStatuses.canceled;
      friendship.requestDate = new Date();

      await friendship.save();
    }

    res.status(200).json({
      message: "Friend removed successfully",
      friendshipStatus: friendshipStatuses.canceled,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while removing friend",
      error: error.message,
    });
  }
};
export const rejectRequest = async (req, res) => {
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
      friendship.status = friendshipStatuses.rejected;
      friendship.requestDate = new Date();

      await friendship.save();
    }

    res.status(200).json({
      message: "Friend request rejected successfully",
      friendshipStatus: friendshipStatuses.rejected,
    });
  } catch (error) {
    // Handle any errors that occurred during the database query
    res.status(500).json({
      message: "An error occurred while rejecting friend request",
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
        _id: friendUser._id,
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
export const getRequestsList = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const friendRequests = await Friend.find({
      receiver: ownerObjectId,
      status: friendshipStatuses.pending,
    }).populate("sender");

    const friendRequestsData = friendRequests.map((friend) => {
      const requestUserData = friend.sender;
      return {
        _id: friend._id,
        username: requestUserData.username,
        fullName: requestUserData.fullName,
        imgUrl: requestUserData.imgUrl,
        about: requestUserData.about,
      };
    });

    res.status(200).json({
      message: "All friends requests found successfully",
      requests: friendRequestsData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in getting friends request list" });
    console.log("Error in gettings friends request list ", error);
  }
};
export const getSentRequestsList = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const friendRequests = await Friend.find({
      sender: ownerObjectId,
      status: friendshipStatuses.pending,
    }).populate("receiver");

    const friendRequestsData = friendRequests.map((friend) => {
      const requestUserData = friend.receiver;
      return {
        _id: friend._id,
        username: requestUserData.username,
        fullName: requestUserData.fullName,
        imgUrl: requestUserData.imgUrl,
        about: requestUserData.about,
      };
    });

    res.status(200).json({
      message: "All friends requests sent found successfully",
      requests: friendRequestsData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in getting friends request sent list" });
    console.log("Error in gettings friends request sent list ", error);
  }
};
