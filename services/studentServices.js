const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const Student = require("../models/studentModel");

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.classRoomId)
    filterObject = { classRoom: req.params.classRoomId };
  req.filterObj = filterObject;
  next();
};

exports.setClassRoomIdToBody = (req, res, next) => {
  if (!req.body.classRoom && req.params.classRoomId)
    req.body.classRoom = req.params.classRoomId;
  next();
};

// @desc    Add Student
// @route   POST /api/v1/students
// @access  Private/protected (Admin only)
exports.createStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.create(req.body);
  res.status(201).json({ status: "Success", data: student });
});

// @desc    Get All Student
// @route   GET /api/v1/students
// @access  Private/protected (Admin only)
exports.getAllStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find(req.filterObj);
  res.status(200).json({ status: "success", data: students });
});

// @desc    Get Specific Student
// @route   GET /api/v1/students
// @access  Private/protected (Admin only)
exports.getSpecificStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new ApiError(`No student for this id : ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success", data: student });
});

// @desc    Update Specific Student
// @route   PUT /api/v1/students/:id
// @access  Private/protected (Admin only)
exports.updateSpecificStudent = asyncHandler(async (req, res, next) => {
  const updatedstudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updatedstudent) {
    return next(new ApiError(`No student for this id : ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success", data: updatedstudent });
});

// @desc    Delte Specific Student
// @route   DELETE /api/v1/students/:id
// @access  Private/protected (Admin only)
exports.deleteSpecificStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return next(new ApiError(`No student for this id : ${req.params.id}`, 404));
  }
  res.status(204).send();
});
