require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const BrandModel = require("./db/brand.model");
const KittenModel = require("./db/kitten.model");
const LocationModel = require("./db/location.model");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/api/employees/", async (req, res) => {
  const employees = await EmployeeModel.find().populate("brand").sort({ created: "desc" });
  return res.json(employees);
});

app.get("/api/employees/toppaid", async (req, res) => {
  const employees = await EmployeeModel.find().sort({ salary: "desc" });
  return res.json(employees);
});

app.get("/api/employees/:id", async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  return res.json(employee);
});

app.post("/api/employees/", async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

/* app.get("/api/equipment/", async (req, res) => {
  const equipment = await EquipmentModel.find().sort({ created: "desc" });
  return res.json(equipment);
}); */

app.get("/api/equipment/", async (req, res) => {
  try {
    const equipment = await EquipmentModel.find().sort({ created: "desc" });
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    return res.json(equipment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/equipment/:id", async (req, res) => {
  const equipment = await EquipmentModel.findById(req.params.id);
  return res.json(equipment);
});

app.post("/api/equipment/", async (req, res, next) => {
  const equipment = req.body;

  try {
    const saved = await EquipmentModel.create(equipment);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

app.patch("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(equipment);
  } catch (err) {
    return next(err);
  }
});

app.delete("/api/equipment/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    const deleted = await equipment.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});

app.get("/api/employees/search/:search", async (req, res) => {
  const search = req.params.search;
  const searchExpression = {
    $or: [
      { name: { $regex: new RegExp(search, "i") } }
    ]
  }
  //const orderExpression = {  name: "asc" };
  //const orderExpression = {  ["name"]: "asc" };
  const employees = await EmployeeModel.find(searchExpression)
  //.sort (orderExpression)
  return res.json(employees);
});

app.get("/api/brands/", async (req, res) => {
  const brands = await BrandModel.find().sort({ created: "desc" });
  return res.json(brands);
});

app.get("/api/locations/", async (req, res) => {
  try{
  const locs = await LocationModel.find().sort({ created: "desc" });
  return res.json(locs);
  } catch(error){
    console.error(error);
  }
});

app.get("/api/kittens/:employeeId", async (req, res, next) => {
  try {
    const emplId = req.params.employeeId;
    
    const kittens = await KittenModel.find({ employee: emplId });
    
    return res.json(kittens);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

app.post("/api/kittens/", async (req, res, next) => {
  const kitten = req.body;

  try {
    const saved = await KittenModel.create(kitten);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});

const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log("App is listening on 8080");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
