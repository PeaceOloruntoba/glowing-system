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
import { designerValidator } from "../../validators/designer.validator.js";

const router = express.Router();

router
  .route("/")
  .get(isAuth, getUser)
  //   .patch(auth, updateUser)
  //   .delete(auth, deleteUser)
  .all(methodNotAllowed);
router
  .route("/designer-profile")
  .get(isAuth, getDesignerProfile)
  //   .patch(auth, updateUser)
  //   .delete(auth, deleteUser)
  .all(methodNotAllowed);
router.route("/signup").post(userValidator, register).all(methodNotAllowed);
router.route("/reset-password").post(resetPassword).all(methodNotAllowed);

export default router;
