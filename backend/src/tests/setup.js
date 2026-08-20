// Load environment variables for testing.
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Connect to MongoDB before running tests.
beforeAll(async () => {
  await connectDB();
}, 15000);

// Close all MongoDB connections after tests finish.
afterAll(async () => {
  await mongoose.disconnect();
}, 15000);