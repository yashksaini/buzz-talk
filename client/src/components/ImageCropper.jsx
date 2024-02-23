/* eslint-disable react/prop-types */
import { createRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
const ImageCropper = ({ title, setIsCropper, image, ratio, updateImage }) => {
  const cropperRef = createRef();
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      if (ratio === 1) {
        updateImage(
          "profile",
          cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
        );
        setIsCropper(false);
      }
    }
  };
  return (
    <div className="w-full h-full bg-[rgba(0,0,0,0.40)] fixed top-0 left-0 z-20 p-8 flex justify-center items-center">
      <div className="max-w-full w-[600px] bg-slate-200 rounded-xl h-[650px] max-h-full overflow-hidden ">
        <div className="w-full h-[650px] max-h-full overflow-x-hidden overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center min-h-14 w-full sticky top-0 left-0 bg-white border-b z-50 px-3 ">
            <div className="flex justify-start items-center flex-1 gap-2 text-dark1">
              <button
                onClick={() => setIsCropper(false)}
                className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-line transition-all"
              >
                <IoMdArrowBack className="text-2xl" />
              </button>
              <h1 className="font-bold text-[20px] ">Edit {title}</h1>
            </div>
            <button
              className="h-9 px-6 flex justify-center items-center bg-dark2 text-white rounded-full font-semibold"
              onClick={getCropData}
            >
              Apply
            </button>
          </div>
          <div className="px-8 py-4 flex-1 justify-center items-center">
            <Cropper
              ref={cropperRef}
              src={image}
              style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                background: "rgb(226, 232, 240) !important",
                margin: "auto",
              }}
              zoomTo={0.5}
              zoomable={{
                wheelZoomRatio: 0.1, // Adjust the zoom ratio based on your preference
                minZoom: 1, // Disable zoom out
                maxZoom: 1, // Disable zoom in
              }}
              cropBoxMovable={true}
              cropBoxResizable={true}
              viewMode={1}
              aspectRatio={ratio}
              initialAspectRatio={ratio}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              guides={true}
              preview={false}
              dragMode="move" // Use 'move' for dragging without cropping
              scalable={false} // Disable scaling
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
