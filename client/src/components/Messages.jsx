/* eslint-disable react/prop-types */
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { PiChecksBold, PiCheckBold } from "react-icons/pi";
const Messages = ({ messages }) => {
  const { userId } = useSelector((state) => state.userAuth);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(parseISO(message.sentAt), "yyyy-MM-dd");
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  // const getMessageReadTime = (message) => {
  //   const otherUserReadData = message.readBy.filter(
  //     (readInfo) => readInfo.userId !== userId
  //   );
  //   if (otherUserReadData.length > 0) {
  //     return format(parseISO(otherUserReadData[0].readAt), "hh:mm a");
  //   } else {
  //     return null;
  //   }
  // };
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
                <div
                  className={`max-w-xs py-2 px-4 mt-1 mx-2 rounded-2xl ${
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
    </>
  );
};

export default Messages;
