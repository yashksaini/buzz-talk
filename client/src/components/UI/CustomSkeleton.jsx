import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PropTypes from "prop-types";

const CustomSkeleton = ({ className }) => {
  return (
    <Skeleton
      highlightColor={"#F2F7FF"}
      className={`bg-slate-200 ${className}`}
    />
  );
};
CustomSkeleton.propTypes = {
  className: PropTypes.string,
};
export default CustomSkeleton;
