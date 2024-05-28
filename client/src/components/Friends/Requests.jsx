import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../main";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";

const Requests = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [requestList, setRequestList] = useState([]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/friends/getRequestsList`,
          {
            params: {
              ownerId: userId,
            },
          }
        );
        if (response.data) {
          setRequestList(response?.data?.requests || []);
          console.log("RESPONSE DATA", response.data);
        }
      } catch (error) {
        console.log("ERROR in fetching friends", error);
      }
    };
    fetchFriends();
  }, [userId]);
  return (
    <div>
      {requestList?.map((friend, index) => {
        return (
          <FriendProfileCard
            user={{
              _id: friend._id,
              fullName: friend.fullName,
              username: friend.username,
              imgUrl: friend.imgUrl,
              about: friend.about,
            }}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default Requests;
