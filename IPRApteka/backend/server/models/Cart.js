const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
});

module.exports = mongoose.model("Cart", cartSchema);
