import { body } from "express-validator";
import { handleValidationErrors } from "../../middlewares/error.js";

export const clientValidator = [
  body("clientName")
    .exists()
    .withMessage("Business Name is required")
    .isLength({ min: 3 })
    .withMessage("Please provide a valid Business Name"),

  body("measurements")
    .exists()
    .withMessage("Full name is required")
    .isLength(11)
    .withMessage("Please provide a valid phone number"),
    
  handleValidationErrors,
];
