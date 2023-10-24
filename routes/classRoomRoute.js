const authServices = require("../services/authServices");
const {
  createClassRoom,
  getAllClassRooms,
  getSpecificClassRoom,
  updateSpecificClassRoom,
  deleteSpecificSchool,
  createFilterObject,
  setSchoolIdToBody,
} = require("../services/classRoomServices");
const {
  createClassRoomValidator,
  getSpecificClassRoomValidator,
  updateSpecificClassRoomValidator,
  deleteSpecificClassRoomValidator,
} = require("../utils/validators/classRoomValidator");

const studentRoute = require("./studentRoute");

const router = require("express").Router({ mergeParams: true });

router.use("/:classRoomId/students", studentRoute);

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
  setSchoolIdToBody,
  createClassRoomValidator,
  createClassRoom
);
router.get(
  "/",
  authServices.protect,
  authServices.allowTo("superAdmin", "admin"),
  createFilterObject,
  getAllClassRooms
);
router.get(
  "/:id",
  authServices.protect,
  authServices.allowTo("superAdmin", "admin"),
  getSpecificClassRoomValidator,
  getSpecificClassRoom
);
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  updateSpecificClassRoomValidator,
  updateSpecificClassRoom
);
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("admin"),
  deleteSpecificClassRoomValidator,
  deleteSpecificSchool
);

module.exports = router;
