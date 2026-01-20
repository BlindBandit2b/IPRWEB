require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


const News = mongoose.model("News", new mongoose.Schema({
  title: String,
  shortDescription: String,
  fullContent: String,
  image: String,
  date: { type: Date, default: Date.now }
}));

const Dictionary = mongoose.model("Dictionary", new mongoose.Schema({
  question: String,
  answer: String,
  dateAdded: { type: String, default: () => new Date().toLocaleDateString() }
}));

const Contact = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  phone: String,
  photo: String
}));

const Vacancy = mongoose.model("Vacancy", new mongoose.Schema({
  title: String,
  description: String,
  salary: String
}));

const Review = mongoose.model("Review", new mongoose.Schema({
  username: String,
  rating: Number,
  text: String,
  date: { type: Date, default: Date.now }
}));

const Promocode = mongoose.model("Promocode", new mongoose.Schema({
  code: String,
  discount: Number,
  status: { type: String, enum: ['active', 'archive'], default: 'active' }
}));

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const profile = require("./routes/profile");
require("./config/passport");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: "SUPER_SECRET",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));
app.use("/services", require("./routes/serviceRoutes"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/doctor/visits", require("./routes/doctorVisits"));
app.use("/api/categories", require("./routes/doctorCategories"));
app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) { res.status(500).json(err); }
});

app.get("/api/dictionary", async (req, res) => {
  try {
    const items = await Dictionary.find();
    res.json(items);
  } catch (err) { res.status(500).json(err); }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) { res.status(500).json(err); }
});

app.get("/api/vacancies", async (req, res) => {
  try {
    const vacancies = await Vacancy.find();
    res.json(vacancies);
  } catch (err) { res.status(500).json(err); }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json(err); }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { username, rating, text } = req.body;
    const newReview = new Review({ username, rating, text });
    await newReview.save();
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.get("/api/promocodes", async (req, res) => {
  try {
    const codes = await Promocode.find();
    res.json(codes);
  } catch (err) { res.status(500).json(err); }
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
