import cloudinary from "../config/cloudinaryConfig.js";

const uploadImagesToCloudinary = async (req, res, next) => {
  try {
    const imageFields = {
      // Assuming the array of images is uploaded under 'imagesArray' and a single image under 'singleImage'
      arrayField: "imagesArray", 
      singleField: "singleImage",
    };

    const uploadPromises = [];

    // Handling array of images (if any)
    if (req.files && req.files[imageFields.arrayField]) {
      const imagesArray = req.files[imageFields.arrayField];

      if (Array.isArray(imagesArray)) {
        imagesArray.forEach((file) => {
          uploadPromises.push(
            cloudinary.uploader.upload(file.path, {
              folder: "kunibi/products",
            })
          );
        });
      } else {
        uploadPromises.push(
          cloudinary.uploader.upload(imagesArray.path, {
            folder: "kunibi/products",
          })
        );
      }
    }

    // Handling single image (if any)
    if (req.files && req.files[imageFields.singleField]) {
      const singleImage = req.files[imageFields.singleField];

      if (Array.isArray(singleImage)) {
        singleImage.forEach((file) => {
          uploadPromises.push(
            cloudinary.uploader.upload(file.path, {
              folder: "kunibi/products",
            })
          );
        });
      } else {
        uploadPromises.push(
          cloudinary.uploader.upload(singleImage.path, {
            folder: "kunibi/products",
          })
        );
      }
    }

    // If no images were provided, return an error
    if (uploadPromises.length === 0) {
      return res.status(400).json({ error: "No images provided for upload." });
    }

    // Wait for all uploads to finish
    const uploadedImages = await Promise.all(uploadPromises);

    // Attach uploaded image URLs to the request for further use (e.g., creating a product)
    req.uploadedImagesUrls = uploadedImages.map((file) => file.secure_url);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error uploading images to Cloudinary." });
  }
};

export default uploadImagesToCloudinary;
