const mongoose = require("mongoose");

const clientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  mobile: String,
  address: String,
});

module.exports = mongoose.model("ClientProfile", clientProfileSchema);
