const express = require("express");
const eventRoutes = require("./routes/events");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/events", eventRoutes);

module.exports = app;
