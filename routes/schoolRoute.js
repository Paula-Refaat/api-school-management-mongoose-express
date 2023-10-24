const {
  createSchool,
  getAllSchools,
  getSpecificSchool,
  updateSpecificSchool,
  deleteSpecificSchool,
} = require("../services/schoolServices");
const {
  createSchoolValidator,
  getSpecificSchoolValidator,
  updateSpecificSchoolValidator,
  deleteSpecificSchoolValidator,
} = require("../utils/validators/schoolValidator");

const authServices = require("../services/authServices");

const classRoomRoute = require("./classRoomRoute");

const router = require("express").Router();

router.use("/:schoolId/classRooms", classRoomRoute);

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("superAdmin"),
  createSchoolValidator,
  createSchool
);
router.get("/", getAllSchools);
router.get("/:id", getSpecificSchoolValidator, getSpecificSchool);
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("superAdmin"),
  updateSpecificSchoolValidator,
  updateSpecificSchool
);

router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("superAdmin"),
  deleteSpecificSchoolValidator,
  deleteSpecificSchool
);

module.exports = router;
