import ProfileIcon from "../ProfileIcon";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { FaCircle } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";

const ChatCard = ({
  user,
  lastMessage,
  updatedAt,
  chatId_: chatId_,
  isOnline,
  socket,
}) => {
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.userAuth);
  const { chatId } = useParams();
  const [cardUpdatedAt, setCardUpdatedAt] = useState(updatedAt);
  const [cardLastMessage, setCardLastMessage] = useState(lastMessage);
  const [isUnreadMessages, setIsUnreadMessages] = useState(false);

  useEffect(() => {
    return () => {
      // Emit leaveChatPool event on component unmount
      socket.emit("leaveChatPool", { chatId: chatId_, userId });
    };
  }, [chatId_, socket, userId]);

  useEffect(() => {
    socket.on("recentMessage", async (messageData) => {
      const { newMessage } = messageData;
      if (chatId_ === messageData.chatId) {
        setCardUpdatedAt(newMessage?.sentAt);
        setCardLastMessage(newMessage?.message);
        if (messageData.chatId === chatId) {
          setIsUnreadMessages(false);
        } else {
          setIsUnreadMessages(true);
        }
      }
    });
    // Cleanup listener on component unmount
    return () => {
      socket.off("recentMessage");
    };
  }, [chatId, chatId_, socket]);

  return (
    <div
      key={user?.username}
      className={`w-full py-3 px-5 flex justify-start items-start gap-2 hover:bg-line cursor-pointer ${
        chatId === chatId_
          ? "bg-backgroundDark  border-l border-dark2"
          : "border-l border-white"
      }`}
      onClick={() => {
        // Emit leaveChatPool for the current chat if switching
        if (chatId && chatId !== chatId_) {
          socket.emit("leaveChatPool", { chatId, userId });
        }
        socket.emit("joinChatPool", {
          chatId: chatId_,
          userId: userId,
        });
        navigate(`/chats/${chatId_}`);
      }}
    >
      <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
        {!user?.imgUrl && <ProfileIcon fullName={user?.fullName} />}
        {user?.imgUrl && (
          <img
            src={user?.imgUrl}
            alt="profile"
            className="w-9 h-9 rounded-full"
          />
        )}
      </div>
      <div className="w-[calc(100%_-_52px)] ">
        <div className=" h-10 flex justify-between items-center  gap-[2px]">
          <div>
            <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
              {user?.fullName}{" "}
              <span className="text-xs font-normal text-dark2 ml-2">
                {formatDistanceToNow(cardUpdatedAt, { addSuffix: true })}
              </span>
            </p>
            <p className="leading-4  text-grayText text-xs font-bold">
              @{user?.username}{" "}
              {isOnline && (
                <span className="text-green-500 font-bold inline-flex justify-center items-center gap-1 ml-2">
                  <FaCircle className="inline text-[8px]" /> Online
                </span>
              )}
              {!isOnline && (
                <span className="text-grayText font-medium inline-flex justify-center items-center gap-1 ml-2">
                  <FaCircle className="inline text-[8px]" /> Offline
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="text-xs text-grayText font-medium">
          {cardLastMessage.substring(0, 84)}
          {cardLastMessage?.length > 84 && "..."}
        </div>
      </div>
      <span>
        {isUnreadMessages && (
          <BsCircleFill className="inline text-primary/80 text-[10px]" />
        )}
      </span>
    </div>
  );
};
// Prop types validation
ChatCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
  }).isRequired,
  lastMessage: PropTypes.string,
  updatedAt: PropTypes.any,
  chatId_: PropTypes.string,
  isOnline: PropTypes.bool,
  socket: PropTypes.any,
};

export default ChatCard;
