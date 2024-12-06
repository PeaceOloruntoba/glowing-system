import express from "express";
import methodNotAllowed from "../../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../../middlewares/auth.js";
import { productValidator } from "../../validators/product.validator.js";
import { checkDesignerRegistration } from "../../../middlewares/designerRegistration.js";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  getProductsByDesigner,
  deleteProduct,
} from "../../controllers/designer/product.controller.js";
import { checkProductOwnership } from "../../../middlewares/productOwnership.js";
import productImageUpload from "../../../middlewares/uploadFile.js";
import multerUpload from "../../../middlewares/multerUpload.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    isAuth,
    checkDesignerRegistration,
    productValidator,
    multerUpload,
    productImageUpload,
    createProduct
  )
  .all(methodNotAllowed);
router
  .route("/designer/:designerId")
  .get(isAuth, getProductsByDesigner)
  .all(methodNotAllowed);
router
  .route("/:productId")
  .get(getProductById)
  .patch(
    isAuth,
    checkDesignerRegistration,
    checkProductOwnership,
    productValidator,
    updateProduct
  )
  .delete(
    isAuth,
    checkDesignerRegistration,
    checkProductOwnership,
    deleteProduct
  )
  .all(methodNotAllowed);

export default router;
