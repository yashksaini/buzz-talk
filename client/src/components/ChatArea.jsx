import { useEffect, useRef, useState } from "react";
import { BiInfoCircle, BiSend } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileIcon from "./ProfileIcon";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Messages from "./Messages";
import {
  getChatData,
  getChatMessages,
  sendMessage,
} from "../Constants/ChatUtils";
import { CHAT_LIMIT_PER_PAGE } from "../Constants/constants";
const ChatArea = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState({});
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const chatStartRef = useRef(null);
  const chatEndRef = useRef(null);
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    console.log("scrollToBottom");
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to scroll to the bottom
  const scrollToTop = () => {
    chatStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchData = async () => {
    const { data, isSuccess } = await getChatData(chatId, userId);
    if (isSuccess) {
      if (data?.totalMessages > CHAT_LIMIT_PER_PAGE) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setChatData(data);
      setTotalMessages(data?.totalMessages);
      const { messages, isSuccess } = await getChatMessages(chatId, 1);
      setTimeout(() => {
        scrollToBottom();
      }, 1000);
      isSuccess && setMessages(messages);
      isSuccess && setPage(2);
      !isSuccess && setMessages([]);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, userId]);

  const loadMore = async () => {
    const { messages, isSuccess } = await getChatMessages(chatId, page);
    isSuccess && setMessages((prevResults) => [...prevResults, ...messages]);
    isSuccess && setPage((prev) => prev + 1);
    !isSuccess && setHasMore(false);
    scrollToTop();
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <div className="sticky top-0 left-0 h-14 bg-white flex justify-between items-center px-3 border-b border-line">
        <div className="flex justify-center items-center gap-2">
          <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
            {!chatData?.friendsProfile?.imgUrl && (
              <ProfileIcon fullName={chatData?.friendsProfile?.fullName} />
            )}
            {chatData?.friendsProfile?.imgUrl && (
              <img
                src={chatData?.friendsProfile?.imgUrl}
                alt="profile"
                className="w-9 h-9 rounded-full"
              />
            )}
          </div>
          <div>
            <h1 className="text-dark1 font-bold">
              {chatData?.friendsProfile?.fullName}
            </h1>
            <p className="leading-4  text-mainText text-xs ">
              {chatData?.friendsProfile?.username}
            </p>
          </div>
        </div>

        <span
          className="aspect-square h-8 hover:bg-gray-100 cursor-pointer flex justify-center items-center rounded-full"
          data-tooltip-id="chat-info"
        >
          <BiInfoCircle />
        </span>
        <ReactTooltip
          id="chat-info"
          place="bottom"
          content="Details"
          delayShow={500}
          style={{
            zIndex: "50",
          }}
        />
      </div>
      <div className="w-full h-[calc(100dvh_-_112px)]  overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col-reverse gap-2 p-3">
          <div ref={chatEndRef} />
          <Messages messages={messages} />
          {totalMessages >= messages.length && hasMore && (
            <div
              className="w-full flex justify-center items-center bg-line py-2"
              onClick={loadMore}
            >
              Load More
            </div>
          )}
          <div ref={chatStartRef} />
        </div>
      </div>
      <div className="flex justify-start items-center sticky bottom-0 w-full h-14 bg-white border-t border-line px-3 py-2">
        <div className="bg-gray-100 w-full h-full rounded-xl flex justify-center items-center">
          <input
            type="text"
            className="bg-transparent flex-1 focus:outline-none px-4"
            placeholder="Start a new message"
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
          />
          <button
            className="px-4 h-full text-gray-600"
            onClick={async () => {
              const { isSuccess } = await sendMessage(
                chatId,
                userId,
                messageText
              );
              if (isSuccess) {
                const { messages, isSuccess } = await getChatMessages(
                  chatId,
                  1
                );
                isSuccess && setMessages(messages);
                if (messages.length >= CHAT_LIMIT_PER_PAGE) {
                  setHasMore(true);
                }
              }
              isSuccess && setMessageText("");
              !isSuccess && setMessageText("");
            }}
          >
            <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
