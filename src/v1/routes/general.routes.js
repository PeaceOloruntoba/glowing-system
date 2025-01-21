import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import {
  getProducts,
  getProductById,
} from "../controllers/general/product.controller.js";
import { getDesignerById, getDesigners } from "../controllers/general/designer.controller.js";

const router = express.Router();

router.route("/products").get(getProducts).all(methodNotAllowed);
router.route("/products/:productId").get(getProductById).all(methodNotAllowed);
router.route("/designers").get(getDesigners).all(methodNotAllowed);
router.route("/designers/:designerId").get(getDesignerById).all(methodNotAllowed);

export default router