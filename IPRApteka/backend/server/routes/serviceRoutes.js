const router = require("express").Router();
const Service = require("../models/Service");
const DoctorCategory = require("../models/DoctorCategory");
const isDoctor = require("../middleware/isDoctor");

router.get("/", async (req, res) => {
  try {
    const { category, min_price, max_price, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (min_price) filter.price = { ...filter.price, $gte: Number(min_price) };
    if (max_price) filter.price = { ...filter.price, $lte: Number(max_price) };
    if (search) filter.name = { $regex: search, $options: "i" };

    const services = await Service.find(filter).populate("category");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении услуг" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (req.params.id === "categories" || req.params.id === "doctor") return;

    const service = await Service.findById(req.params.id).populate("category");
    if (!service) {
      return res.status(404).json({ message: "Услуга не найдена" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении деталей услуги" });
  }
});

router.get("/categories/all", async (req, res) => {
  try {
    const categories = await DoctorCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении категорий" });
  }
});

router.get("/doctor/list", isDoctor, async (req, res) => {
  const { search, sort } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: "i" };

  const services = await Service
    .find(query)
    .sort(sort || "name")
    .populate("category");
  res.json(services);
});

router.post("/doctor", isDoctor, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: "Ошибка при создании услуги" });
  }
});

router.put("/doctor/:id", isDoctor, async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(service);
});

router.delete("/doctor/:id", isDoctor, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;