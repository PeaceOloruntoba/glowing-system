import designerService from "../services/designer.service.js";

export default {
  createProduct: async function (req, res, next) {
    try {
      const designerId = req.user._id;
      const productData = req.body;
      const images = req.files?.images || [];
      const product = await designerService.createProduct(designerId, productData, images);
      res.status(201).json({ success: true, message: "Product created", data: product });
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async function (req, res, next) {
    try {
      const productId = req.params.id;
      const productData = req.body;
      const images = req.files?.images || [];
      const updatedProduct = await designerService.updateProduct(productId, productData, images);
      res.status(200).json({ success: true, message: "Product updated", data: updatedProduct });
    } catch (error) {
      next(error);
    }
  },

  getAllProducts: async function (req, res, next) {
    try {
      const products = await designerService.getAllProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  getProductById: async function (req, res, next) {
    try {
      const productId = req.params.id;
      const product = await designerService.getProductById(productId);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  getProductsByDesignerId: async function (req, res, next) {
    try {
      const designerId = req.params.designerId;
      const products = await designerService.getProductsByDesignerId(designerId);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async function (req, res, next) {
    try {
      const productId = req.params.id;
      await designerService.deleteProduct(productId);
      res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  },
};
