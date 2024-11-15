/* eslint-disable react/prop-types */
import { FaRegBell } from 'react-icons/fa';
import { FiUserCheck, FiUserPlus, FiUserX } from 'react-icons/fi';

// The notificationIcons mapping
const notificationIcons = {
  ACCEPTED: {
    icon: FiUserCheck,
    color: '#0EAA50',
  },
  REQUEST: {
    icon: FiUserPlus,
    color: '#165ddd',
  },
  REMOVED: {
    icon: FiUserX,
    color: '#f4212e',
  },
};

const NotificationIcon = ({ type }) => {
  // Get the corresponding icon and color based on the type
  const { icon: Icon, color } = notificationIcons[type] || {
    color: "#787f8a",
    icon: FaRegBell
  };

  // If no valid type is provided, return null or a default icon
  if (!Icon) return null; // Or use a default icon if you prefer
  
  return (
    <div style={{ color, background:color+10,borderColor:color }} className='min-w-10 min-h-10 rounded-full flex justify-center items-center border'>
      <Icon size={18} />
    </div>
  );
};

export default NotificationIcon;
