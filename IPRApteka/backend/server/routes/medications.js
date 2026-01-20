const express = require('express');
const Medication = require('../models/Medication');
const router = express.Router();

const isAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.status(401).json({ message: 'Unauthorized' });

router.get('/', async (req, res) => {
  const { search, sort = 'name', filterPriceMax } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (filterPriceMax) query.price = { $lte: filterPriceMax };
  const data = await Medication.find(query).sort(sort).populate('category supplier');
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await Medication.findById(req.params.id).populate('category supplier');
  res.json(data);
});

router.post('/', isAuthenticated, async (req, res) => {
  const data = new Medication(req.body);
  await data.save();
  res.status(201).json(data);
});

router.put('/:id', isAuthenticated, async (req, res) => {
  const data = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  await Medication.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;