const Event = require("../models/events");

exports.createEvent = async (req, res) => {
  try {
    const { deviceId, patientId, eventType, payload, actionBy } = req.body;

    if (!deviceId || !patientId || !eventType || !payload || !actionBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    await Event.create({
      deviceId,
      patientId,
      eventType,
      payload,
      actionBy
    });

    return res.status(201).json({
      success: true,
      message: "Event stored successfully"
    });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
