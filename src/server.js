import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import createMQTTClient from './config/mqtt.js';
import createSocketServer from './config/socket.js';
import { initSocketService } from './services/socketService.js';
import { initMQTTService } from './services/mqttService.js';

const PORT = process.env.PORT || 3000;

/**
 * Initialize and start the server
 * Order of initialization:
 * 1. MongoDB
 * 2. HTTP Server
 * 3. Socket.IO
 * 4. MQTT Client
 */
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Create HTTP server
    const httpServer = createServer(app);

    // 3. Initialize Socket.IO
    const io = createSocketServer(httpServer);
    initSocketService(io);

    // 4. Initialize MQTT Client
    const mqttClient = createMQTTClient();
    initMQTTService(mqttClient);

    // 5. Start listening
    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║  🏥 Patient-Nurse Alert System Running    ║
║  📡 Server: http://localhost:${PORT}        ║
║  🔌 Socket.IO: Ready                       ║
║  📨 MQTT: Connected                        ║
╚════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      httpServer.close(() => {
        console.log('Server closed');
        mqttClient.end();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();