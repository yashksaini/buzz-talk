import ProfileIcon from "../ProfileIcon";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const ChatCard = ({ user, lastMessage, updatedAt, chatId }) => {
  const navigate = useNavigate();
  return (
    <div
      key={user?.username}
      className={`w-full py-3 px-5 flex justify-start items-start gap-2 hover:bg-line cursor-pointer`}
      onClick={() => {
        navigate(`/chats/${chatId}`);
      }}
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
          <div>
            <p className="leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-dark1 font-semibold ">
              {user?.fullName}{" "}
              <span className="text-xs font-normal text-dark2 ml-2">
                {formatDistanceToNow(updatedAt, { addSuffix: true })}
              </span>
            </p>
            <p className="leading-4  text-mainText text-xs ">
              @{user?.username}
            </p>
          </div>
          <div>{lastMessage}</div>
        </div>
      </div>
    </div>
  );
};
// Prop types validation
ChatCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
  }).isRequired,
  lastMessage: PropTypes.string,
  updatedAt: PropTypes.any,
  chatId: PropTypes.string,
};

export default ChatCard;
