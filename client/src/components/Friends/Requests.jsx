import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";
// import { AiOutlineCloseCircle } from "react-icons/ai";
import Loader from "../UI/Loader";
import { LuUserPlus2 } from "react-icons/lu";
import NoDataFound from "../UI/NoDataFound";
import { BASE_URL } from "../../Constants/constants";
import { acceptFriendship } from "../commonFunctions";
import { toast } from "react-toastify";
// eslint-disable-next-line react/prop-types
const Requests = ({ setIsUpdated }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardUsername, setCurrentCardUsername] = useState("");
  const acceptReq = async () => {
    const { toastMsg, toastType } = await acceptFriendship(
      userId,
      currentCardUsername
    );
    if (toastType === "success") {
      toast.success(toastMsg);
      fetchFriends();
      setIsUpdated((prev) => !prev);
    } else if (toastType === "error") {
      toast.error(toastMsg);
    }
  };
  const options = [
    {
      title: "Accept Request",
      icon: LuUserPlus2,
      action: () => {
        acceptReq();
      },
    },
  ];
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/getRequestsList`, {
        params: {
          ownerId: userId,
        },
      });
      if (response.data) {
        setRequestList(response?.data?.requests || []);
        setLoading(false);
      }
    } catch (error) {
      console.error("ERROR in fetching friends", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
