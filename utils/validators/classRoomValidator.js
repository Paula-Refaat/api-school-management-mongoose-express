const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const School = require("../../models/schoolModel");
const ClassRoom = require("../../models/classRoomModel");

exports.createClassRoomValidator = [
  check("name")
    .isString()
    .withMessage("ClassRoom name must be a string")
    .custom((name, { req }) => (req.body.slug = slugify(name)))
    .notEmpty()
    .withMessage("ClassRoom name required")
    .isLength({ min: 3 })
    .withMessage("Too short ClassRoom name")
    .isLength({ max: 20 })
    .withMessage("Too long ClassRoom name")
    .custom((val, { req }) =>
      ClassRoom.findOne({ name: val, school: req.body.school }).then(
        (classRoom) => {
          if (classRoom) {
            throw new Error(
              "This ClassRoom already exist in this school before"
            );
          }
        }
      )
    ),

  check("grade").notEmpty().withMessage("classRoom grade required"),
  check("capacity")
    .isNumeric()
    .withMessage("classRoom must be number")
    .notEmpty()
    .withMessage("classRoom capacity required"),

  check("school")
    .isMongoId()
    .withMessage("Invalid id format")
    .notEmpty()
    .withMessage("classRoom must belong to school")
    .custom((val, { req }) =>
      School.findById(val).then((school) => {
        let SchoolAdminsId = [];
        school.admins.forEach((admin) => {
          SchoolAdminsId.push(admin._id.toString());
        });
        if (!SchoolAdminsId.includes(req.user._id.toString())) {
          throw new Error("You are not admin of this school");
        }

        if (!school) {
          throw new Error("This school not found in our db");
        }
      })
    ),
  validatorMiddleware,
];

exports.getSpecificClassRoomValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateSpecificClassRoomValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  check("name")
    .optional()
    .isString()
    .withMessage("ClassRoom name must be a string")
    .custom((name, { req }) => (req.body.slug = slugify(name)))
    .notEmpty()
    .withMessage("ClassRoom name required")
    .isLength({ min: 3 })
    .withMessage("Too short ClassRoom name")
    .isLength({ max: 20 })
    .withMessage("Too long ClassRoom name")
    .custom(async (val, { req }) => {
      if (req.body.school) {
        await ClassRoom.findOne({ name: val, school: req.body.school }).then(
          (classRoom) => {
            if (classRoom) {
              throw new Error(
                "This ClassRoom already exist in this school before"
              );
            }
          }
        );
      } else {
        const classRoom = await ClassRoom.findOne({ name: val });
        if (classRoom) {
          const classRoomSchool = await ClassRoom.findById(req.params.id);
          if (
            classRoom.school.toString() === classRoomSchool.school.toString()
          ) {
            throw new Error(
              "This ClassRoom already exist in this school before"
            );
          }
        }
        return true;
      }
    }),

  check("grade").notEmpty().withMessage("classRoom grade required").optional(),
  check("capacity")
    .optional()
    .isNumeric()
    .withMessage("classRoom must be number")
    .notEmpty()
    .withMessage("classRoom capacity required"),

  check("school")
    .optional()
    .isMongoId()
    .withMessage("Invalid id format")
    .notEmpty()
    .withMessage("classRoom must belong to school")
    .custom((val, { req }) =>
      School.findById(val).then((school) => {
        let SchoolAdminsId = [];
        school.admins.forEach((admin) => {
          SchoolAdminsId.push(admin._id.toString());
        });
        if (!SchoolAdminsId.includes(req.user._id.toString())) {
          throw new Error("You are not admin of this school");
        }

        if (!school) {
          throw new Error("This school not found in our db");
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteSpecificClassRoomValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
