// eslint-disable-next-line react/prop-types
const EditProfileModal = ({ setModalType }) => {
  return (
    <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-20 p-8 ">
      <div className="max-w-full w-[600px] bg-white rounded-xl max-h-[60%] overflow-x-hidden overflow-y-auto m-auto min-h-[400px] p-8">
        <p>Modal</p>
        <button onClick={() => setModalType("")}>Close</button>
        <div className="h-[800px] w-full bg-slate-200"></div>
      </div>
    </div>
  );
};

export default EditProfileModal;
