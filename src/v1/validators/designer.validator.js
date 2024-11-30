import { body } from "express-validator";
import { handleValidationErrors } from "../../middlewares/error.js";

export const designerValidator = [
  body("businessName")
    .exists()
    .withMessage("Business Name is required")
    .isLength({ min: 3 })
    .withMessage("Please provide a valid Business Name"),

  body("phoneNumber")
    .exists()
    .withMessage("Full name is required")
    .isLength(11)
    .withMessage("Please provide a valid phone number"),

  body("yearsOfExperience")
    .exists()
    .withMessage("password is required")
    .isInt({ min: 0 })
    .withMessage("Years of Experience must be a non-negative number"),

  body("businessAddress")
    .exists()
    .withMessage("Business Address is required")
    .isString()
    .withMessage("Business Address must be a string"),

  body("bank")
    .exists()
    .withMessage("Bank is required")
    .isString()
    .withMessage("bank must be a string"),

  body("accountNumber")
    .exists()
    .withMessage("Account Number is required")
    .isLength(10)
    .withMessage("Please provide a valid account number"),

  handleValidationErrors,
];
