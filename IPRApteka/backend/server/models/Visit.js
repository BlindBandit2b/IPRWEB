const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  schedule: {
    date: Date,
    time_start: String,
    time_end: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  client: {
    first_name: String,
    last_name: String,
    phone: String,
    email: String,
  },
  services: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service" }
  ],
  diagnosis: {
    name: String,
  },
  total_price: Number,
});

module.exports = mongoose.model("Visit", visitSchema);
