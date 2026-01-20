const router = require("express").Router();
const PlannedVisit = require("../models/PlannedVisit");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, async (req, res) => {
  try {
    const visits = await PlannedVisit.find({ client: req.user.clientProfileId })
      .populate({
        path: 'schedule',
        populate: { path: 'doctor' }
      })
      .populate('services')
      .sort({ 'schedule.date': 1 });

    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении записей" });
  }
});

module.exports = router;