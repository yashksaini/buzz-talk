import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Loader from "../UI/Loader";
import { LuUserPlus2 } from "react-icons/lu";
import NoDataFound from "../UI/NoDataFound";
import { BASE_URL } from "../../Constants/constants";
const Requests = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardUsername, setCurrentCardUsername] = useState("");
  const options = [
    {
      title: "Accept Request",
      icon: LuUserPlus2,
      action: () => {
        console.log("Accept Request");
      },
    },
    {
      title: "Decline Request",
      icon: AiOutlineCloseCircle,
      action: () => {
        console.log("Decline Request");
      },
    },
  ];

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
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR in fetching friends", error);
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
      {!loading && requestList.length === 0 && (
        <NoDataFound
          title="No Friend Requests"
          desc="You currently have no pending friend requests. Any new requests will appear here."
        />
      )}
    </div>
  );
};

export default Requests;
