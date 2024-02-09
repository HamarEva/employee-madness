/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const brands = require("./brands.json");
const EmployeeModel = require("../db/employee.model");
const BrandModel = require("../db/brand.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateBrands = async () => {
  await BrandModel.deleteMany({});

  const favBrands = brands.map((name)=> (
    {name}
  ))

  await BrandModel.create(...favBrands);
  console.log("Brands created");
}

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});

  const brands = await BrandModel.find({});

  const employees = names.map((name) => ({
    name,
    level: pick(levels),
    position: pick(positions),
    brand: pick(brands)._id

  }));

  await EmployeeModel.create(...employees);
  console.log("Employees created");

};

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateBrands();
  await populateEmployees();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
