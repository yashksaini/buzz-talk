/* eslint-disable react/prop-types */
import { IoCloseOutline } from "react-icons/io5";
import { sharedStyles } from "../sharedStyles/utils";
import { useState } from "react";
const EditProfileModal = ({ setModalType, user }) => {
  const initialData = {
    name: user?.fullName,
    about: user?.about,
    status: user?.status,
    dob: user?.dob,
    profile: user?.imgUrl,
    banner: user?.banner,
  };
  const [form, setForm] = useState(initialData);
  return (
    <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-20 p-8 flex justify-center items-center">
      <div className="max-w-full w-[600px] bg-white rounded-xl h-[650px] max-h-full overflow-hidden ">
        <div className="w-full h-[650px] max-h-full overflow-x-hidden overflow-y-auto">
          <div className="flex justify-between items-center h-14 w-full sticky top-0 left-0 bg-white border-b z-10 px-3">
            <div className="flex justify-start items-center flex-1 gap-2 text-dark1">
              <button
                onClick={() => setModalType("")}
                className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
              <h1 className="font-bold text-[20px] ">Edit Profile</h1>
            </div>
            <button className="h-9 px-6 flex justify-center items-center bg-dark2 text-white rounded-full font-semibold">
              Save
            </button>
          </div>
          {/* Modal Body */}
          <div className="w-full">
            <div className="aspect-[3/1] w-full bg-slate-200 relative mb-16">
              <div className="absolute bottom-[-64px] left-8 w-32 h-32  border-white border-2 rounded-full bg-slate-300"></div>
            </div>
            <form className="w-full pt-2 px-4 pb-8">
              <div className="mb-4">
                <label htmlFor="fullName" className={sharedStyles.label}>
                  Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className={sharedStyles.input}
                  value={form?.name}
                  // onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="about" className={sharedStyles.label}>
                  About
                </label>
                <textarea
                  className={
                    sharedStyles.input + " py-3 min-h-32 max-h-44 resize-none"
                  }
                  placeholder="About .. "
                  value={form?.about}
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className={sharedStyles.label}>
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  className={sharedStyles.input}
                  value={form?.status}
                  // onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your status"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className={sharedStyles.label}>
                  DOB
                </label>
                <input
                  type="date"
                  id="dob"
                  className={sharedStyles.input}
                  value={form?.dob}
                  // onChange={(e) => setFullName(e.target.value)}
                  placeholder="Select DOB"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
