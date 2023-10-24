const mongoose = require("mongoose");

const ClassRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "ClassRoom name required"],
    trim: true,
    minlength: [3, "Too short ClassRoom name"],
    maxlength: [20, "Too long ClassRoom name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  grade: String,
  capacity: Number,

  school: {
    type: mongoose.Schema.ObjectId,
    ref: "School",
    required: [true, "ClassRoom must be belong to School"],
  },
});

ClassRoomSchema.pre(/^find/, function(next) {
  this.populate({path: "school", select: "name"});
  next();
});

module.exports = mongoose.model("ClassRoom", ClassRoomSchema);
