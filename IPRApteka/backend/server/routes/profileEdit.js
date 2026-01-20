const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const ClientProfile = require("../models/ClientProfile");


router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role === "doctor") {
    const profile = await DoctorProfile.findOne({ user: user._id });
    return res.json({ role: "doctor", profile });
  }

  const profile = await ClientProfile.findOne({ user: user._id });
  res.json({ role: "client", profile });
});

router.put("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role === "doctor") {
    await DoctorProfile.findOneAndUpdate(
      { user: user._id },
      req.body,
      { new: true }
    );
  } else {
    await ClientProfile.findOneAndUpdate(
      { user: user._id },
      req.body,
      { new: true }
    );
  }

  res.json({ success: true });
});

module.exports = router;
