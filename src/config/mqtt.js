import mqtt from 'mqtt';

/**
 * Initialize MQTT Client
 * Connects to the broker and handles reconnection
 */
const createMQTTClient = () => {
  const options = {
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000
  };

  // Add authentication if provided
  if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
    options.username = process.env.MQTT_USERNAME;
    options.password = process.env.MQTT_PASSWORD;
  }

  const client = mqtt.connect(process.env.MQTT_BROKER_URL, options);

  // Connection events
  client.on('connect', () => {
    console.log('✅ MQTT Connected');
  });

  client.on('error', (err) => {
    console.error('❌ MQTT Error:', err.message);
  });

  client.on('reconnect', () => {
    console.log('🔄 MQTT Reconnecting...');
  });

  client.on('close', () => {
    console.warn('⚠️ MQTT Connection closed');
  });

  return client;
};

export default createMQTTClient;