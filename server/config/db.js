const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected : ", conn.connection.port);
  } catch (err) {
    console.error("Database not connected", err.message);
  }
};

module.exports = connectDB;
