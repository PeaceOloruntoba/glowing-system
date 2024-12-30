import { body } from "express-validator";
import { handleValidationErrors } from "../../middlewares/error.js";

export const clientValidator = [
  body("clientName")
    .exists()
    .withMessage("Client name is required.")
    .isString()
    .withMessage("Client name must be a string.")
    .isLength({ min: 3 })
    .withMessage("Client name must be at least 3 characters long.")
    .trim(),

  body("measurements")
    .exists()
    .withMessage("Measurements are required.")
    .isArray({ min: 1 })
    .withMessage("Measurements must be an array with at least one item.")
    .custom((measurements) => {
      for (const measurement of measurements) {
        if (
          !measurement.name ||
          typeof measurement.name !== "string" ||
          measurement.name.trim().length === 0
        ) {
          throw new Error("Each measurement must have a valid name.");
        }
        if (typeof measurement.value !== "number" || measurement.value < 0) {
          throw new Error(
            "Each measurement must have a valid value greater than or equal to 0."
          );
        }
      }
      return true;
    }),

  handleValidationErrors,
];
