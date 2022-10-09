const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    trim: true,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  dob: {
    type: Date,
  },
});

module.exports = mongoose.model("Student", userSchema);
