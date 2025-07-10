import cloudinary from "../config/cloudinaryConfig.js";

const productImageUpload = async (req, res, next) => {
  try {
    const uploadedImagesUrls = {};


    if (req.files && req.files.images) {

      const imagesArray = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const imageUploadPromises = imagesArray.map((file) =>
        cloudinary.uploader.upload(file.tempFilePath, {
          folder: "kunibi/products",


        })
      );

      const uploadedImages = await Promise.all(imageUploadPromises);
      uploadedImagesUrls.images = uploadedImages.map((file) => file.secure_url);
    }


    if (req.files && req.files.coverImage) {

      const coverImageFilesArray = Array.isArray(req.files.coverImage)
        ? req.files.coverImage
        : [req.files.coverImage];


      const coverImageFile = coverImageFilesArray[0];

      if (coverImageFile) {
        const coverImageUploadResult = await cloudinary.uploader.upload(
          coverImageFile.tempFilePath,
          {
            folder: "kunibi/products",

          }
        );
        uploadedImagesUrls.coverImage = coverImageUploadResult.secure_url;
      }
    }


    if (
      !uploadedImagesUrls.images ||
      uploadedImagesUrls.images.length === 0 ||
      !uploadedImagesUrls.coverImage
    ) {
      console.log("No images or cover image were successfully uploaded.");





    }


    req.uploadedImagesUrls = uploadedImagesUrls;


    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res
      .status(500)
      .json({ error: "Error uploading images to Cloudinary." });
  }
};

export default productImageUpload;