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
} from "../../controllers/product.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(isAuth, checkDesignerRegistration, productValidator, createProduct)
  .all(methodNotAllowed);
router
  .route("/designer/:designerId")
  .get(isAuth, getProductsByDesigner)
  .all(methodNotAllowed);
router
  .route("/:productId")
  .get(getProductById)
  .patch(isAuth, checkDesignerRegistration, productValidator, updateProduct)
  .delete(isAuth, checkDesignerRegistration, deleteProduct)
  .all(methodNotAllowed);

export default router;
