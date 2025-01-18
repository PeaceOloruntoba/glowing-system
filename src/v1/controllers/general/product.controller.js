import productService from "../../services/designer/product.service.js";

export const getProducts = async function (req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async function (req, res, next) {
  try {
    const productId = req.params.productId;
    const product = await productService.getProductById(productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
