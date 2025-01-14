import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../middlewares/auth.js";
import { productValidator } from "../validators/product.validator.js";
import { checkDesignerRegistration } from "../../middlewares/designerRegistration.js";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  getProductsByDesigner,
  deleteProduct,
} from "../controllers/designer/product.controller.js";
import { checkProductOwnership } from "../../middlewares/productOwnership.js";
import productImageUpload from "../../middlewares/uploadFile.js";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClientById,
  updateClient,
} from "../controllers/designer/client.controller.js";
import { clientValidator } from "../validators/client.validator.js";
import { getAllBookings, updateBooking } from "../controllers/designer/booking.controller.js";

const router = express.Router();

router
  .route("/product")
  .get(getProducts)
  .post(
    isAuth,
    checkDesignerRegistration,
    productValidator,
    productImageUpload,
    createProduct
  )
  .all(methodNotAllowed);
router
  .route("/designerProduct/:designerId")
  .get(isAuth, getProductsByDesigner)
  .all(methodNotAllowed);
router
  .route("/product/:productId")
  .get(getProductById)
  .patch(
    isAuth,
    checkDesignerRegistration,
    checkProductOwnership,
    productImageUpload,
    updateProduct
  )
  .delete(
    isAuth,
    checkDesignerRegistration,
    checkProductOwnership,
    deleteProduct
  )
  .all(methodNotAllowed);
router
  .route("/client")
  .get(isAuth, getAllClients)
  .post(isAuth, checkDesignerRegistration, clientValidator, createClient)
  .all(methodNotAllowed);
router
  .route("/client/:clientId")
  .get(isAuth, checkDesignerRegistration, getClientById)
  .patch(isAuth, checkDesignerRegistration, updateClient)
  .delete(isAuth, checkDesignerRegistration, deleteClient)
  .all(methodNotAllowed);
router
  .route("/booking")
  .get(isAuth, checkDesignerRegistration, getAllBookings)
  .all(methodNotAllowed);
router
  .route("/booking/:bookingId")
  .get(isAuth, checkDesignerRegistration)
  .patch(isAuth, checkDesignerRegistration, updateBooking)
  .all(methodNotAllowed);

export default router;
