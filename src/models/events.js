const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true
    },
    patientId: {
      type: String,
      required: true,
      index: true
    },
    eventType: {
      type: String,
      required: true
    },
    payload: {
      type: Object,
      required: true
    },
    actionBy: {
      type: String,
      enum: ["patient", "nurse", "system"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);
