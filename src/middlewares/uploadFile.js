import cloudinary from "../config/cloudinaryConfig.js";

const uploadImagesToCloudinary = async (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error("No images provided for upload.");
  }

  const uploadPromises = images.map((image) => {
    console.log(image)
    if (typeof image === "string") {
      // Assuming the image is a valid file path or URL
      return cloudinary.uploader.upload(image, {
        folder: "kunibi/products",
      });
    } else if (image.path) {
      // For files uploaded via multer
      return cloudinary.uploader.upload(image.path, {
        folder: "kunibi/products",
      });
    } else {
      throw new Error("Invalid image format. Must be a path or multer file object.");
    }
  });

  const uploadedImages = await Promise.all(uploadPromises);
  return uploadedImages.map((file) => file.secure_url);
};

export default uploadImagesToCloudinary;
