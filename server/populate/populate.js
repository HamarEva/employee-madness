/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const brands = require("./brands.json");
const kittens = require("./kittens.json");
const locations = require("./locations.json")
const EmployeeModel = require("../db/employee.model");
const BrandModel = require("../db/brand.model");
const KittenModel = require("../db/kitten.model");
const LocationModel = require("../db/location.model");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];
const pickSalary = () => Math.floor(Math.random() * 41)+ 20

const populateBrands = async () => {
  await BrandModel.deleteMany({});

  const favBrands = brands.map((name)=> (
    {name}
  ))

  await BrandModel.create(...favBrands);
  console.log("Brands created");
}

const populateLocations = async () => {
  //await LocationModel.deleteMany({});

  const locat = locations.map((loc)=> (
    {city: loc.city,
    country: loc.country}
  ))

  await LocationModel.create(...locat);
  console.log("Locations created");
}

const populateKittens = async () => {
  //await KittenModel.deleteMany({});

  const employees = await EmployeeModel.find({});

  const kitts = kittens.map((name)=> (
    {name,
    weight:10,
    employee: pick(employees)._id}
  ))

  await KittenModel.create(...kitts);
  console.log("Kittens created");
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

const populateSalary = async () => {
  try {
    const employees = await EmployeeModel.find({});
    for (const employee of employees) {
      const randomSalary = pickSalary();
      await EmployeeModel.updateOne({ _id: employee._id }, { $set: { salary: randomSalary } });
    }
    console.log('Employees updated successfully');
  } catch (error) {
    console.error('Error updating employees:', error);
  }
};

const main = async () => {
  await mongoose.connect(mongoUrl);

  //await populateBrands();
  //await populateEmployees();
  //await populateKittens();
  //await populateSalary();
  await populateLocations();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
