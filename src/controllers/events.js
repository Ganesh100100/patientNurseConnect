const connectDB = require("../lib/db");
const Event = require("../models/events");

exports.createEvent = async (req, res) => {
  try {
    const { deviceId, patientId, eventType, payload, actionBy } = req.body;

    if (!deviceId || !patientId || !eventType || !payload || !actionBy) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await connectDB(process.env.MONGO_URI);

    await Event.collection.insertOne({
      deviceId,
      patientId,
      eventType,
      payload,
      actionBy,
      createdAt: new Date()
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error" });
  }
};
