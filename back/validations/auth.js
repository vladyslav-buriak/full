import { body } from "express-validator";

export const userDataValidate = [
  body("email").optional().isEmail().withMessage("Provide valid email"),
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("User name is required")
    .isString()
    .withMessage("User name should be string")
    .isLength({ min: 3 }),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters"),
  body("avatarUrl").optional().isURL(),
];
