import productService from "../../services/designer/product.service.js";

export const createProduct = async function (req, res, next) {
  try {
    const designerId = req.user.userId;
    const productData = req.body;
    const images = req.uploadedImagesUrls?.images || [];
    const coverImage = req.uploadedImagesUrls?.coverImage || null;

    console.log(req.uploadedImagesUrls)

    const product = await productService.createProduct(
      designerId,
      productData,
      images,
      coverImage
    );
    res
      .status(201)
      .json({ success: true, message: "Product created", data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async function (req, res, next) {
  try {
    const productId = req.params.id;
    const productData = req.body;
    const images = req.files?.images?.map((file) => file.path) || [];
    const coverImage = req.files?.coverImage?.[0]?.path || null;

    const updatedProduct = await productService.updateProduct(
      productId,
      productData,
      images,
      coverImage
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Product updated",
        data: updatedProduct,
      });
  } catch (error) {
    next(error);
  }
};

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
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProductsByDesigner = async function (req, res, next) {
  try {
    const designerId = req.params.designerId;
    const products = await productService.getProductsByDesignerId(designerId);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async function (req, res, next) {
  try {
    const productId = req.params.id;
    await productService.deleteProduct(productId);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
