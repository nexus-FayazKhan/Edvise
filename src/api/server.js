import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import roadmapRoutes from './routes/roadmapRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port (update if your frontend uses 3000)
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request Body Size:', JSON.stringify(req.body).length, 'bytes');
  }
  next();
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is missing');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    process.exit(1);
  }
};

// MongoDB connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
});

// MongoDB disconnection handler
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true }, // Add username field
  gender: String,
  birthDate: Date,
  phoneNumber: String,
  location: String,
  education: String,
  college: String,
  careerInterests: String,
  skills: [String],
  role: { type: String, enum: ['mentee', 'mentor'], default: 'mentee' },
});
const User = mongoose.model('User', userSchema);

// Routes
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/communities', communityRoutes);

// Profile Routes
app.get('/api/users/profile', async (req, res) => {
  const { email } = req.query;
  try {
    console.log('Fetching profile for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('GET /api/users/profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/profile', async (req, res) => {
  const { email, ...updates } = req.body;
  try {
    console.log('Updating profile for email:', email);
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, upsert: true } // Create if not exists
    );
    res.json(user);
  } catch (error) {
    console.error('PUT /api/users/profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/mentors', async (req, res) => {
  const { skills } = req.query;
  try {
    console.log('Fetching mentors with skills:', skills);
    const skillArray = skills ? skills.split(',') : [];
    const mentors = await User.find(
      {
        role: 'mentor',
        skills: { $in: skillArray },
      },
      { username: 1, skills: 1, _id: 1 } // Select only username, skills, and _id
    );
    console.log('Mentors found:', mentors.length);
    res.json(mentors);
  } catch (error) {
    console.error('GET /api/users/mentors error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });

  if (err instanceof SyntaxError && err.status === 413) {
    return res.status(413).json({
      error: 'Request entity too large',
      message: 'The data you are trying to send is too large'
    });
  }

  if (err instanceof mongoose.Error) {
    return res.status(500).json({
      error: 'Database error',
      message: err.message,
      type: err.name,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    });
  }

  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    type: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();