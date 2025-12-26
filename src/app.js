import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js';
import alertRoutes from './routes/alerts.js';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/alerts', alertRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;