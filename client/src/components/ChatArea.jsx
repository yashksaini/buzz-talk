/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { BiInfoCircle, BiSend } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileIcon from "./ProfileIcon";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Messages from "./Messages";
import {
  getChatData,
  getChatMessages,
  markMessagesAsRead,
  sendMessage,
} from "../Constants/ChatUtils";
import { CHAT_LIMIT_PER_PAGE } from "../Constants/constants";
import NoDataFound from "./UI/NoDataFound";
import Loader from "./UI/Loader";
const ChatArea = ({ socket }) => {
  const navigate = useNavigate();
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
  const [isTyping, setIsTyping] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatId) {
      socket.emit("joinChatPool", {
        chatId: chatId,
        userId: userId,
      });
    }
  }, [chatId, socket, userId]);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to scroll to the bottom
  const scrollToTop = () => {
    chatStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchData = async () => {
    setIsLoading(true);
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

      isSuccess && setMessages(messages);
      isSuccess && setPage(2);
      !isSuccess && setMessages([]);
      if (isSuccess) {
        setTimeout(() => {
          scrollToBottom();
        }, 200);
        const { newReadMessages } = await markMessagesAsRead({
          chatId,
          ownerId: userId,
        });
        socket.emit("newReadMessages", { chatId, newReadMessages });
      }
      setIsLoading(false);
    } else {
      socket.emit("leaveChatPool", { chatId, userId });
      // If chatId is invalid or the user is not of the chat
      navigate("/chats");
    }
  };
  useEffect(() => {
    if (chatId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, userId]);

  const loadMore = async () => {
    const { messages, isSuccess } = await getChatMessages(chatId, page);
    isSuccess && setMessages((prevResults) => [...prevResults, ...messages]);
    isSuccess && setPage((prev) => prev + 1);
    !isSuccess && setHasMore(false);
    scrollToTop();
  };
  // Send a message
  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const newMessage = {
        senderId: userId,
        message: messageText,
        sentAt: new Date(),
        readBy: [{ userId: userId, readAt: new Date() }],
      };

      await sendMessage(chatId, newMessage);
      // Emit the sendMessage event to the server
      socket.emit("sendMessage", {
        chatId,
        newMessage,
        friendId: chatData?.friendsProfile?.userId,
      });
      setMessageText(""); // Clear input after sending
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", async (messageData) => {
      setTimeout(() => {
        scrollToBottom();
      }, 400);
      await markMessagesAsRead({ chatId, ownerId: userId });
      setMessages((prevMessages) => [messageData, ...prevMessages]);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId, socket, userId]);

  useEffect(() => {
    const updateMessageStatus = (newMessages) => {
      const temp = [...messages];
      const newData = temp.filter((message) => {
        return message._id;
      });
      newData.unshift(...newMessages.reverse());
      setMessages(newData);
    };

    socket.on("broadCastNewMessages", async (newReadMessages) => {
      if (newReadMessages.length > 0) {
        if (newReadMessages[0].senderId === userId) {
          updateMessageStatus(newReadMessages);
        }
      }
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("broadCastNewMessages");
    };
  }, [messages, socket, userId]);

  useEffect(() => {
    socket.on("userTyping", async ({ typingUser, isTyping }) => {
      if (userId !== typingUser) {
        setIsTyping(isTyping);
      } else {
        setIsTyping(false);
      }
    });
  }, [socket, userId]);

  useEffect(() => {
    socket.on("chatUsers", async (chatUsers) => {
      if (chatUsers.length > 1) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    });
  }, [socket]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      {chatId && !isLoading && (
        <>
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
                  {isActive && !isTyping && (
                    <span className="ml-2 font-medium text-green-600">
                      Active
                    </span>
                  )}
                  {isTyping && (
                    <span className="ml-2  font-medium text-green-600">
                      Typing...
                    </span>
                  )}
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
              <Messages
                messages={messages}
                friendsProfile={chatData?.friendsProfile}
              />
              {totalMessages >= messages.length && hasMore && (
                <div className="w-full flex justify-center items-center py-2">
                  <button
                    onClick={loadMore}
                    className="bg-backgroundDark hover:bg-line rounded-md text-sm hover:cursor-pointer px-4 py-2 text-dark2 font-semibold"
                  >
                    Load More
                  </button>
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
                onFocus={() => {
                  socket.emit("startTyping", { chatId, userId });
                }}
                onBlur={() => {
                  socket.emit("stopTyping", { chatId, userId });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageText.trim()) {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="px-4 h-full text-gray-600 focus:outline-none"
                onClick={async () => {
                  handleSendMessage();
                }}
              >
                <BiSend />
              </button>
            </div>
          </div>
        </>
      )}
      {isLoading && (
        <div className="h-full w-full flex justify-center items-start py-6">
          <Loader />
        </div>
      )}
      {!chatId && (
        <div className="flex justify-center items-start h-full flex-col">
          <NoDataFound
            desc={
              "Choose from your existing conversations, start a new one, or just keep swimming."
            }
            title={"Select a message"}
          />
        </div>
      )}
    </div>
  );
};

export default ChatArea;
