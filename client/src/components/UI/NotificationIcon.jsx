/* eslint-disable react/prop-types */
import { FaRegBell } from 'react-icons/fa';
import { LuUserCheck2, LuUserPlus2, LuUserX2 } from 'react-icons/lu';
import { MdOutlineMarkChatUnread } from 'react-icons/md';
import { PiChatsCircleBold } from 'react-icons/pi';

// The notificationIcons mapping
const notificationIcons = {
  ACCEPTED: {
    icon: LuUserCheck2,
  },
  REQUEST: {
    icon: LuUserPlus2,
  },
  REMOVED: {
    icon: LuUserX2,
  },
  NEW_MESSAGE: {
    icon: MdOutlineMarkChatUnread,
  },
  NEW_CHAT:{
    icon:PiChatsCircleBold
  }
};

const NotificationIcon = ({ type }) => {
  // Get the corresponding icon and color based on the type
  const { icon: Icon } = notificationIcons[type] || {
    icon: FaRegBell
  };

  // If no valid type is provided, return null or a default icon
  if (!Icon) return null; // Or use a default icon if you prefer
  
  return (
    <div style={{  background:"#eff3f4" }} className='min-w-10 min-h-10 rounded-full flex justify-center items-center text-dark1'>
      <Icon size={20} />
    </div>
  );
};

export default NotificationIcon;
