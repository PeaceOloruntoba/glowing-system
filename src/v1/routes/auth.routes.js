import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import {
  forgotPassword,
  getDesignerProfile,
  getUser,
  login,
  register,
  registerDesigner,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { isAuth } from "../../middlewares/auth.js";
import { userValidator } from "../validators/user.validator.js";

const router = express.Router();

router
  .route("/")
  .get(isAuth, getUser)
  .all(methodNotAllowed);
router
  .route("/designer-profile")
  .get(isAuth, getDesignerProfile)
  .all(methodNotAllowed);
router.route("/signup").post(userValidator, register).all(methodNotAllowed);
router.route("/signin").post(login).all(methodNotAllowed);
router.route("/send-otp").post(sendOTP).all(methodNotAllowed);
router.route("/verify-otp").post(verifyOTP).all(methodNotAllowed);
router.route("/forgot-password").post(forgotPassword).all(methodNotAllowed);
router.route("/reset-password").post(resetPassword).all(methodNotAllowed);
router
  .route("/designer-register")
  .post(isAuth, registerDesigner)
  .all(methodNotAllowed);

export default router;
