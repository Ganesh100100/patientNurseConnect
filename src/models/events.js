const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    deviceId: String,
    patientId: String,
    eventType: String,
    payload: Object,
    actionBy: String
  },
  { timestamps: false }
);

module.exports =
  mongoose.models.Event || mongoose.model("Event", EventSchema);
