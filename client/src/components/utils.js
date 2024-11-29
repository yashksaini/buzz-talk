// Create a canvas for resizing
export const resizeImage = (src, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8)); // Resized image as Data URL
      };
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };