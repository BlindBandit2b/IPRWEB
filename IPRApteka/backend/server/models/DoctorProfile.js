const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  firstName: String,
  lastName: String,
  specialization: String,
  category: String,
  department: String,
  info: String,
});

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);
