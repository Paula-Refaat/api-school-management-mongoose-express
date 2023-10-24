const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ClassRoom = require("../../models/classRoomModel");
const School = require("../../models/schoolModel");

exports.createStudentValidator = [
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

  check("age")
    .isNumeric()
    .withMessage("student Age must be a number")
    .notEmpty()
    .withMessage("student required"),

  check("PhoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone number must be egyption or saudian phone number only"),

  check("classRoom")
    .isMongoId()
    .withMessage("Invalid id format")
    .notEmpty()
    .withMessage("Student must be belong to ClassRoom")
    .custom(async (val, { req }) => {
      const classRoom = await ClassRoom.findById(val);
      if (!classRoom) {
        throw new Error(`No classRoom for this id : ${val}`);
      }
      const school = await School.findById(classRoom.school);
      let SchoolAdminsId = [];
      school.admins.forEach((admin) => {
        SchoolAdminsId.push(admin._id.toString());
      });
      if (!SchoolAdminsId.includes(req.user._id.toString())) {
        throw new Error(
          `You are not admin to the school that classRoom belongs to it`
        );
      }
    }),
  validatorMiddleware,
];

exports.getSpecificStudentValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateSpecificStudentValidator = [
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

  check("age")
    .optional()
    .isNumeric()
    .withMessage("student Age must be a number")
    .notEmpty()
    .withMessage("student required"),

  check("PhoneNumber")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone number must be egyption or saudian phone number only"),

  check("classRoom")
    .optional()
    .isMongoId()
    .withMessage("Invalid id format")
    .notEmpty()
    .withMessage("Student must be belong to ClassRoom")
    .custom(async (val, { req }) => {
      const classRoom = await ClassRoom.findById(val);
      if (!classRoom) {
        throw new Error(`No classRoom for this id : ${val}`);
      }
      const school = await School.findById(classRoom.school);
      let SchoolAdminsId = [];
      school.admins.forEach((admin) => {
        SchoolAdminsId.push(admin._id.toString());
      });
      if (!SchoolAdminsId.includes(req.user._id.toString())) {
        throw new Error(
          `You are not admin to the school that classRoom belongs to it`
        );
      }
    }),
  validatorMiddleware,
];

exports.deleteSpecificStudentValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
