import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../main";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";
import { LuUserX2 } from "react-icons/lu";
import { LiaTelegramPlane } from "react-icons/lia";

const MyFriends = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [friendsList, setFriendsList] = useState([]);
  const [currentCardUsername, setCurrentCardUsername] = useState("");
  const options = [
    {
      title: "Message this friend",
      icon: LiaTelegramPlane,
      action: () => {
        console.log("GO TO MESSAGE");
      },
    },
    {
      title: "Remove this friend",
      icon: LuUserX2,
      action: () => {
        console.log("REMOVE FRIEND");
      },
    },
  ];
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
          <FriendProfileCard
            user={{
              _id: friend._id,
              fullName: friend.fullName,
              username: friend.username,
              imgUrl: friend.imgUrl,
              about: friend.about,
            }}
            setCurrentCardUsername={setCurrentCardUsername}
            currentCardUsername={currentCardUsername}
            options={options}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default MyFriends;
