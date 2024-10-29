import { useEffect, useRef, useState } from "react";
import { BiInfoCircle, BiSend } from "react-icons/bi";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileIcon from "./ProfileIcon";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { format } from "date-fns";
import { BASE_URL } from "../Constants/constants";
const ChatArea = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState({});
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const getChatMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/getChatMessages`, {
        params: { chatId: chatId }, // Replace with actual values
      });
      if (response?.data) {
        console.log(response.data);
        setMessages(response?.data?.messages || []);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/chat/getChatData`, {
          params: { ownerId: userId, chatId: chatId }, // Replace with actual values
        });
        if (response?.data) {
          setChatData(response?.data || {});
          setMessages(response?.data?.chat?.messages);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();
  }, [chatId, userId]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/chat/sendMessage`, {
        chatId: chatId,
        ownerId: userId,
        messageText,
      });
      if (response.status === 200) {
        getChatMessages();
      }
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const chatEndRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
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
        {/* Add chats here current user chat on right and sender chat on left */}
        <div className="flex flex-col gap-2 p-3">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div>
                <div
                  className={`max-w-xs py-2  px-4 mt-1 mx-2 rounded-2xl ${
                    message.senderId === userId
                      ? "bg-dark2 text-white rounded-br-none"
                      : "bg-line text-black rounded-tl-none"
                  }`}
                >
                  {message.message}
                </div>
                <div
                  className={`text-xs text-grayText px-4 flex ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  } mt-1`}
                >
                  {format(new Date(message?.sentAt), "hh:mm a")}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
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
          <button className="px-4 h-full text-gray-600" onClick={sendMessage}>
            <BiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
