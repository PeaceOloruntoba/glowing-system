import cloudinary from "../config/cloudinaryConfig.js";

const uploadImagesToCloudinary = async (images) => {
  const uploadPromises = images.map((image) =>
    cloudinary.uploader.upload(image, {
      folder: `${cloudinary.config().default_folder}/products`,
    })
  );
  const uploadedImages = await Promise.all(uploadPromises);
  return uploadedImages.map((file) => file.secure_url);
};

export default uploadImagesToCloudinary;
