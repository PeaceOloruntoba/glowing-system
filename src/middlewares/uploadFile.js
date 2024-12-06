import cloudinary from "../config/cloudinaryConfig.js";

const productImageUpload = async (req, res, next) => {
  try {
    const uploadedImagesUrls = {};
    // Handle multiple images field (images) if present
    if (req.files && req.files.images) {
      const imagesArray = req.files.images;
      const imageUploadPromises = Array.isArray(imagesArray)
        ? imagesArray.map((file) =>
            cloudinary.uploader.upload(file.tempFilePath, {
              folder: "kunibi/products",
            })
          )
        : [
            cloudinary.uploader.upload(imagesArray.path, {
              folder: "kunibi/products",
            }),
          ];

      const uploadedImages = await Promise.all(imageUploadPromises);
      uploadedImagesUrls.images = uploadedImages.map((file) => file.secure_url);
    }

    // Handle single cover image field (coverImage) if present
    if (req.files && req.files.coverImage) {
      const coverImageFile = req.files.coverImage;
      const coverImageUpload = Array.isArray(coverImageFile)
        ? coverImageFile.map((file) =>
            cloudinary.uploader.upload(file.tempFilePath, {
              folder: "kunibi/products",
            })
          )
        : [
            cloudinary.uploader.upload(coverImageFile.tempFilePath, {
              folder: "kunibi/products",
            }),
          ];
      const uploadedCoverImage = await Promise.all(coverImageUpload);
      uploadedImagesUrls.coverImage = uploadedCoverImage.map(
        (file) => file.secure_url
      );
    }

    // If no images were provided, return an error
    if (!uploadedImagesUrls.images && !uploadedImagesUrls.coverImage) {
      console.log("No image uploaded");
    }

    // Attach uploaded image URLs to the request for further use (e.g., creating a product)
    req.uploadedImagesUrls = uploadedImagesUrls;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error uploading images to Cloudinary." });
  }
};

export default productImageUpload;
