import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import {
  getProducts,
  getProductById,
} from "../controllers/general/product.controller.js";

const router = express.Router();

router.route("/products").get(getProducts).all(methodNotAllowed);
router.route("/products/:productId").get(getProductById).all(methodNotAllowed);

export default router