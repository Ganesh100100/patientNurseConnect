const connectDB = require("../lib/db");
const Event = require("../models/events");

exports.createEvent = async (req, res) => {
  const { deviceId, patientId, eventType, payload, actionBy } = req.body;

  if (!deviceId || !patientId || !eventType || !payload || !actionBy) {
    return res.status(400).json({ message: "Missing fields" });
  }

  await connectDB(process.env.MONGO_URI);

  await Event.create({
    deviceId,
    patientId,
    eventType,
    payload,
    actionBy
  });

  res.status(201).json({ success: true });
};
