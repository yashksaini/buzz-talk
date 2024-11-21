/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import Loader from "./UI/Loader";
import { useSelector } from "react-redux";
import FriendsChatCard from "./UI/FriendsChatCard";
import NoDataFound from "./UI/NoDataFound";
import { toast } from "react-toastify";
import { axios } from "../Constants/constants";
import { useNavigate } from "react-router-dom";

const NewChatModal = ({ setIsNewChatModal,fetchChats }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [friendsList, setFriendsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("/friends/getFriendsList", {
          params: {
            ownerId: userId,
          },
        });
        if (response.data) {
          setFriendsList(response?.data?.friends || []);
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR in fetching friends", error);
        setLoading(false);
      }
    };
    fetchFriends();
  }, [userId]);
  const createNewChat = async () => {
    // userId is the current user id
    // selectedFriendId is the friend id for creation
    try {
      const response = await axios.post("/chat/create-new", {
        ownerId: userId,
        profileUserId: selectedFriendId,
      });

      if (response?.data?.chat) {
        toast.success(response?.data?.message);
      } else {
        toast.success(response?.data?.message);
      }
      const chat = response?.data?.chat;
      navigate(`/chats/${chat?.chatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Error creating new chat");
    }
    fetchChats();
    setIsNewChatModal(false);
  };
  useEffect(() => {
    if (selectedFriendId) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [selectedFriendId]);
  return (
    <>
      <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-20 md:p-8 p-2 flex justify-center items-center">
        <div className="max-w-full w-[600px] bg-white rounded-xl h-[650px] max-h-full overflow-hidden ">
          <div className="w-full h-[650px] max-h-full overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center h-14 w-full sticky top-0 left-0 bg-white  z-50 px-3">
              <div className="flex justify-start items-center flex-1 gap-2 text-dark1">
                <button
                  onClick={() => setIsNewChatModal(false)}
                  className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
                >
                  <IoCloseOutline className="text-2xl" />
                </button>
                <h1 className="font-bold text-[20px] ">New Message</h1>
              </div>
              <button
                className="h-9 px-6 flex justify-center items-center bg-dark2 text-white rounded-full font-semibold disabled:bg-grayText"
                onClick={createNewChat}
                disabled={isNextDisabled}
              >
                Next
              </button>
            </div>
            {/* Modal Body */}
            <div className="w-full">
              <div className="w-full h-12 bg-white border-b border-borderColor flex justify-center items-center gap-3 pl-5 pr-2 focus-within:bg-white focus-within:border-primaryBorder ">
                <GoSearch className="text-xl group:focus-within text-grayText " />
                <input
                  type="text"
                  placeholder="Search People"
                  className="flex-1 bg-transparent focus:outline-none text-dark1 font-medium"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="my-2">
                {loading && (
                  <div className="w-full flex justify-center items-center min-h-40">
                    <Loader />
                  </div>
                )}
                {!loading &&
                  friendsList?.filter((friend)=>{
                    return friend.fullName.toLowerCase().includes(search.toLowerCase()) || friend.username.toLowerCase().includes(search.toLowerCase());
                  })?.map((friend, index) => {
                    return (
                      <FriendsChatCard
                        user={{
                          _id: friend._id,
                          fullName: friend.fullName,
                          username: friend.username,
                          imgUrl: friend.imgUrl,
                        }}
                        selectedFriendId={selectedFriendId}
                        key={index}
                        setSelectedFriendId={setSelectedFriendId}
                      />
                    );
                  })}
                {!loading && friendsList.length === 0 && (
                  <NoDataFound
                    title="No Friends"
                    desc="You haven't added any friends yet. Once you connect with others, your friends will appear here."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewChatModal;
