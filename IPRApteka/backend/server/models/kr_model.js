const mongoose = require("mongoose");

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