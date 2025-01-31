// https://mongoosejs.com/
const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  equipment: {
    type: String,
    default: "none",
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  salary: Number,
  location:  {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
