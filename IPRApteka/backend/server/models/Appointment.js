const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  date: Date,
  timeStart: String,
  status: { type: String, default: "planned" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
