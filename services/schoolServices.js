const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const School = require("../models/schoolModel");
const ClassRoom = require("../models/classRoomModel");
const Student = require("../models/studentModel");

// @desc    Add School
// @route   POST /api/v1/schools
// @access  Private/protected (superAdmin only)
exports.createSchool = asyncHandler(async (req, res, next) => {
  const school = await School.create(req.body);
  res.status(201).json({ status: "Success", data: school });
});

// @desc    Get All Schools
// @route   GET /api/v1/schools
// @access  Private/protected (superAdmin only)
exports.getAllSchools = asyncHandler(async (req, res, next) => {
  const schools = await School.find({});
  res.status(200).json({ status: "success", data: schools });
});

// @desc    Get Specific School
// @route   GET /api/v1/schools
// @access  Private/protected (superAdmin only)
exports.getSpecificSchool = asyncHandler(async (req, res, next) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    return next(new ApiError(`No school for this id : ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success", data: school });
});

// @desc    Update Specific School
// @route   PUT /api/v1/schools/:id
// @access  Private/protected (superAdmin only)
exports.updateSpecificSchool = asyncHandler(async (req, res, next) => {
  const updatedSchool = await School.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updatedSchool) {
    return next(new ApiError(`No school for this id : ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success", data: updatedSchool });
});

// @desc    Delte Specific School
// @route   DELETE /api/v1/schools/:id
// @access  Private/protected (superAdmin only)
exports.deleteSpecificSchool = asyncHandler(async (req, res, next) => {
  let session = null;
  session = await mongoose.startSession();
  session.startTransaction();
  try {
    const school = await School.findByIdAndDelete(req.params.id).session(
      session
    );
    if (!school) {
      return next(
        new ApiError(`No school found for this id: ${req.params.id}`, 404)
      );
    }
    const classRooms = await ClassRoom.find({
      school: school._id,
    }).session(session);

    classRooms.forEach(async (classRoom) => {
      await Student.deleteMany({ classRoom: classRoom._id }).session(session);
    });

    await ClassRoom.deleteMany({
      school: school._id,
    }).session(session);

    console.log(classRooms);

    await session.commitTransaction();

    session.endSession();
    res.status(204).send();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});
