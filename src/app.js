const express = require("express");
const eventRoutes = require("./routes/events");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/v1/events", eventRoutes);

module.exports = app;
