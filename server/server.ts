import express from 'express';
import { createServer } from 'http';
import { SocketServer } from './ws/socketServer';
import authRoutes from './routes/auth';
import marketRoutes from './routes/markets';
import tradeRoutes from './routes/trades';
import userRoutes from './routes/users';
import { setupAIEngine } from './services/aiService';

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/users', userRoutes);

const server = createServer(app);

// Initialize WebSocket server
const wsServer = new SocketServer(server);

// Initialize AI Engine event listeners
setupAIEngine();

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
