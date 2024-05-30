import { Link } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import PropTypes from "prop-types";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
const FriendProfileCard = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionClick = (option) => {
    console.log(option);
    setIsDropdownOpen(false); // Close the dropdown after selecting an option
  };
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
    <div
      key={user?.username}
      className={`w-full py-3 px-6 flex justify-start items-start gap-2   ${
        isDropdownOpen ? "" : "hover:bg-line cursor-pointer"
      }`}
    >
      <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
        {!user?.imgUrl && <ProfileIcon fullName={user?.fullName} />}
        {user?.imgUrl && (
          <img
            src={user?.imgUrl}
            alt="profile"
            className="w-9 h-9 rounded-full"
          />
        )}
      </div>
      <div className="w-[calc(100%_-_52px)] ">
        <div className=" h-10 flex justify-between items-center  gap-[2px]">
          <Link to={"/profile/" + user?.username}>
            <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold hover:underline ">
              {user?.fullName}
            </p>
            <p className="leading-4  text-mainText text-xs hover:underline hover:underline-offset-2">
              @{user?.username}
            </p>
          </Link>
          <div className="relative" ref={dropdownRef}>
            <div
              className={`w-8 h-8 flex justify-center items-center rounded-full hover:bg-background ${
                isDropdownOpen ? "bg-background" : ""
              }`}
              onClick={toggleDropdown}
            >
              <BsThreeDots />
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 top-0 w-64 rounded-md shadow-lg bg-white border border-line">
                <div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick("Accept")}
                  >
                    Accept
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick("Reject")}
                  >
                    Reject
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick("Block")}
                  >
                    Block
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-dark1 mt-1">
          {user?.about?.substring(0, 150)}
          {user?.about?.length > 150 ? "..." : ""}
        </p>
      </div>
    </div>
  );
};
// Prop types validation
FriendProfileCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    about: PropTypes.string,
  }).isRequired,
};

export default FriendProfileCard;
