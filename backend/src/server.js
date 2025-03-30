const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const audioService = require('./services/audioService');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soundsprout')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Start a new practice session
  socket.on('startPractice', (songId) => {
    const session = audioService.startSession(socket.id, songId);
    socket.emit('sessionStarted', session);
  });

  // Handle incoming audio data
  socket.on('audioData', (data) => {
    const result = audioService.processAudioData(socket.id, data);
    if (result.success) {
      socket.emit('noteDetected', result.note);
    }
  });

  // End practice session
  socket.on('endPractice', () => {
    const result = audioService.endSession(socket.id);
    socket.emit('sessionEnded', result);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    audioService.endSession(socket.id);
  });
});

// Routes
app.use('/api/songs', require('./routes/songs'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SoundSprout API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 