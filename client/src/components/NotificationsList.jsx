import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications } from "../Constants/notificationsUtils";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import NotificationDropdown from "./UI/NotificationDropdown";

const NotificationsList = () => {
  const { userId } = useSelector((state) => state.userAuth);
  const [notifications, setNotifications] = useState([]);
  const [currentNotificationId, setCurrentNotificationId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await getNotifications(userId);
      console.log(data);
      setNotifications(data);
    };
    fetchNotifications();
  }, [userId]);
  return (
    <div>
      {notifications.map((notification) => (
        <div
          key={notification?._id}
          className={`w-full py-3 px-6 flex justify-start items-start gap-2 `}
        >
          <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
            {"AA"}
          </div>
          <div className="w-[calc(100%_-_52px)] ">
            <div className=" h-10 flex justify-between items-center  gap-[2px]">
              <Link to={notification?.url}>
                <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold hover:underline ">
                  {notification?.title}
                </p>
                <p className="leading-4  text-mainText text-xs hover:underline hover:underline-offset-2">
                  {formatDistanceToNow(notification?.time, { addSuffix: true })}
                </p>
              </Link>
              <NotificationDropdown
                setCurrentNotificationId={setCurrentNotificationId}
                currentNotificationId={currentNotificationId}
                notificationId={notification?._id}
              />
            </div>
            <p className="text-xs text-dark1 mt-1">
              {notification?.desc?.substring(0, 150)}
              {notification?.desc?.length > 150 ? "..." : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
