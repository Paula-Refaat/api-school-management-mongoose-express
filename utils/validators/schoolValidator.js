const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createSchoolValidator = [
  check("name")
    .isString()
    .withMessage("School name must be a string")
    .custom((name, { req }) => (req.body.slug = slugify(name)))
    .notEmpty()
    .withMessage("School name required")
    .isLength({ min: 3 })
    .withMessage("Too short school name")
    .isLength({ max: 20 })
    .withMessage("Too long school name"),

  check("location")
    .isString()
    .withMessage("School location must be a string")
    .notEmpty()
    .withMessage("School location required")
    .isLength({ min: 3 })
    .withMessage("Too short school location")
    .isLength({ max: 100 })
    .withMessage("Too long school location"),

  check("admins")
    .isMongoId()
    .withMessage("Invalid id format")
    .optional()
    .custom((adminsIds) =>
      User.find({
        _id: { $exists: true, $in: adminsIds },
      }).then((result) => {
        if (result.length < 1 || result.length != adminsIds.length) {
          return Promise.reject(new Error(`Invalid admins Ids`));
        }
      })
    ),
  validatorMiddleware,
];

exports.getSpecificSchoolValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateSpecificSchoolValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),

  check("name")
    .optional()
    .isString()
    .withMessage("School name must be a string")
    .custom((name, { req }) => (req.body.slug = slugify(name)))
    .notEmpty()
    .withMessage("School name required")
    .isLength({ min: 3 })
    .withMessage("Too short school name")
    .isLength({ max: 20 })
    .withMessage("Too long school name"),

  check("location")
    .optional()
    .isString()
    .withMessage("School location must be a string")
    .notEmpty()
    .withMessage("School location required")
    .isLength({ min: 3 })
    .withMessage("Too short school location")
    .isLength({ max: 100 })
    .withMessage("Too long school location"),

  check("admins")
    .optional()
    .isMongoId()
    .withMessage("Invalid id format")
    .optional()
    .custom((adminsIds) =>
      User.find({
        _id: { $exists: true, $in: adminsIds },
      }).then((result) => {
        if (result.length < 1 || result.length != adminsIds.length) {
          return Promise.reject(new Error(`Invalid admins Ids`));
        }
      })
    ),
  validatorMiddleware,
];
exports.deleteSpecificSchoolValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
