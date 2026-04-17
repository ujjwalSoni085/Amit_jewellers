const { body } = require("express-validator");

exports.createProductRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("weight")
    .notEmpty()
    .withMessage("Weight is required")
    .isFloat({ min: 0.1 })
    .withMessage("Weight must be a positive number"),

  body("metalType")
    .notEmpty()
    .withMessage("Metal type is required")
    .isIn(["gold", "silver"])
    .withMessage("Metal type must be either 'gold' or 'silver'"),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Product image is required")
    .isURL()
    .withMessage("Please upload a valid image file"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters"),
];

exports.updateProductRules = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("weight")
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage("Weight must be a positive number"),

  body("metalType")
    .optional()
    .isIn(["gold", "silver"])
    .withMessage("Metal type must be either 'gold' or 'silver'"),

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Please provide a valid image URL"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
];
