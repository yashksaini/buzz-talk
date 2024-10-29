import axios from "axios";
import { BASE_URL } from "../Constants/constants";
// Send Request to friend
export const sendRequest = async (ownerId, profileUsername) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/friends/add-friend-request`,
      {
        ownerId: ownerId,
        profileUsername: profileUsername,
      }
    );
    if (response.data) {
      const { friendshipStatus } = response.data;
      return {
        status: friendshipStatus,
        toastMsg: "Friend request sent successfully",
        toastType: "success",
      };
    }
  } catch (error) {
    console.error("Error sending friend request", error);
    return {
      status: "NA",
      toastMsg: "Error sending friend request",
      toastType: "error",
    };
  }
};
// Accept Friend Request
export const acceptFriendship = async (ownerId, profileUsername) => {
  try {
    const response = await axios.post(`${BASE_URL}/friends/accept-request`, {
      ownerId: ownerId,
      profileUsername: profileUsername,
    });
    if (response.data) {
      const { friendshipStatus } = response.data;
      return {
        status: friendshipStatus,
        toastMsg: "Friend request accepted",
        toastType: "success",
      };
    }
  } catch (error) {
    console.error("Error accepting friend request", error);
    return {
      status: "NA",
      toastMsg: "Error accepting friend request",
      toastType: "error",
    };
  }
};

// Withdraw Friend Request
export const withdrawFriendReq = async (ownerId, profileUsername) => {
  try {
    const response = await axios.post(`${BASE_URL}/friends/withdraw-request`, {
      ownerId: ownerId,
      profileUsername: profileUsername,
    });
    if (response.data) {
      const { friendshipStatus } = response.data;
      return {
        status: friendshipStatus,
        toastMsg: "Friend request withdrawn",
        toastType: "success",
      };
    }
  } catch (error) {
    console.error("Error withdrawing friend request", error);
    return {
      status: "NA",
      toastMsg: "Error withdrawing friend request",
      toastType: "error",
    };
  }
};
