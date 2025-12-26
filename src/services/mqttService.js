import Alert from '../models/Alert.js';
import { emitNewAlert } from './socketService.js';

/**
 * MQTT Service
 * Primary source of alerts from IoT devices
 * 
 * Flow: MQTT → MongoDB → Socket.IO
 * 1. Subscribe to iot/alerts/# topics
 * 2. Parse incoming JSON payload
 * 3. Save alert to MongoDB
 * 4. Emit real-time event via Socket.IO
 */

const ALERT_TOPIC = 'iot/alerts/#'; // Subscribe to all alert topics

/**
 * Initialize MQTT Service
 * Sets up topic subscription and message handling
 */
export const initMQTTService = (mqttClient) => {
  // Subscribe to alert topics
  mqttClient.subscribe(ALERT_TOPIC, (err) => {
    if (err) {
      console.error('❌ MQTT Subscription failed:', err);
    } else {
      console.log(`✅ Subscribed to ${ALERT_TOPIC}`);
    }
  });

  // Handle incoming messages
  mqttClient.on('message', async (topic, message) => {
    try {
      console.log(`📨 MQTT Message received on topic: ${topic}`);

      // Parse JSON payload
      const payload = JSON.parse(message.toString());
      console.log('📦 Payload:', payload);

      // Validate required fields
      const { deviceId, patientId, alertType, message: alertMessage } = payload;

      if (!deviceId || !patientId || !alertType || !alertMessage) {
        console.warn('⚠️ Invalid payload - missing required fields');
        return;
      }

      // Save alert to MongoDB
      const alert = await Alert.create({
        deviceId,
        patientId,
        alertType,
        message: alertMessage,
        status: 'PENDING'
      });

      // Populate patient details before emitting
      await alert.populate('patientId', 'name wardOrRoom');

      console.log(`✅ Alert saved to DB: ${alert._id}`);

      // Emit to all connected Socket.IO clients
      emitNewAlert(alert);

    } catch (error) {
      console.error('❌ Error processing MQTT message:', error.message);
    }
  });
};

/**
 * Example MQTT payload structure:
 * 
 * {
 *   "deviceId": "DEV-9021",
 *   "patientId": "675d1234567890abcdef1234",
 *   "alertType": "CALL_NURSE",
 *   "message": "Patient requesting assistance"
 * }
 * 
 * You can test this by publishing to: iot/alerts/room/101
 */