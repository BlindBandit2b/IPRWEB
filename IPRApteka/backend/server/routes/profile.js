const router = require("express").Router();
const User = require("../models/User");
const Profile = require("../models/ClientProfile");
const verifyToken = require("../middleware/auth");
const axios = require("axios");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    let joke = "Не удалось получить шутку :(";
    try {
      const jokeRes = await axios.get("https://v2.jokeapi.dev/joke/Any?contains=doctor");
      const jokeData = jokeRes.data;
      if (jokeData.type === 'single') {
        joke = jokeData.joke;
      } else if (jokeData.type === 'twopart') {
        joke = `${jokeData.setup} ... ${jokeData.delivery}`;
      }
    } catch (e) {
      console.error("JokeAPI Error:", e.message);
    }

    if (user.role === 'doctor') {
      return res.json({
        type: 'doctor',
        user: user,
        joke: joke
      });
    } else {
      let profile = await Profile.findOne({ user: user._id });

      if (!profile) {
        profile = {
          firstName: user.username,
          lastName: "",
          dateOfBirth: null,
          mobile: "",
          address: ""
        };
      }

      res.json({
        type: 'client',
        user: user,
        profile: profile,
        joke: joke
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;