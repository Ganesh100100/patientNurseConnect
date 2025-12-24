require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
}

startServer();
