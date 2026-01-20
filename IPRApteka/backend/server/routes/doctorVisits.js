const router = require("express").Router();
const PlannedVisit = require("../models/PlannedVisit");
const DoctorProfile = require("../models/DoctorProfile");
const isDoctor = require("../middleware/isDoctor");

router.get("/", isDoctor, async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });

    if (!doctorProfile) {
      return res.json([]);
    }

    const visits = await PlannedVisit.find()
      .populate({
        path: 'schedule',
        match: { doctor: doctorProfile._id }
      })
      .populate('client', 'username email')
      .populate('services');

    const doctorVisits = visits.filter(v => v.schedule !== null);

    res.json(doctorVisits);
  } catch (err) {
    console.error("Ошибка в doctorVisits:", err);
    res.status(500).json({ message: "Ошибка сервера", details: err.message });
  }
});

module.exports = router;