import PropTypes from "prop-types";
const NoDataFound = ({ title, desc }) => {
  return (
    <div className="w-[60%] mt-5 mx-auto">
      <h2 className="text-[32px] leading-8 font-bold text-dark1 mb-3">
        {title}
      </h2>
      <p className="text-mainText leading-5">{desc}</p>
    </div>
  );
};

NoDataFound.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
};

export default NoDataFound;
