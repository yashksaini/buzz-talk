/* eslint-disable react/prop-types */
import { IoCloseOutline } from "react-icons/io5";
import { PiCheckBold, PiChecksBold } from "react-icons/pi";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import ProfileIcon from "./ProfileIcon";
const MessageInfoModal = ({
  setIsMessageInfo,
  messageInfo,
  friendsProfile,
}) => {
  const { userId } = useSelector((state) => state.userAuth);
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
  const getMessageReadTime = (message) => {
    const otherUserReadData = message.readBy.filter(
      (readInfo) => readInfo.userId !== userId
    );
    if (otherUserReadData.length > 0) {
      const readAt = parseISO(otherUserReadData[0].readAt);
      return formatDate(readAt);
    } else {
      return null;
    }
  };

  const formatDate = (readAt) => {
    let formattedDate;
    if (isToday(readAt)) {
      formattedDate = `Today, ${format(readAt, "hh:mm a")}`;
    } else if (isYesterday(readAt)) {
      formattedDate = `Yesterday, ${format(readAt, "hh:mm a")}`;
    } else {
      formattedDate = format(readAt, "dd MMM yyyy, hh:mm a"); // e.g., "05 Nov 2024, 09:30 AM"
    }
    return formattedDate;
  };
  return (
    <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-50 md:p-8 p-2 flex justify-center items-center">
      <div className="max-w-full w-[600px] bg-white rounded-xl h-[650px] max-h-full overflow-hidden ">
        <div className="w-full h-[650px] max-h-full overflow-x-hidden overflow-y-auto">
          <div className="flex justify-between items-center h-14 w-full sticky top-0 left-0 bg-white  z-50 px-3 border-b border-borderColor">
            <h1 className="font-bold text-[20px] ">Message Info</h1>
            <button
              onClick={() => setIsMessageInfo(false)}
              className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
            >
              <IoCloseOutline className="text-2xl" />
            </button>
          </div>
          {/* Modal Body */}
          <div className="w-full ">
            <div className="w-full py-2 ">
              <div className={`flex justify-end `}>
                <div
                  className={`max-w-xs py-2 px-4 mt-1 mx-2 rounded-2xl bg-dark2 text-white rounded-br-none`}
                >
                  {messageInfo?.message}
                </div>
              </div>
              <div
                className={`text-xs text-grayText px-4 flex justify-end mt-1`}
              >
                Sent at, {formatDate(parseISO(messageInfo?.sentAt))}
                <span className="ml-2 text-base">
                  {messageInfo.senderId === userId &&
                    isMessageRead(messageInfo) && (
                      <PiChecksBold className="text-primary" />
                    )}
                  {messageInfo.senderId === userId &&
                    !isMessageRead(messageInfo) && <PiCheckBold />}
                </span>
              </div>
            </div>
            <div className="py-2">
              {isMessageRead(messageInfo) && (
                <>
                  <h1 className="px-3 mb-2 font-semibold textd-[18px] ">
                    Read By
                  </h1>
                  <div
                    className={`w-full py-3 px-5 flex justify-start items-start gap-2 cursor-pointer border-t border-b border-line`}
                  >
                    <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
                      {!friendsProfile?.imgUrl && (
                        <ProfileIcon fullName={friendsProfile?.fullName} />
                      )}
                      {friendsProfile?.imgUrl && (
                        <img
                          src={friendsProfile?.imgUrl}
                          alt="profile"
                          className="w-9 h-9 rounded-full"
                        />
                      )}
                    </div>
                    <div className="w-[calc(100%_-_52px)] ">
                      <div className=" h-10 flex justify-between items-center  gap-[2px]">
                        <div>
                          <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
                            {friendsProfile?.fullName}
                          </p>
                          <p className="leading-4  text-grayText text-xs ">
                            {getMessageReadTime(messageInfo)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!isMessageRead(messageInfo) && (
                <div className="flex justify-center items-center bg-line px-3 py-16 mt-5">
                  <div>
                    <h2 className="text-[32px] leading-8 font-bold text-dark1 mb-3">
                      Unread Message
                    </h2>
                    <p className="text-mainText leading-5">
                      Currently, there are no users who have viewed this
                      message.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInfoModal;
