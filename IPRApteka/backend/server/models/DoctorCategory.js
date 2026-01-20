const mongoose = require("mongoose");

const DoctorCategorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model("DoctorCategory", DoctorCategorySchema);
