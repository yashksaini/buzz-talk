import { useEffect, useState } from "react";
import { BiInfoCircle, BiSend } from "react-icons/bi";
import axios from "axios";
import { BASE_URL } from "../main";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileIcon from "./ProfileIcon";
import { Tooltip as ReactTooltip } from "react-tooltip";

const ChatArea = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const { chatId } = useParams();
  const [chatData, setChatData] = useState({});
  const [messageText, setMessageText] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/chat/getChatData`, {
          params: { ownerId: userId, chatId: chatId }, // Replace with actual values
        });
        if (response?.data) {
          setChatData(response?.data || {});
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

      console.log("Message sent:", response.data);
      setMessageText(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
      <div className="w-full min-h-[calc(100dvh_-_112px)]  overflow-x-hidden overflow-y-auto"></div>
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
