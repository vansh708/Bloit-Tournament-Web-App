const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const teamRoutes = require('./routes/teams');
const messageRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Bloit Tournament API is running...');
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_tournament_chat', (tournamentId) => {
    socket.join(`tournament_${tournamentId}`);
    console.log(`User joined chat for tournament ${tournamentId}`);
  });

  socket.on('send_message', async (data) => {
    // data = { tournamentId, sender, senderName, content }
    try {
      const newMessage = new Message({
        tournamentId: data.tournamentId,
        sender: data.sender,
        senderName: data.senderName,
        content: data.content
      });
      await newMessage.save();
      
      io.to(`tournament_${data.tournamentId}`).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database and Server Setup
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
