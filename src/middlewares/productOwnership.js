import Product from "../v1/models/product.model.js";
import ApiError from "../utils/apiError.js";

export const checkProductOwnership = async (req, res, next) => {
  const { userId } = req.user;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    if (product.designerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
