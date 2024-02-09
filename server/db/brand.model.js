const mongoose = require("mongoose");

const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Brand", BrandSchema);