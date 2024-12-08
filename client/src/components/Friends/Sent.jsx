import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FriendProfileCard from "../UI/FriendProfileCard";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Loader from "../UI/Loader";
import NoDataFound from "../UI/NoDataFound";
import { BASE_URL } from "../../Constants/constants";
import { withdrawFriendReq } from "../commonFunctions";
import { toast } from "react-toastify";
import MiniModal from "../UI/MiniModal";
// eslint-disable-next-line react/prop-types
const Sent = ({ setIsUpdated }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardUsername, setCurrentCardUsername] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const withdrawRequest = async () => {
    const { toastMsg, toastType } = await withdrawFriendReq(
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
      title: "Withdraw Request",
      icon: AiOutlineCloseCircle,
      action: () => {
        setModalType("withdraw");
        setIsModal(true);
      },
    },
  ];
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
        setLoading(false);
      }
    } catch (error) {
      console.error("ERROR in fetching sent requests", error);
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
          title="No Friend Requests Sent"
          desc="You haven't sent any friend requests yet. Sent requests will appear here once you send them."
        />
      )}
      {modalType === "withdraw" && isModal && (
        <MiniModal
          closeModal={() => {
            setModalType("");
            setIsModal(false);
          }}
          actionBtnText="Withdraw Request"
          actionBtnFun={withdrawRequest}
          title="Confirm Withdrawal"
          desc="Withdrawing this request will stop its processing. You can resubmit it later, but any previous progress may be lost."
        />
      )}
    </div>
  );
};

export default Sent;
