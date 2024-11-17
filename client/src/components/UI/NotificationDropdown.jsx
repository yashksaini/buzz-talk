/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { deleteNotification, markNotificationRead } from "../../Constants/notificationsUtils";

const NotificationDropdown = ({
  currentNotificationId,
  setCurrentNotificationId,
  notificationId,fetchNotifications,
  isRead
}) => {
  const { userId } = useSelector((state) => state.userAuth);
  const dropdownRef = useRef(notificationId);
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      currentNotificationId === notificationId
    ) {
      setCurrentNotificationId(null);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // Every time currentNotificationId changed then new event added and old event is removed
  }, [currentNotificationId]);
  const defaultOptions = [
    {
      title: "Mark as Read",
      icon: IoMdCheckmarkCircleOutline,
      hidden: isRead,
      action: async(id) => {
        setCurrentNotificationId(null);
        const {isSuccess} = await markNotificationRead(userId,id);
        isSuccess && fetchNotifications();

      },
    },
    {
      title: "Delete",
      icon: MdDeleteOutline,
      hidden: false,
      action: async(id) => {
        setCurrentNotificationId(null);
        const {isSuccess} = await deleteNotification(userId,id);
        isSuccess && fetchNotifications();
      },
    },
  ];
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-8 h-8 flex justify-center items-center rounded-full hover:bg-line cursor-pointer `}
        onClick={() => {
          setCurrentNotificationId(notificationId);
        }}
      >
        <BsThreeDots />
      </div>
      {currentNotificationId === notificationId && (
        <div className="absolute right-0 top-0 w-52 rounded-md shadow-lg bg-white border border-line z-10 py-2">
          {defaultOptions?.filter((opt)=>opt.hidden===false).map((option, index) => {
            return (
              <div
                key={index}
                className="flex px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer h-10 gap-1 items-center justify-start"
                onClick={() => {
                  option.action(notificationId);
                }}
              >
                <span className="h-10 w-10 flex justify-center items-center text-base text-dark1 font-semibold">
                  <option.icon />
                </span>
                <span className="text-base text-dark1 font-semibold">
                  {option.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
