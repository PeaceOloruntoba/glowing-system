import Product from "../models/product.model.js";
import ApiError from "../../utils/apiError.js";
import uploadImagesToCloudinary from "../../../middlewares/uploadFile.js";

export default {
  createProduct: async function (designerId, productData, images) {
    const { category, productName, description, price, coverImage, size, location, discount } = productData;
    const uploadedImages = await uploadImagesToCloudinary(images);
    const uploadedCoverImage = (await uploadImagesToCloudinary([coverImage]))[0];

    const product = await Product.create({
      designerId,
      category,
      productName,
      description,
      price,
      images: uploadedImages,
      coverImage: uploadedCoverImage,
      discount,
      size,
      location,
    });
    return product;
  },

  updateProduct: async function (productId, productData, images) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    const updatedData = { ...productData };

    if (images) {
      const uploadedImages = await uploadImagesToCloudinary(images);
      updatedData.images = uploadedImages;
    }

    Object.assign(product, updatedData);
    await product.save();
    return product;
  },

  getAllProducts: async function () {
    return await Product.find();
  },

  getProductById: async function (productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    return product;
  },

  getProductsByDesignerId: async function (designerId) {
    return await Product.find({ designerId });
  },

  deleteProduct: async function (productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    return product;
  },
};
