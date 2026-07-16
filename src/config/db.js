const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("dotenv").config();
const { hashPassword } = require("../utils/password.js");
const User = require("../models/user.models");

const seedSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: "SUPER_ADMIN" }); 
    if (!existingSuperAdmin) {
      const hashedPassword = await hashPassword("superadmin@123"); 
      await User.create({
        name: "Super Admin",
        email: "superadmin@newsportal.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        status: "APPROVED",
        isActive : "true"
      });
      console.log("Super Admin successfully seeded into database!");
    } else {
      console.log("Super Admin already exists");
    }
  } catch (error) {
    console.error("Super Admin seeding failed:", error.message);
  }
};


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {});
    console.log(`MongoDB Connected successfully to: ${conn.connection.host}`);
    await seedSuperAdmin(); // call to Seed superadmin 
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};



module.exports = { connectDB, seedSuperAdmin };
