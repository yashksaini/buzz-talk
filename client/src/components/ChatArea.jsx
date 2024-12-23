/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { BiInfoCircle, BiSend } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileIcon from "./ProfileIcon";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Messages from "./Messages";
import {
  blockUserInChat,
  getChatData,
  getChatMessages,
  markMessagesAsRead,
  sendMessage,
  unblockUserInChat,
} from "../Constants/ChatUtils";
import { CHAT_LIMIT_PER_PAGE } from "../Constants/constants";
import NoDataFound from "./UI/NoDataFound";
import Loader from "./UI/Loader";
import { IoMdArrowBack } from "react-icons/io";
const ChatArea = ({ socket }) => {
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.userAuth);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState({});
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [unblock, setUnblock] = useState(false);
  // const [keyboardHeight, setKeyboardHeight] = useState(0);
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
  const checkIsBlocked = (usersList) => {
    let isBlocked = false;
    let isUnblock = false;
    usersList?.forEach((user) => {
      if (user?.userId?._id === userId && user?.isBlocked) {
        if (user?.isBlocked) {
          isBlocked = true;
        } else {
          isBlocked = false;
        }
      }
      if (user?.isBlocked) {
        isUnblock = true;
      }
    });
    setUnblock(isUnblock);
    setBlocked(isBlocked);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setIsDetails(false);
    const { data, isSuccess } = await getChatData(chatId, userId);
    if (isSuccess) {
      if (data?.totalMessages > CHAT_LIMIT_PER_PAGE) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setChatData(data);
      checkIsBlocked(data?.users);
      setTotalMessages(data?.totalMessages);
      const { messages, isSuccess } = await getChatMessages(chatId, 1);

      isSuccess && setMessages(messages);
      isSuccess && setPage(2);
      !isSuccess && setMessages([]);
      if (isSuccess) {
        setTimeout(() => {
          scrollToBottom();
        }, 1000);
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

      await sendMessage(chatId, newMessage, userId);
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
      }, 1000);
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
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        scrollToBottom();
      }, 500);
      // const viewport = window.visualViewport;

      // if (viewport) {
      //   const keyboardOpened = viewport.height < window.innerHeight;
      //   setKeyboardHeight(keyboardOpened ? window.innerHeight - viewport.height : 0);
      // }
    };

    // Add event listeners for keyboard events
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`w-full overflow-hidden`}
      style={{
        height: `100%`,
      }}
    >
      {chatId && !isLoading && !isDetails && (
        <>
          <div className="sticky w-full left-0 h-14 bg-white flex justify-between items-center px-3 border-b border-line z-10">
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  navigate("/chats");
                }}
                className="w-9 h-9  justify-center items-center rounded-full hover:bg-line transition-all flex md:hidden"
              >
                <IoMdArrowBack className="text-2xl" />
              </button>
              <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary hover:cursor-pointer" onClick={()=>{
                navigate("/profile/" + chatData?.friendsProfile?.username);
              }}>
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
              <div className="hover:cursor-pointer" onClick={()=>{
                navigate("/profile/" + chatData?.friendsProfile?.username);
              }}>
                <h1 className="text-dark1 font-bold">
                  {chatData?.friendsProfile?.fullName}
                </h1>
                <p className="leading-4  text-mainText text-xs ">
                  {chatData?.friendsProfile?.username}
                  {!(blocked || unblock) && isActive && !isTyping && (
                    <span className="ml-2 font-medium text-green-600">
                      Active
                    </span>
                  )}
                  {!(blocked || unblock) && isTyping && (
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
              onClick={() => {
                setIsDetails(true);
              }}
            >
              <BiInfoCircle />
            </span>
            <ReactTooltip
              id="chat-info"
              place="bottom"
              content="Details"
              delayShow={500}
              style={{
                zIndex: "500",
              }}
            />
          </div>
          <div
            className={`w-full overflow-x-hidden overflow-y-auto bg-white`}
            style={{
              height: `calc(100% - 112px)`,
            }}
          >
            <div className="flex flex-col-reverse gap-2 p-3">
              <div ref={chatEndRef} />
              <Messages
                messages={messages}
                friendsProfile={chatData?.friendsProfile}
              />
              {!(blocked || unblock) &&
                totalMessages >= messages.length &&
                hasMore && (
                  <div className="w-full flex justify-center items-center py-2">
                    <button
                      onClick={loadMore}
                      className="bg-backgroundDark hover:bg-line rounded-md text-sm hover:cursor-pointer px-4 py-2 text-dark2 font-semibold"
                    >
                      Load More
                    </button>
                  </div>
                )}
            </div>
          </div>
          <div className="flex justify-start items-center sticky bottom-0  w-full h-14 bg-white border-t border-line px-3 py-2 z-10">
            {!(blocked || unblock) && (
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
            )}
            {blocked && (
              <div className="text-dark2">
                You are no longer allowed to send messages in this chat.
              </div>
            )}
            {!blocked && unblock && (
              <div className="text-dark2">
                Unblock the user to enable messaging.{" "}
                <span
                  className="text-primary cursor-pointer ml-1"
                  onClick={() => {
                    setIsDetails(true);
                  }}
                >
                  Allow DMs
                </span>
              </div>
            )}
          </div>
        </>
      )}
      {chatId && !isLoading && isDetails && (
        <>
          <div className="flex justify-start items-center w-full gap-2 text-dark1 px-3 py-2">
            <button
              onClick={() => {
                setIsDetails(false);
                setTimeout(() => {
                  scrollToBottom();
                }, 1000);
              }}
              className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
            >
              <IoMdArrowBack className="text-2xl" />
            </button>
            <h1 className="font-bold text-[20px] ">Conversation info</h1>
          </div>
          <div className="h-14 bg-white flex justify-between items-center px-3 border-b border-line">
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
          </div>
          <div className="w-full flex justify-center items-center flex-col">
            {!blocked && (
              <button
                className="h-14 flex justify-center items-center hover:bg-transPrimary w-full text-primary"
                onClick={async () => {
                  if (!unblock) {
                    const { isSuccess } = await blockUserInChat(
                      chatId,
                      chatData?.friendsProfile?.userId
                    );
                    if (isSuccess) {
                      setIsDetails(false);
                      setBlocked(false);
                      setUnblock(true);
                    }
                  } else {
                    const { isSuccess } = await unblockUserInChat(
                      chatId,
                      chatData?.friendsProfile?.userId
                    );
                    if (isSuccess) {
                      setIsDetails(false);
                      setBlocked(false);
                      setUnblock(false);
                    }
                  }
                }}
              >
                {unblock ? "Allow DMs " : "Block DMs"}
              </button>
            )}
            {blocked && (
              <NoDataFound
                title={"No actions"}
                desc={
                  "You are restricted from performing any actions in this chat at the moment."
                }
              />
            )}
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
