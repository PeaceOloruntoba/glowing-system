import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  getProductsByDesigner,
  deleteProduct,
} from "../controllers/designer/product.controller.js";

