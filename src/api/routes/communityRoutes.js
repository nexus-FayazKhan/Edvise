import express from 'express';
import Community from '../models/Community.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new community
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, owner } = req.body;
    
    console.log('Received request to create community:', req.body);

    // Validate required fields with more detailed checks
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return res.status(400).json({ 
        message: 'Community name must be a string of at least 3 characters',
        received: { name }
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ 
        message: 'Description must be a string of at least 10 characters',
        received: { description }
      });
    }

    if (!owner || typeof owner !== 'string' || !owner.startsWith('user_')) {
      return res.status(400).json({ 
        message: 'Invalid owner ID. Must be a valid Clerk user ID',
        received: { owner }
      });
    }

    // Check if community with same name exists
    const existingCommunity = await Community.findOne({ name: name.trim() });
    if (existingCommunity) {
      return res.status(400).json({ message: 'A community with this name already exists' });
    }

    const community = new Community({
      name: name.trim(),
      description: description.trim(),
      icon: icon || '📚',
      owner: owner,  // Keep as string
      members: [{
        user: owner,  // Keep as string
        role: 'admin',
        joinedAt: new Date()
      }]
    });

    await community.save();
    res.status(201).json(community);
  } catch (error) {
    console.error('Full error details:', error);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    // Specific handling for ObjectId cast error
    if (error.name === 'CastError' && error.path === 'owner') {
      return res.status(400).json({
        message: 'Invalid owner ID format',
        receivedValue: error.value
      });
    }

    res.status(500).json({ 
      message: 'Unexpected error creating community',
      error: error.message 
    });
  }
});

// Get all communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific community
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a message to a channel
router.post('/:id/channels/:channelName/messages', async (req, res) => {
  try {
    const { sender, content, attachments } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const channel = community.channels.find(c => c.name === req.params.channelName);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    channel.messages.push({ sender, content, attachments });
    await community.save();
    
    res.status(201).json(channel.messages[channel.messages.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a member to community
router.post('/:id/members', async (req, res) => {
  try {
    const { userId, role } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (community.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    community.members.push({ user: userId, role });
    await community.save();
    
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join a community
router.post('/:id/join', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const userId = req.body.userId;
    // Check if user is already a member
    if (community.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    community.members.push({
      user: userId,
      role: 'member'
    });

    await community.save();
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a community
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Find the community
    const community = await Community.findById(id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the user is the owner
    if (community.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Only the community owner can delete the community' });
    }

    // Delete the community
    await Community.findByIdAndDelete(id);
    
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
