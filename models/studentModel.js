const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Student name required"],
    trim: true,
    minlength: [3, "Too short Student name"],
    maxlength: [20, "Too long Student name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  age: {
    type: Number,
    required: [true, "Student age required"],
  },
  PhoneNumber: {
    type: String,
    unique: true,
  },
  classRoom: {
    type: mongoose.Schema.ObjectId,
    ref: "ClassRoom",
    required: [true, "Student must be belong to ClassRoom"],
  },
});

StudentSchema.pre(/^find/, function (next) {
  this.populate({ path: "classRoom", select: "name" });
  next();
});

module.exports = mongoose.model("Student", StudentSchema);
