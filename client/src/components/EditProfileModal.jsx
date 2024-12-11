/* eslint-disable react/prop-types */
import { IoCloseOutline } from "react-icons/io5";
import { TbCameraPlus } from "react-icons/tb";
import { sharedStyles } from "../sharedStyles/utils";
import { useState } from "react";
import ImageCropper from "./ImageCropper";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { GrClose } from "react-icons/gr";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants/constants";
import { resizeImage } from "./utils";
const EditProfileModal = ({ setModalType, user, setIsUpdated }) => {
  const { userId } = useSelector((state) => state.userAuth);
  const initialData = {
    fullName: user?.fullName,
    about: user?.about || "",
    status: user?.status || "",
    profile: user?.imgUrl,
    banner: user?.banner,
    userId: userId,
    miniImg: user?.miniImg || "",
  };
  const [form, setForm] = useState(initialData);
  const [isCropper, setIsCropper] = useState(false);
  const [title, setTitle] = useState("");
  const [cropImg, setCropImg] = useState();
  const [ratio, setRatio] = useState(1);
  const handleFileInput = (e, title, ratio) => {
    e.preventDefault();

    // Now user able to select the same image again
    if (e.target && e.target.type === "file") {
      e.target.addEventListener("click", () => {
        e.target.value = null;
      });
    }

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImg(reader.result);
    };
    reader.readAsDataURL(files[0]);
    // Open the cropper modal
    setIsCropper(true);
    setTitle(title); // Set the title of the modal
    setRatio(ratio); // Set the ratio for cropping image
  };
  // For updating profile picture
  const profileImgInput = (e) => {
    handleFileInput(e, "Profile Picture", 1);
  };
  // For updating banner image
  const profileBannerInput = (e) => {
    handleFileInput(e, "Banner", 3);
  };
  // For updating data from cropper to form
  const updateImage = async (type, image) => {
    if (type === "profile") {
      const miniImg = await resizeImage(image, 36, 36);
      const profileImg = await resizeImage(image, 136, 136);
      setForm({ ...form, miniImg: miniImg, profile: profileImg });
    } else if (type === "banner") {
      const bannerImg = await resizeImage(image, 600, 200);
      setForm({ ...form, banner: bannerImg });
    }
  };
  const saveProfie = async () => {
    if (form.fullName.trim().length < 4) {
      toast.info("Name: Minimum 4 characters", {
        autoClose: 1000,
        toastId: "name-info",
        hideProgressBar: true,
      });
      return;
    }
    if (form.status.trim().length < 4) {
      toast.info("Status: Minimum 4 characters", {
        autoClose: 1000,
        toastId: "status-info",
        hideProgressBar: true,
      });
      return;
    }
    if (form.status.length > 30) {
      toast.info("Status: Maximum 30 characters", {
        autoClose: 1000,
        toastId: "status-info",
        hideProgressBar: true,
      });
      return;
    }
    toast.success("Updating Profile...", {
      autoClose: false,
      toastId: "update-process",
      hideProgressBar: true,
    });
    try {
      const { data } = await axios.post(`${BASE_URL}/update-profile`, form);
      if (data.success) {
        toast.update("update-process", {
          render: data.message,
          autoClose: 1000,
          toastId: "update-success",
          hideProgressBar: true,
        });
        // Close the edit modal
        setModalType("");
        setIsUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
      toast.update("update-process", {
        autoClose: 1000,
        toastId: "update-process",
        render: "Error updating profile",
        hideProgressBar: true,
        type: toast.TYPE.ERROR,
      });
    }
  };
  return (
    <>
      <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-30 sm:p-8 p-2 flex justify-center items-center">
        <div className="max-w-full w-[600px] bg-white rounded-xl h-[650px] max-h-full overflow-hidden ">
          <div className="w-full h-[650px] max-h-full overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center h-14 w-full sticky top-0 left-0 bg-white border-b z-50 px-3">
              <div className="flex justify-start items-center flex-1 gap-2 text-dark1">
                <button
                  onClick={() => setModalType("")}
                  className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
                >
                  <IoCloseOutline className="text-2xl" />
                </button>
                <h1 className="font-bold text-[20px] ">Edit Profile</h1>
              </div>
              <button
                className="h-9 px-6 flex justify-center items-center bg-dark2 text-white rounded-full font-semibold"
                onClick={saveProfie}
              >
                Save
              </button>
            </div>
            {/* Modal Body */}
            <div className="w-full">
              <div className="aspect-[3/1] w-full bg-slate-200 relative mb-16">
                {form?.banner && (
                  <img
                    src={form?.banner}
                    alt="Banner"
                    className="absolute z-[5] w-full h-auto top-0 left-0 "
                  />
                )}
                <div className="z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center gap-2">
                  <label
                    htmlFor="bannerImg"
                    className="w-12 h-12 bg-[rgba(0,0,0,0.6)] flex justify-center items-center text-white  rounded-full cursor-pointer hover:bg-[rgba(0,0,0,0.8)]"
                    data-tooltip-id="banner-tip"
                  >
                    <TbCameraPlus />
                  </label>
                  {form?.banner && (
                    <span
                      className="w-12 h-12 bg-[rgba(0,0,0,0.6)] flex justify-center items-center text-white  rounded-full cursor-pointer hover:bg-[rgba(0,0,0,0.8)]"
                      data-tooltip-id="remove-tip"
                      onClick={() => {
                        setForm({ ...form, banner: "" });
                      }}
                    >
                      <GrClose />
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  id="bannerImg"
                  className="hidden"
                  onChange={profileBannerInput}
                  accept="image/*"
                />
                <ReactTooltip
                  id="banner-tip"
                  place="bottom"
                  content="Add Banner"
                  style={{
                    zIndex: "500",
                  }}
                />
                <ReactTooltip
                  id="remove-tip"
                  place="bottom"
                  content="Remove Banner"
                  style={{
                    zIndex: "500",
                  }}
                />
                <div className="z-10 absolute sm:bottom-[-64px] bottom-[-48px] left-8 sm:w-32 sm:h-32 w-24 h-24  border-white border-2 rounded-full bg-slate-300 ">
                  {form?.profile && (
                    <img
                      src={form?.profile}
                      alt="Profile"
                      className="absolute z-20 sm:w-32 sm:h-32 w-24 h-24 top-0 left-0 rounded-full"
                    />
                  )}
                  <label
                    htmlFor="profileImg"
                    className="w-12 h-12 bg-[rgba(0,0,0,0.6)] flex justify-center items-center text-white z-30 absolute top-[calc(50%_-_24px)] left-[calc(50%_-_24px)] rounded-full cursor-pointer hover:bg-[rgba(0,0,0,0.8)]"
                    data-tooltip-id="profile-tip"
                  >
                    <TbCameraPlus />
                  </label>
                  <input
                    type="file"
                    id="profileImg"
                    className="hidden"
                    onChange={profileImgInput}
                    accept="image/*"
                  />
                  <ReactTooltip
                    id="profile-tip"
                    place="bottom"
                    content="Add Photo"
                    style={{
                      zIndex: "500",
                    }}
                  />
                </div>
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
                    value={form?.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, about: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    placeholder="Enter your status"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isCropper && (
        <ImageCropper
          title={title}
          setIsCropper={setIsCropper}
          image={cropImg}
          ratio={ratio}
          updateImage={updateImage}
        />
      )}
    </>
  );
};

export default EditProfileModal;
