import { Link } from "react-router-dom";
import ProfileIcon from "../ProfileIcon";
import PropTypes from "prop-types";

const LineProfileCard = ({ key, user }) => {
  return (
    <Link
      to={"/profile/" + user?.username}
      key={key}
      className="w-full py-3 px-6 flex justify-start items-center gap-2 hover:bg-line cursor-pointer"
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
      <div className="w-[calc(100%_-_52px)] h-10 flex justify-center items-start flex-col gap-[2px]">
        <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
          {user?.fullName}
        </p>
        <p className="leading-4  text-mainText text-xs">@{user?.username}</p>
      </div>
    </Link>
  );
};
// Prop types validation
LineProfileCard.propTypes = {
  key: PropTypes.number.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
  }).isRequired,
};
export default LineProfileCard;
