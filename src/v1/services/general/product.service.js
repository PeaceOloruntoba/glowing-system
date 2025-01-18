import ApiError from "../../../utils/apiError.js";
import DesignerProfile from "../../models/designerProfile.model.js";
import Product from "../../models/product.model.js";

export default {
  getAllProducts: async function () {
      const result = await Product.find();
    // Map over bookings to fetch additional user details
    const products = await Promise.all(
      result.map(async (booking) => {
        const designerProfile = await DesignerProfile.findOne({ userId: booking.designerId });
        const businessName = designerProfile?.businessName;
        return {
          ...booking.toObject(),
          businessName,
        };
      })
   );
   return products;

  },

  getProductById: async function (productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    return product;
  },
};