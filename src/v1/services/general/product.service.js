import ApiError from "../../../utils/apiError.js";
import Product from "../../models/product.model.js";

export default {
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
}