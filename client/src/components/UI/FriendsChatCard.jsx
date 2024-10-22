import { Link } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import PropTypes from "prop-types";
const FriendsChatCard = ({ user }) => {
  return (
    <div
      key={user?.username}
      className={`w-full py-3 px-5 flex justify-start items-start gap-2 hover:bg-line cursor-pointer`}
    >
      <div className="min-w-10 min-h-10 rounded-full flex justify-center items-center border border-primaryBorder bg-transPrimary">
        {!user?.imgUrl && <ProfileIcon fullName={user?.fullName} />}
        {user?.imgUrl && (
          <Link to={"/profile/" + user?.username}>
            <img
              src={user?.imgUrl}
              alt="profile"
              className="w-9 h-9 rounded-full"
            />
          </Link>
        )}
      </div>
      <div className="w-[calc(100%_-_52px)] ">
        <div className=" h-10 flex justify-between items-center  gap-[2px]">
          <div>
            <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
              {user?.fullName}
            </p>
            <p className="leading-4  text-mainText text-xs ">
              @{user?.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// Prop types validation
FriendsChatCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
  }).isRequired,
};

export default FriendsChatCard;
