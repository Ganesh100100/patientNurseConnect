import Alert from '../models/Alert.js';
import { emitAlertUpdate } from '../services/socketService.js';

/**
 * Get all alerts with filters
 * GET /api/alerts
 */
export const getAllAlerts = async (req, res) => {
  try {
    const { status, patientId, deviceId, limit = 50 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (deviceId) filter.deviceId = deviceId;

    const alerts = await Alert.find(filter)
      .populate('patientId', 'name wardOrRoom') // Get patient details
      .populate('actionBy', 'name role') // Get nurse details
      .sort({ createdAt: -1 }) // Latest first
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
};

/**
 * Get alert by ID
 * GET /api/alerts/:id
 */
export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('patientId', 'name wardOrRoom')
      .populate('actionBy', 'name role');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error fetching alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert',
      error: error.message
    });
  }
};

/**
 * Update alert status
 * PUT /api/alerts/:id
 */
export const updateAlertStatus = async (req, res) => {
  try {
    const { status, actionBy } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updateData = { status };
    if (actionBy) updateData.actionBy = actionBy;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('patientId', 'name wardOrRoom')
      .populate('actionBy', 'name role');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Emit real-time update to all connected clients
    emitAlertUpdate(alert);

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update alert',
      error: error.message
    });
  }
};

/**
 * Get alert statistics
 * GET /api/alerts/stats
 */
export const getAlertStats = async (req, res) => {
  try {
    const totalAlerts = await Alert.countDocuments();
    const pendingAlerts = await Alert.countDocuments({ status: 'PENDING' });
    const acknowledgedAlerts = await Alert.countDocuments({ status: 'ACKNOWLEDGED' });
    const resolvedAlerts = await Alert.countDocuments({ status: 'RESOLVED' });

    res.status(200).json({
      success: true,
      data: {
        total: totalAlerts,
        pending: pendingAlerts,
        acknowledged: acknowledgedAlerts,
        resolved: resolvedAlerts
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};