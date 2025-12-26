/**
 * Socket.IO Service
 * Handles real-time event emission to connected clients
 */

let io; // Socket.IO instance stored here

/**
 * Initialize the socket service with the Socket.IO instance
 */
export const initSocketService = (socketIO) => {
  io = socketIO;
  console.log('✅ Socket service initialized');
};

/**
 * Emit new alert to all connected clients
 * Called when MQTT receives a new alert
 */
export const emitNewAlert = (alert) => {
  if (!io) {
    console.warn('⚠️ Socket.IO not initialized');
    return;
  }

  io.emit('alert:new', alert);
  console.log(`📤 Emitted new alert: ${alert._id}`);
};

/**
 * Emit alert update to all connected clients
 * Called when alert status is changed (acknowledged/resolved)
 */
export const emitAlertUpdate = (alert) => {
  if (!io) {
    console.warn('⚠️ Socket.IO not initialized');
    return;
  }

  io.emit('alert:updated', alert);
  console.log(`📤 Emitted alert update: ${alert._id}`);
};