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
import {
  acceptBooking,
  declineBooking,
  getAllBookings,
  getBookingById,
  markAsOutForDelivery,
} from "../controllers/designer/booking.controller.js";
import {
  handleSubscription,
  verifyPayment,
} from "../controllers/designer/subscription.controller.js";
import checkSubscription from "../../middlewares/designerSubscription.js";

const router = express.Router();

// router.post("/subscription/initialize", authMiddleware, handleSubscription);
// router.get("/verify/:reference", verifyPayment);
router
  .route("/subscription/initialize")
  .post(isAuth, checkDesignerRegistration, handleSubscription)
  .all(methodNotAllowed);
router
  .route("/subscription/verify/:reference")
  .get(isAuth, checkDesignerRegistration, verifyPayment)
  .all(methodNotAllowed);
router
  .route("/product")
  .get(getProducts)
  .post(
    isAuth,
    checkDesignerRegistration,
    checkSubscription,
    productValidator,
    productImageUpload,
    createProduct
  )
  .all(methodNotAllowed);
router
  .route("/designerProduct")
  .get(isAuth, checkSubscription, getProductsByDesigner)
  .all(methodNotAllowed);
router
  .route("/product/:productId")
  .get(getProductById)
  .patch(
    isAuth,
    checkDesignerRegistration,
    checkSubscription,
    checkProductOwnership,
    productImageUpload,
    updateProduct
  )
  .delete(
    isAuth,
    checkDesignerRegistration,
    checkSubscription,
    checkProductOwnership,
    deleteProduct
  )
  .all(methodNotAllowed);
router
  .route("/client")
  .get(isAuth, getAllClients)
  .post(
    isAuth,
    checkDesignerRegistration,
    checkSubscription,
    clientValidator,
    createClient
  )
  .all(methodNotAllowed);
router
  .route("/client/:clientId")
  .get(isAuth, checkDesignerRegistration, checkSubscription, getClientById)
  .patch(isAuth, checkDesignerRegistration, checkSubscription, updateClient)
  .delete(isAuth, checkDesignerRegistration, checkSubscription, deleteClient)
  .all(methodNotAllowed);
router
  .route("/booking")
  .get(isAuth, checkDesignerRegistration, checkSubscription, getAllBookings)
  .all(methodNotAllowed);
router
  .route("/booking/:bookingId")
  .get(isAuth, checkDesignerRegistration, checkSubscription, getBookingById)
  .all(methodNotAllowed);
router
  .route("/booking/:id/accept")
  .post(isAuth, checkDesignerRegistration, checkSubscription, acceptBooking)
  .all(methodNotAllowed);
router
  .route("/booking/:id/decline")
  .post(isAuth, checkDesignerRegistration, checkSubscription, declineBooking)
  .all(methodNotAllowed);
router
  .route("/booking/:id/out-for-delivery")
  .post(
    isAuth,
    checkDesignerRegistration,
    checkSubscription,
    markAsOutForDelivery
  )
  .all(methodNotAllowed);

export default router;
  