import { body, check } from "express-validator";
import { handleValidationErrors } from "../../middlewares/error.js";

export const productValidator = [
  body("productCategoryId")
    .exists()
    .withMessage("Product Category is required")
    .isInt({ min: 1, max: 4 })
    .withMessage("Product Category can only be 1, 2, 3, or 4."),

  body("productName")
    .exists()
    .withMessage("Product Name is required")
    .isString()
    .withMessage("Product Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Product Name must be at least 3 characters long"),

  body("description")
    .exists()
    .withMessage("Product Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("price")
    .exists()
    .withMessage("Product Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid number greater than or equal to 0"),

  body("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be a valid number greater than or equal to 0"),

  body("size")
    .exists()
    .withMessage("Product Size is required")
    .isString()
    .withMessage("Size must be a string")
    .isIn(["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"])
    .withMessage("Size must be one of XXS, XS, S, M, L, XL, XXL, XXXL"),

  body("location")
    .exists()
    .withMessage("Product Location is required")
    .isString()
    .withMessage("Location must be a string"),

  // check("images")
  //   .custom((value, { req }) => {
  //     if (!req.files || !req.files.images || req.files.images.length === 0) {
  //       throw new Error("At least one product image is required");
  //     }
  //     if (req.files.images.length > 5) {
  //       throw new Error("You can upload up to 5 images only");
  //     }
  //     return true;
  //   }),

  // check("coverImage")
  //   .custom((value, { req }) => {
  //     if (!req.files || !req.files.coverImage) {
  //       throw new Error("Cover Image is required");
  //     }
  //     return true;
  //   }),

  handleValidationErrors,
];
