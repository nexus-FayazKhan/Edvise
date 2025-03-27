const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your-database', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the User model
const User = mongoose.model('User', {
  connectedMentors: String,
  // Add other user fields as needed
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow both ports
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

// Get connected mentees for a mentor
app.get('/api/users/mentees', async (req, res) => {
  try {
    const { mentorId } = req.query;
    const users = await User.find({ connectedMentors: mentorId });
    res.json(users);
  } catch (error) {
    console.error('Error fetching mentees:', error);
    res.status(500).json({ error: 'Failed to fetch mentees' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('createRoom', (data) => {
    const { roomId, userId, username, email, imageUrl } = data;
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set([{
        socketId: socket.id,
        userId,
        username,
        email,
        imageUrl
      }]));
      socket.join(roomId);
      socket.emit('roomCreated', { success: true, roomId });
      io.to(roomId).emit('allUsers', Array.from(rooms.get(roomId)));
    }
  });

  socket.on('requestJoin', (data) => {
    const { roomId, userId, username, email, imageUrl } = data;
    if (rooms.has(roomId)) {
      socket.join(roomId);
      const roomUsers = rooms.get(roomId);
      roomUsers.add({ socketId: socket.id, userId, username, email, imageUrl });
      socket.emit('joinResponse', { success: true, roomId });
      io.to(roomId).emit('allUsers', Array.from(roomUsers));
    } else {
      socket.emit('joinResponse', { success: false, message: 'Room not found' });
    }
  });

  socket.on('chatMessage', (messageData) => {
    io.to(messageData.roomId).emit('chatMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    rooms.forEach((users, roomId) => {
      const user = Array.from(users).find(u => u.socketId === socket.id);
      if (user) {
        users.delete(user);
        io.to(roomId).emit('allUsers', Array.from(users));
        if (users.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});