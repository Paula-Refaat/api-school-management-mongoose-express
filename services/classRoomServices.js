const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

const ClassRoom = require("../models/classRoomModel");
const Student = require("../models/studentModel");

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.schoolId) filterObject = { school: req.params.schoolId };
  req.filterObj = filterObject;
  next();
};

exports.setSchoolIdToBody = (req, res, next) => {
  if (!req.body.school && req.params.schoolId)
    req.body.school = req.params.schoolId;
  next();
};


// @desc    Add ClassRoom
// @route   POST /api/v1/classrooms
// @access  Private/protected (Admin only)
exports.createClassRoom = asyncHandler(async (req, res, next) => {
  const classRoom = await ClassRoom.create(req.body);
  res.status(201).json({ status: "Success", data: classRoom });
});

// @desc    Get All ClassRoom
// @route   GET /api/v1/classrooms
// @access  Private/protected (Admin only)
exports.getAllClassRooms = asyncHandler(async (req, res, next) => {
  const classRooms = await ClassRoom.find(req.filterObj);
  res.status(200).json({ status: "success", data: classRooms });
});

// @desc    Get Specific ClassRoom
// @route   GET /api/v1/classrooms
// @access  Private/protected (Admin only)
exports.getSpecificClassRoom = asyncHandler(async (req, res, next) => {
  const classRoom = await ClassRoom.findById(req.params.id);
  if (!classRoom) {
    return next(
      new ApiError(`No classRoom for this id : ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ status: "success", data: classRoom });
});

// @desc    Update Specific ClassRoom
// @route   PUT /api/v1/classrooms/:id
// @access  Private/protected (Admin only)
exports.updateSpecificClassRoom = asyncHandler(async (req, res, next) => {
  const updatedClassRoom = await ClassRoom.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!updatedClassRoom) {
    return next(
      new ApiError(`No ClassRoom for this id : ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ status: "success", data: updatedClassRoom });
});

// @desc    Delte Specific ClassRoom
// @route   DELETE /api/v1/classroom/:id
// @access  Private/protected (Admin only)
exports.deleteSpecificSchool = asyncHandler(async (req, res, next) => {
  let session = null;
  session = await mongoose.startSession();
  session.startTransaction();
  try {
    const classRoom = await ClassRoom.findByIdAndDelete(req.params.id).session(
      session
    );
    if (!classRoom) {
      return next(
        new ApiError(`No classRoom found for this id: ${req.params.id}`, 404)
      );
    }

    await Student.deleteMany({
      classRoom: classRoom._id,
    }).session(session);

    await session.commitTransaction();

    session.endSession();
    res.status(204).send();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});
