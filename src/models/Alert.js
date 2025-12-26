import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      trim: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required']
    },
    alertType: {
      type: String,
      required: [true, 'Alert type is required'],
      trim: true
      // Examples: "EMERGENCY", "CALL_NURSE", "VITALS_ABNORMAL", etc.
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACKNOWLEDGED', 'RESOLVED'],
      default: 'PENDING'
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // Null until acknowledged
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
alertSchema.index({ deviceId: 1 });
alertSchema.index({ patientId: 1 });
alertSchema.index({ createdAt: -1 }); // Latest first
alertSchema.index({ status: 1, createdAt: -1 }); // Filter by status

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;