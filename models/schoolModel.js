const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "School name required"],
    trim: true,
    minlength: [3, "Too short school name"],
    maxlength: [20, "Too long school name"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  location: {
    type: String,
    required: [true, "school location required"],
    minlength: [3, "Too short school location"],
    maxlength: [100, "Too long school location"],
  },
  admins: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

SchoolSchema.pre(/^find/, function(next) {
  this.populate({path: "admins", select: "name"});
  next();
});

module.exports = mongoose.model("School", SchoolSchema);
