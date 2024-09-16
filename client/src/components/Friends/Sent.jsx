import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../main";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Loader from "../UI/Loader";
const Sent = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardUsername, setCurrentCardUsername] = useState("");
  const options = [
    {
      title: "Cancel",
      icon: AiOutlineCloseCircle,
      action: () => {
        console.log("Cancel Request");
      },
    },
  ];
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/friends/getSentRequestsList`,
          {
            params: {
              ownerId: userId,
            },
          }
        );
        if (response.data) {
          setRequestList(response?.data?.requests || []);
          console.log("RESPONSE DATA", response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR in fetching sent requests", error);
        setLoading(false);
      }
    };
    fetchFriends();
  }, [userId]);
  return (
    <div>
      {loading && (
        <div className="w-full flex justify-center items-center min-h-40">
          <Loader />
        </div>
      )}
      {!loading &&
        requestList?.map((friend, index) => {
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

export default Sent;
