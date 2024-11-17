/* eslint-disable react/prop-types */
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { PiChecksBold, PiCheckBold } from "react-icons/pi";
import { useState } from "react";
import MessageInfoModal from "./MessageInfoModal";
import { BsInfoLg } from "react-icons/bs";
const Messages = ({ messages, friendsProfile }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [isMessageInfo, setIsMessageInfo] = useState(false);
  const [messageInfo, setMessageInfo] = useState({});

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(parseISO(message.sentAt), "yyyy-MM-dd");
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  const isMessageRead = (message) => {
    const otherUserReadData = message.readBy.filter(
      (readInfo) => readInfo.userId !== userId
    );
    if (otherUserReadData.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {Object.keys(groupedMessages).map((date) => (
        <div key={date}>
          {/* Display the date heading */}
          <div className="text-dark2 py-1 sticky top-0 z-10 flex justify-center items-center">
            <span className="bg-backgroundDark py-1 px-3 rounded text-sm">
              {format(parseISO(date), "MMMM dd, yyyy")}
            </span>
          </div>

          {/* Map through messages for each date */}
          {groupedMessages[date]?.reverse().map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div>
                <div className="flex justify-center items-end mt-1 mx-2 gap-1">
                  {message.senderId === userId && (
                    <span
                      onClick={() => {
                        setMessageInfo(message);
                        setIsMessageInfo(true);
                      }}
                      className="h-6 w-6 rounded-full flex justify-center items-center hover:bg-line cursor-pointer text-grayText"
                    >
                      <BsInfoLg />
                    </span>
                  )}
                  <div
                    className={`max-w-xs py-2 px-4  rounded-2xl ${
                      message.senderId === userId
                        ? "bg-dark2 text-white rounded-br-none"
                        : "bg-line text-black rounded-tl-none"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
                <div
                  className={`text-xs text-grayText px-4 flex ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  } mt-1`}
                >
                  {format(parseISO(message.sentAt), "hh:mm a")}
                  <span className="ml-2 text-base">
                    {message.senderId === userId && isMessageRead(message) && (
                      <PiChecksBold className="text-primary" />
                    )}
                    {message.senderId === userId && !isMessageRead(message) && (
                      <PiCheckBold />
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      {isMessageInfo && (
        <MessageInfoModal
          setIsMessageInfo={setIsMessageInfo}
          messageInfo={messageInfo}
          friendsProfile={friendsProfile}
        />
      )}
    </>
  );
};

export default Messages;
