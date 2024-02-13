const mongoose = require("mongoose");

const { Schema } = mongoose;

const LocationSchema = new Schema({
  city: String,
  country: String
});

module.exports = mongoose.model("Location", LocationSchema);