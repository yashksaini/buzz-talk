/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
// import { IoSettingsOutline } from "react-icons/io5";
import axios from "axios";
import { useSelector } from "react-redux";
import { LuMailPlus } from "react-icons/lu";
import { GoSearch } from "react-icons/go";
import NewChatModal from "../components/NewChatModal";
import Loader from "../components/UI/Loader";
import ChatCard from "../components/UI/ChatCard";
import NoDataFound from "../components/UI/NoDataFound";
import ChatArea from "../components/ChatArea";
import { BASE_URL } from "../Constants/constants";
import { getActiveUsers } from "../Constants/ChatUtils";
const MyChats = ({ socket }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [search, setSearch] = useState("");
  const [isNewChatModal, setIsNewChatModal] = useState(false);
  const [chatsList, setChatsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  // const handleSearch = () => {};
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/chat/getChatsList`, {
          params: {
            ownerId: userId,
          },
        });
        if (response?.data) {
          setChatsList(response?.data?.chats || []);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("ERROR in fetching friends", error);
        setIsLoading(false);
      }
    };
    fetchChats();
  }, [userId]);

  const checkUserStatus = (friendId) => {
    const isFriendOnline = activeUsers.some((user) => user.userId === friendId);
    return isFriendOnline;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, isSuccess } = await getActiveUsers();
      isSuccess && setActiveUsers(data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    socket.on("activeUsers", (data) => {
      setActiveUsers(data);
    });
  }, [socket]);

  return (
    <>
      <div className="flex justify-center items-center h-full">
        {/* Friends List */}
        <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden border-r border-line text-dark1">
          {/* Top Section */}
          <div className="px-3">
            <div className="w-full flex justify-between items-center py-2">
              <span className="text-2xl font-bold text-dark1 leading-7 min-w-48">
                Messages
              </span>
              <div className="flex-1 flex justify-end items-center ">
                {/* <span
                  className="hover:bg-line p-2 rounded-full cursor-pointer text-xl"
                  data-tooltip-id="settings-tip"
                >
                  <IoSettingsOutline />
                </span> */}
                <span
                  className="hover:bg-line p-2 rounded-full cursor-pointer text-xl"
                  data-tooltip-id="new-message-tip"
                  onClick={() => {
                    setIsNewChatModal(true);
                  }}
                >
                  <LuMailPlus />
                </span>
              </div>

              {/* <ReactTooltip
                id="settings-tip"
                place="bottom"
                content="Settings"
                delayShow={500}
                style={{
                  zIndex: "50",
                }}
              /> */}
              <ReactTooltip
                id="new-message-tip"
                place="bottom"
                content="New Message"
                delayShow={500}
                style={{
                  zIndex: "50",
                }}
              />
            </div>
            <div className="w-full bg-white">
              <div className="w-full h-12 bg-white rounded-full border border-borderColor flex justify-center items-center gap-3 pl-3 pr-2 focus-within:bg-white focus-within:border-primaryBorder ">
                <GoSearch className="text-2xl group:focus-within text-grayText " />
                <input
                  type="text"
                  placeholder="Search Direct Messages..."
                  className="flex-1 bg-transparent focus:outline-none text-dark1 font-medium"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                {/* <button
                  onClick={handleSearch}
                  className="bg-dark2 text-white h-8 px-4 rounded-full"
                >
                  Search
                </button> */}
              </div>
            </div>
          </div>
          {/* Chats List */}
          <div className="mt-4">
            {isLoading && (
              <div className="w-full flex justify-center items-center min-h-40">
                <Loader />
              </div>
            )}
            {!isLoading && 
              chatsList?.filter((c)=>!c?.isBlocked)?.map((chat, index) => {
                return (
                  <ChatCard
                    user={{
                      _id: chat?.friendProfile.userId,
                      fullName: chat?.friendProfile.fullName,
                      username: chat?.friendProfile.username,
                      imgUrl: chat?.friendProfile.imgUrl,
                    }}
                    chatId_={chat?.chatId}
                    lastMessage={chat.lastMessage}
                    updatedAt={chat.updatedAt}
                    key={index}
                    isOnline={checkUserStatus(chat?.friendProfile.userId)}
                    socket={socket}
                    unreadCount={chat.unreadCount}
                    isBlocked={false}
                  />
                );
              })}
              {!isLoading && chatsList?.filter((c)=>c?.isBlocked)?.length>0 && (
                <div className="w-full flex justify-center items-center gap-2 my-4">
                  <span className="w-full h-[1px] bg-line"></span>
                  <span className="whitespace-nowrap text-sm text-grayText">Blocked Chats</span>
                  <span className="w-full h-[1px] bg-line"></span>
                </div>)
              }
              {!isLoading &&
              chatsList?.filter((c)=>c?.isBlocked)?.map((chat, index) => {
                return (
                  <ChatCard
                    user={{
                      _id: chat?.friendProfile.userId,
                      fullName: chat?.friendProfile.fullName,
                      username: chat?.friendProfile.username,
                      imgUrl: chat?.friendProfile.imgUrl,
                    }}
                    chatId_={chat?.chatId}
                    lastMessage={chat.lastMessage}
                    updatedAt={chat.updatedAt}
                    key={index}
                    isOnline={checkUserStatus(chat?.friendProfile.userId)}
                    socket={socket}
                    unreadCount={chat.unreadCount}
                    isBlocked={true}
                  />
                );
              })}
            {!isLoading && chatsList.length === 0 && (
              <NoDataFound
                title="No Chats Created"
                desc="You haven't created any chats yet. Once you create chats, your chats will appear here."
              />
            )}
          </div>
        </div>
        {/* Chat Area */}
        <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
          <ChatArea socket={socket} />
        </div>
      </div>
      {isNewChatModal && <NewChatModal setIsNewChatModal={setIsNewChatModal} />}
    </>
  );
};

export default MyChats;
