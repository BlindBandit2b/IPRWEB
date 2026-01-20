const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function getRoleByEmail(email = "") {
  return email.endsWith("@doctor.com") ? "doctor" : "client";
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Пользователь с такой почтой уже существует" });
    }

    const role = getRoleByEmail(email);
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role });
  } catch (err) {
    console.error("ОШИБКА ПРИ РЕГИСТРАЦИИ:", err.message);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const email = req.user.profile.emails[0].value;
      const role = getRoleByEmail(email);

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          email,
          role,
          provider: "google",
          providerId: req.user.profile.id,
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const redirectUrl = role === "doctor"
        ? `http://localhost:3000/doctor/services?token=${token}`
        : `http://localhost:3000/services?token=${token}`;

      res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google Auth Error:", err);
      res.redirect("http://localhost:3000/auth");
    }
  }
);

router.get("/facebook", async (req, res) => {
  const email = "demo@facebook.com";
  const role = getRoleByEmail(email);

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      role,
      provider: "facebook",
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.redirect(`http://localhost:3000/auth?token=${token}`);
});

module.exports = router;