import { useEffect, useRef, useState } from "react";
import TopUsers from "../components/TopUsers";
import { BsBell } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import NotificationsList from "../components/NotificationsList";
import { useSelector } from "react-redux";
import { deleteAllReadNotifications, markAllNotificationsAsRead } from "../Constants/notificationsUtils";

// eslint-disable-next-line react/prop-types
const Notifications = ({setIsUpdated}) => {
  const {userId} = useSelector(state=> state.userAuth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isListUpdate,setIsListUpdate] = useState(false);
  const dropdownRef = useRef(null);

  const defaultOptions = [
    {
      title: "Mark all as read",
      icon: IoMdCheckmarkCircleOutline,
      action: async() => {
        setIsDropdownOpen(false);
       const {isSuccess} = await markAllNotificationsAsRead(userId);
       isSuccess && setIsListUpdate(prev=>!prev);
        isSuccess && setIsUpdated(prev=>!prev);
      },
    },
    {
      title: "Delete Read",
      icon: MdDeleteOutline,
      action: async() => {
        setIsDropdownOpen(false);
        const {isSuccess} = await deleteAllReadNotifications(userId);
        isSuccess && setIsListUpdate(prev=>!prev);
        isSuccess && setIsUpdated(prev=>!prev);
       },
    },
  ];
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex justify-center items-center h-full">
      <div className="sm:w-[600px] w-full max-w-full sm:border-r border-r-none sm:border-line h-full overflow-y-auto overflow-x-hidden sm:border-l">
        <div className="w-full flex justify-between items-center py-4 px-3 border-b border-line sticky top-0 left-0 bg-white z-50">
          <span className="text-2xl font-bold text-dark1 leading-7 min-w-48">
            Notifications
          </span>
          <div className="flex-1 flex justify-end items-center ">
            <div className="relative" ref={dropdownRef}>
              <div
                className={`w-8 h-8 flex justify-center items-center rounded-full hover:bg-line cursor-pointer`}
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <BsBell />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 top-0 w-52 rounded-md shadow-lg bg-white border border-line z-10 py-2">
                  {defaultOptions.map((option, index) => {
                    return (
                      <div
                        key={index}
                        className="flex px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer h-10 gap-1 items-center justify-start"
                        onClick={option.action}
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
          </div>
        </div>
        <div>
          <NotificationsList isListUpdate={isListUpdate} setIsUpdated={setIsUpdated}/>
        </div>
      </div>
      <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden sm:px-3 px-0 lg:block hidden">
        <TopUsers />
      </div>
    </div>
  );
};

export default Notifications;
