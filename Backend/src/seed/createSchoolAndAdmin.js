import mongoose from "mongoose";
import dotenv from "dotenv";
import School from "../modules/schools/school.model.js";
import User from "../modules/users/user.model.js";

dotenv.config();

// ── EDIT THESE BEFORE RUNNING ─────────────────────────────────────────────────
const SCHOOL = {
  name: "Handwash Plus School",
  address: "123 Main Street, Colombo",
  district: "Colombo",
  city: "Colombo",
  lat: 6.9271,
  lng: 79.8612,
};

const ADMIN = {
  name: "School Admin",
  email: "schooladmin@handwashplus.com",
  password: "Admin@1234",
};
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB:", mongoose.connection.name);

  // 1. Create school (skip if already exists)
  let school = await School.findOne({ name: SCHOOL.name });
  if (school) {
    console.log("School already exists:", school._id.toString());
  } else {
    school = await School.create(SCHOOL);
    console.log("School created:", school._id.toString());
  }

  // 2. Create admin (skip if already exists)
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log("Admin already exists:", existing._id.toString());
    console.log("Email:", existing.email, "| Role:", existing.role);
  } else {
    const admin = await User.create({
      name: ADMIN.name,
      email: ADMIN.email,
      password: ADMIN.password, // pre-save hook hashes this once
      role: "admin",
      school: school._id,
    });
    console.log("Admin created:", admin._id.toString());
    console.log("Email:", admin.email);
    console.log("Password:", ADMIN.password, "(use this to login)");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
