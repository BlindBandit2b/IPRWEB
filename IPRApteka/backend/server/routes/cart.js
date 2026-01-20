const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("services");
  res.json(cart);
});

router.delete("/remove/:id", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.services = cart.services.filter(
    s => s.toString() !== req.params.id
  );
  await cart.save();
  res.json(cart);
});

module.exports = router;
