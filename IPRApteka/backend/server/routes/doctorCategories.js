const DoctorCategory = require("../models/DoctorCategory");
const isDoctor = require("../middleware/isDoctor");
const router = require("express").Router();


router.get("/", async (req, res) => {
  try {
    const categories = await DoctorCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", isDoctor, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: "Название категории обязательно" });
    }

    const category = await DoctorCategory.create({
      name: req.body.name
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", isDoctor, async (req, res) => {
  try {
    const category = await DoctorCategory.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Категория не найдена" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", isDoctor, async (req, res) => {
  try {
    const category = await DoctorCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Категория не найдена" });
    res.json({ success: true, message: "Категория удалена" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;