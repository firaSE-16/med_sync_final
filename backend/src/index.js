import express from 'express';
import http from 'http'; // Required to create an HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import adminRoutes from './routes/admin.route.js';
import nurseRoutes from './routes/nurse.route.js';
import doctorRoutes from './routes/doctor.route.js';
import triageRoutes from './routes/triage.route.js';
import laboratoristRoutes from './routes/laboratorist.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  })
);




// Add your routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/laboratorist', laboratoristRoutes);

const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
  },
});

// MongoDB connection
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  connectDB();
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Listen for send_message event
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, text, image, roomId } = data;

    // Emit the message to other users in the same room
    io.to(roomId).emit('receive_message', { senderId, receiverId, text, image });

    // Save the message in the database
    try {
      const newMessage = new Message({ senderId, receiverId, text, image });
      await newMessage.save();
      console.log('Message saved:', newMessage);
    } catch (error) {
      console.log('Error saving message:', error.message);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
