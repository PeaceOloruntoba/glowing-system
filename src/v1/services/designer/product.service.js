import ApiError from "../../../utils/apiError.js";
import Product from "../../models/product.model.js";

export default {
  createProduct: async function (designerId, productData, images, coverImage) {
    const {
      productName,
      description,
      price,
      size,
      location,
      discount,
      productCategoryId,
    } = productData;

    const product = await Product.create({
      designerId,
      productName,
      description,
      price,
      images, // These will already be URLs from multer's Cloudinary storage
      coverImage, // Cloudinary URL from multer
      discount,
      productCategoryId,
      size,
      location,
    });

    return product;
  },

  updateProduct: async function (productId, productData, images, coverImage) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    const updatedData = { ...productData };

    if (images && images.length > 0) {
      updatedData.images = images; // Replace old images if new ones are provided
    }

    if (coverImage) {
      updatedData.coverImage = coverImage; // Update cover image if provided
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
