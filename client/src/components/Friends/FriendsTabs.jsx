import { friendsTabsList } from "../../Constants/friendsConstants";
import PropTypes from "prop-types";
const FriendsTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="grid grid-cols-4 border-b border-line h-14 mt-2">
      {Object.entries(friendsTabsList).map(([key, value]) => (
        <button
          key={key}
          onClick={() => {
            setActiveTab(value);
          }}
          className={`${
            activeTab === value ? "active-tab" : ""
          } hover:bg-line text-mainText`}
        >
          {value}
        </button>
      ))}
    </div>
  );
};
FriendsTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
export default FriendsTabs;
