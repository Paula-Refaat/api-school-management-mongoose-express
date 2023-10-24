const authServices = require("../services/authServices");
const {
  createStudent,
  getAllStudents,
  getSpecificStudent,
  updateSpecificStudent,
  deleteSpecificStudent,
  createFilterObject,
  setClassRoomIdToBody,
} = require("../services/studentServices");
const {
  createStudentValidator,
  getSpecificStudentValidator,
  updateSpecificStudentValidator,
  deleteSpecificStudentValidator,
} = require("../utils/validators/studentValidator");

const router = require("express").Router({ mergeParams: true });

router.post(
  "/",
  authServices.protect,
  authServices.allowTo("admin"),
  setClassRoomIdToBody,
  createStudentValidator,
  createStudent
);
router.get("/", createFilterObject, getAllStudents);
router.get("/:id", getSpecificStudentValidator, getSpecificStudent);
router.put(
  "/:id",
  authServices.protect,
  authServices.allowTo("Admin"),
  updateSpecificStudentValidator,
  updateSpecificStudent
);

router.delete(
  "/:id",
  authServices.protect,
  authServices.allowTo("Admin"),
  deleteSpecificStudentValidator,
  deleteSpecificStudent
);

module.exports = router;
