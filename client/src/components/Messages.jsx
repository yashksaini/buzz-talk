/* eslint-disable react/prop-types */
import { format } from "date-fns";
import { useSelector } from "react-redux";

const Messages = ({ messages }) => {
  const { userId } = useSelector((state) => state.userAuth);
  return (
    <>
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
                message.senderId === userId ? "justify-end" : "justify-start"
              } mt-1`}
            >
              {format(new Date(message?.sentAt), "hh:mm a")}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Messages;
