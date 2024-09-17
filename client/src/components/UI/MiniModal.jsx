import PropTypes from "prop-types";
const MiniModal = ({
  closeModal,
  title,
  desc,
  actionBtnFun,
  actionBtnText,
}) => {
  return (
    <div className="w-full h-[100vh] bg-[rgb(0,0,0,0.4)] overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-[1000] flex justify-center items-center">
      <div className="w-80 h-auto p-8 bg-white rounded-2xl">
        <h1 className="text-[22px] font-bold text-dark1 mb-2">{title}</h1>
        <p className="text-base leading-[20px] text-mainText mb-2">{desc}</p>
        {actionBtnText && (
          <button
            className="w-full mt-4 h-11 bg-dark1 rounded-full text-white font-semibold"
            onClick={actionBtnFun}
          >
            {actionBtnText}
          </button>
        )}

        <button
          className="w-full mt-2 h-11 rounded-full border border-borderColor "
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Prop validation
MiniModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  actionBtnFun: PropTypes.func,
  actionBtnText: PropTypes.string.isRequired,
};

// Default props
MiniModal.defaultProps = {
  desc: "",
};

export default MiniModal;
