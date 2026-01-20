const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "DoctorCategory" },
    price: { type: Number, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model("Service", ServiceSchema);
