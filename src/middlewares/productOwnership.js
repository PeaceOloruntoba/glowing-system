import Product from "../v1/models/product.model.js";
import ApiError from "../utils/apiError.js";
import Client from "../v1/models/client.model.js";

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

export const checkClientOwnership = async (req, res, next) => {
  const { userId } = req.user;
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      throw ApiError.notFound("Product not found");
    }

    if (client.designerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this client",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
