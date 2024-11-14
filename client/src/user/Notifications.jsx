import { useEffect, useRef, useState } from "react";
import TopUsers from "../components/TopUsers";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import NotificationsList from "../components/NotificationsList";

const Notifications = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultOptions = [
    {
      title: "Mark all as read",
      icon: IoMdCheckmarkCircleOutline,
      action: () => {
        console.log("Mark all as read");
      },
    },
    {
      title: "Delete Read",
      icon: MdDeleteOutline,
      action: () => {
        console.log("Block Friend");
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
      <div className="w-[600px] border-r border-line h-full overflow-y-auto overflow-x-hidden">
        <div className="w-full flex justify-between items-center py-6 px-3 border-b border-line">
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
                <BsThreeDotsVertical />
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
          <NotificationsList />
        </div>
      </div>
      <div className="flex-1 bg-white h-full overflow-y-auto overflow-x-hidden px-3">
        <TopUsers />
      </div>
    </div>
  );
};

export default Notifications;
