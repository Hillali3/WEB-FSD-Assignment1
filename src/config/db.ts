const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    const db = await mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => console.log("connected to database"));
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
