import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import { isAuth } from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/booking")
  .post(isAuth, )
  .get(isAuth, checkDesignerRegistration)
  .all(methodNotAllowed);
router
  .route("/booking/:bookingId")
  .get(isAuth, checkDesignerRegistration)
  .patch(isAuth, checkDesignerRegistration)
  .all(methodNotAllowed);

export default router;
