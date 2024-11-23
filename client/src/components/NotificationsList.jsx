import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications, markNotificationRead } from "../Constants/notificationsUtils";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import NotificationDropdown from "./UI/NotificationDropdown";
import NotificationIcon from "./UI/NotificationIcon";
import NoDataFound from "./UI/NoDataFound";
// eslint-disable-next-line react/prop-types
const NotificationsList = ({isListUpdate,setIsUpdated}) => {
  const { userId } = useSelector((state) => state.userAuth);
  const [notifications, setNotifications] = useState([]);
  const [currentNotificationId, setCurrentNotificationId] = useState(null);
  const fetchNotifications = async () => {
    const { data } = await getNotifications(userId);
    setNotifications(data);
    setIsUpdated(prev=> !prev);
  };
  useEffect(() => {
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId,isListUpdate]);
  return (
    <div>
      {notifications.map((notification) => {

        return(
        <div
          key={notification?._id}
          className={`w-full py-4 px-6 flex justify-start items-start gap-2  ${notification.isRead?"border-b border-line":"bg-line border-b border-white"}` }
        >
            <NotificationIcon type={notification?.type}/>
          <div className="w-[calc(100%_-_52px)] ">
            <div className=" h-10 flex justify-between items-center  gap-[2px]">
              <Link to={notification?.url} onClick={async()=>{
                if(!notification?.isRead){
                  await markNotificationRead(userId,notification?._id);
                }
              }}>
                <p className="leading-4  text-dark1 hover:underline ">
                <span className="font-semibold">{notification?.senderName}</span> 
                  <span className="text-grayText ml-1 text-xs">{notification?.title}</span>
                </p>
                <p className="leading-4  text-mainText text-xs">
                  {formatDistanceToNow(notification?.time, { addSuffix: true })}
                </p>
              </Link>
              <NotificationDropdown
                setCurrentNotificationId={setCurrentNotificationId}
                currentNotificationId={currentNotificationId}
                isRead={notification?.isRead}
                notificationId={notification?._id}
                fetchNotifications={fetchNotifications}
              />
            </div>
            <p className="text-xs text-dark1 mt-1">
              {notification?.desc?.substring(0, 150)}
              {notification?.desc?.length > 150 ? "..." : ""}
            </p>
          </div>
        </div>
      )})}
      {notifications?.length===0 && <NoDataFound desc="No notifications to display." title="No Notifications" /> }
    </div>
  );
};

export default NotificationsList;
