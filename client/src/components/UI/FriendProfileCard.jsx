import { Link } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import PropTypes from "prop-types";
import { BsThreeDots } from "react-icons/bs";
const FriendProfileCard = ({ user }) => {
  return (
    <Link
      to={"/profile/" + user?.username}
      key={user?.username}
      className="w-full py-3 px-6 flex justify-start items-start gap-2 hover:bg-line cursor-pointer"
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
          <div className="flex-1">
            <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
              {user?.fullName}
            </p>
            <p className="leading-4  text-mainText text-xs">
              @{user?.username}
            </p>
          </div>
          <div className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-background">
            <BsThreeDots />
          </div>
        </div>
        <p className="text-xs text-dark1 mt-1">
          {user?.about?.substring(0, 150)}
          {user?.about?.length > 150 ? "..." : ""}
        </p>
      </div>
    </Link>
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
