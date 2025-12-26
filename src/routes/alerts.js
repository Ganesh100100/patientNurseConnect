import express from 'express';
import {
  getAllAlerts,
  getAlertById,
  updateAlertStatus,
  getAlertStats
} from '../controllers/alertController.js';

const router = express.Router();

// Alert routes
router.get('/stats', getAlertStats);    // Get statistics (must be before /:id)
router.get('/', getAllAlerts);          // Get all alerts
router.get('/:id', getAlertById);       // Get alert by ID
router.put('/:id', updateAlertStatus);  // Update alert status

export default router;