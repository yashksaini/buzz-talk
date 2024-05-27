import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../main";
import { useSelector } from "react-redux";
import LineProfileCard from "../UI/LineProfileCard";

const MyFriends = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [friendsList, setFriendsList] = useState([]);
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/friends/getFriendsList`, {
          params: {
            ownerId: userId,
          },
        });
        if (response.data) {
          setFriendsList(response?.data?.friends || []);
        }
      } catch (error) {
        console.log("ERROR in fetching friends", error);
      }
    };
    fetchFriends();
  }, [userId]);
  return (
    <div>
      {friendsList?.map((friend, index) => {
        return (
          <LineProfileCard
            user={{
              _id: friend._id,
              fullName: friend.fullName,
              username: friend.username,
              imgUrl: friend.imgUrl,
            }}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default MyFriends;
