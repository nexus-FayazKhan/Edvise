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
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

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
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  gender: String,
  birthDate: Date,
  phoneNumber: String,
  location: String,
  education: String,
  college: String,
  careerInterests: String,
  skills: [String],
  role: { 
    type: String, 
    enum: ['mentee', 'mentor'], 
    default: 'mentee',
    trim: true, // Remove extra spaces
    lowercase: true // Force lowercase
  },
  connectedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  mentorInfo: {
    degree: String,
    institution: String,
    yearsOfExperience: Number,
    bio: String,
  },
});
const User = mongoose.model('User', userSchema);

// Chat Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Routes
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/communities', communityRoutes);

// Profile Routes
app.get('/api/users/profile', async (req, res) => {
  const { email } = req.query;
  try {
    console.log('Fetching profile for email:', email);
    if (!email) {
      console.log('Email not provided in query');
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email }).populate('connectedMentors', 'username').exec();
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.username);
    res.json(user);
  } catch (error) {
    console.error('GET /api/users/profile error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/users/profile', async (req, res) => {
  const { email, ...updates } = req.body;
  try {
    console.log('Updating profile for email:', email);
    if (!email) {
      console.log('Email not provided in request body');
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true, upsert: true }
    );
    console.log('Profile updated for user:', user.username);
    res.json(user);
  } catch (error) {
    console.error('PUT /api/users/profile error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Connect with mentor
app.post('/api/users/connect', async (req, res) => {
  const { menteeEmail, mentorId } = req.body;
  try {
    console.log('Connecting mentee:', menteeEmail, 'with mentor:', mentorId);
    
    // Find the mentee
    const mentee = await User.findOne({ email: menteeEmail });
    if (!mentee) {
      console.log('Mentee not found:', menteeEmail);
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Find the mentor
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      console.log('Mentor not found:', mentorId);
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if already connected
    if (mentee.connectedMentors?.some(id => id.toString() === mentorId)) {
      console.log('Already connected with mentor');
      return res.status(400).json({ message: 'Already connected with this mentor' });
    }

    // Add mentor to mentee's connections
    mentee.connectedMentors = [...(mentee.connectedMentors || []), mentor._id];
    await mentee.save();

    console.log('Successfully connected mentee with mentor');
    res.json(mentee.connectedMentors);
  } catch (error) {
    console.error('POST /api/users/connect error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Disconnect from mentor
app.post('/api/users/disconnect', async (req, res) => {
  const { menteeEmail, mentorId } = req.body;
  try {
    console.log('Disconnecting mentee:', menteeEmail, 'from mentor:', mentorId);
    
    // Find the mentee
    const mentee = await User.findOne({ email: menteeEmail });
    if (!mentee) {
      console.log('Mentee not found:', menteeEmail);
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Check if connected
    if (!mentee.connectedMentors?.some(id => id.toString() === mentorId)) {
      console.log('Not connected with mentor');
      return res.status(400).json({ message: 'Not connected with this mentor' });
    }

    // Remove mentor from mentee's connections
    mentee.connectedMentors = mentee.connectedMentors.filter(id => id.toString() !== mentorId);
    await mentee.save();

    console.log('Successfully disconnected mentee from mentor');
    res.json(mentee.connectedMentors);
  } catch (error) {
    console.error('POST /api/users/disconnect error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to fetch all mentors (still filters for role: "mentor")
app.get('/api/users/mentors', async (req, res) => {
  const { skills } = req.query;
  try {
    console.log('Fetching mentors with skills:', skills);
    const skillArray = skills ? skills.split(',') : [];
    const query = { role: { $eq: 'mentor' } };
    if (skillArray.length > 0) {
      query.skills = { $in: skillArray };
    }
    const mentors = await User.find(query, { username: 1, skills: 1, _id: 1 }).exec();
    console.log('Mentors found:', mentors.length);
    console.log('Mentor IDs:', mentors.map(m => m._id.toString()));
    res.json(mentors);
  } catch (error) {
    console.error('GET /api/users/mentors error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/users/mentors/:id', async (req, res) => {
  try {
    console.log('Fetching mentor with ID:', req.params.id);
    // First try to find the user without any field restrictions to debug
    const user = await User.findById(req.params.id).exec();
    
    if (!user) {
      console.log('No user found with ID:', req.params.id);
      return res.status(404).json({ message: 'Mentor not found' });
    }

    console.log('Found user:', {
      id: user._id,
      username: user.username,
      role: user.role,
      skills: user.skills,
      mentorInfo: user.mentorInfo
    });

    // Now get the mentor with required fields
    const mentor = await User.findById(req.params.id).select('username email skills mentorInfo role location education college careerInterests').exec();
    
    // Case-insensitive role check
    if (!mentor.role || mentor.role.toLowerCase() !== 'mentor') {
      console.log('User exists but is not a mentor. Role:', mentor.role);
      return res.status(404).json({ message: 'User is not a mentor' });
    }

    console.log('Mentor found:', mentor.username);
    res.json(mentor);
  } catch (error) {
    console.error('GET /api/users/mentors/:id error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid mentor ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Error Handling Middleware
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
    });
  }

  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    type: err.name,
  });
});

// Catch-All Route for 404
app.use((req, res) => {
  console.log('Route not found:', req.method, req.url);
  res.status(404).json({ message: 'Route not found' });
});

const startServer = async () => {
  try {
    console.log('Server.js loaded at:', new Date().toISOString());
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