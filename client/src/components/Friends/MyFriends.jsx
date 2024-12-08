import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";
import { LuUserX2 } from "react-icons/lu";
import { LiaTelegramPlane } from "react-icons/lia";
import Loader from "../UI/Loader";
import NoDataFound from "../UI/NoDataFound";
import { BASE_URL } from "../../Constants/constants";
import { useNavigate } from "react-router-dom";
import MiniModal from "../UI/MiniModal";
import { removeFriendship } from "../commonFunctions";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const MyFriends = ({ setIsUpdated }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [friendsList, setFriendsList] = useState([]);
  const [currentCardUsername, setCurrentCardUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();
  const removeFriend = async () => {
    const { toastMsg, toastType } = await removeFriendship(
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
      title: "Message this friend",
      icon: LiaTelegramPlane,
      action: () => {
        navigate("/chats");
      },
    },
    {
      title: "Remove this friend",
      icon: LuUserX2,
      action: () => {
        setModalType("remove");
        setIsModal(true);
      },
    },
  ];
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/friends/getFriendsList`, {
        params: {
          ownerId: userId,
        },
      });
      if (response.data) {
        setFriendsList(response?.data?.friends || []);
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
        friendsList?.map((friend, index) => {
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
      {!loading && friendsList.length === 0 && (
        <NoDataFound
          title="No Friends"
          desc="You haven't added any friends yet. Once you connect with others, your friends will appear here."
        />
      )}
      {modalType === "remove" && isModal && (
        <MiniModal
          closeModal={() => {
            setModalType("");
            setIsModal(false);
          }}
          actionBtnText="Remove Friend"
          actionBtnFun={removeFriend}
          title={`Remove Friend @${currentCardUsername}`}
          desc="Are you sure you want to remove this friend? This action will delete them from your friend list."
        />
      )}
    </div>
  );
};

export default MyFriends;
