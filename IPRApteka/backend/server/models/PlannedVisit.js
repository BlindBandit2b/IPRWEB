const mongoose = require("mongoose");

const PlannedVisitSchema = new mongoose.Schema({
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: "AppointmentSchedule", required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  diagnosis_text: { type: String, default: "" },
  diagnosis: { type: mongoose.Schema.Types.ObjectId, ref: "Diagnosis" }
});

module.exports = mongoose.model("PlannedVisit", PlannedVisitSchema);