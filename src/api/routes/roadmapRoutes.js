import express from 'express';
import mongoose from 'mongoose';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Define Task Schema
const taskSchema = new mongoose.Schema({
  topic: String,
  resource: String
});

// Define Node Schema
const nodeSchema = new mongoose.Schema({
  id: String,
  position: {
    x: Number,
    y: Number
  },
  data: {
    title: { type: String, default: '' },
    tasks: [taskSchema]
  }
});

// Define Edge Schema
const edgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  type: String,
  animated: Boolean,
  style: {
    stroke: String,
    strokeWidth: Number
  }
});

// Define Roadmap Schema
const roadmapSchema = new mongoose.Schema({
  userId: { type: String, default: 'temp-user-id' },
  domain: { type: String, required: true },
  progress: { type: Number, default: 0 },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  completedNodes: [String],
  additionalInfo: { type: String, default: '' },
  geminiResponse: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  strict: false // This will allow flexible schema for now
});

// Create the model only if it doesn't exist
const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

// Save a roadmap
router.post('/', async (req, res) => {
  try {
    console.log('Received roadmap data:', JSON.stringify(req.body, null, 2));
    const { userId, domain, nodes, edges, completedNodes, progress, geminiResponse } = req.body;
    
    // Validate the nodes structure
    if (!Array.isArray(nodes)) {
      throw new Error('Nodes must be an array');
    }

    // Validate each node's structure
    nodes.forEach((node, index) => {
      if (!node.data || !Array.isArray(node.data.tasks)) {
        throw new Error(`Invalid node structure at index ${index}`);
      }
      
      node.data.tasks.forEach((task, taskIndex) => {
        if (!task.topic || !task.resource) {
          throw new Error(`Invalid task structure at node ${index}, task ${taskIndex}`);
        }
      });
    });
    
    const roadmap = new Roadmap({
      userId,
      domain,
      nodes,
      edges,
      completedNodes,
      progress,
      geminiResponse
    });

    const savedRoadmap = await roadmap.save();
    console.log('Saved roadmap:', savedRoadmap);
    res.status(201).json(savedRoadmap);
  } catch (error) {
    console.error('Error saving roadmap:', error);
    res.status(500).json({ 
      error: 'Failed to save roadmap',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all roadmaps
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all roadmaps');
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    console.log(`Found ${roadmaps.length} roadmaps`);
    res.json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ 
      error: 'Failed to fetch roadmaps',
      message: error.message 
    });
  }
});

// Get a single roadmap by ID
router.get('/:id', async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // If we have the original Gemini response, use it to recreate the nodes
    if (roadmap.geminiResponse) {
      const textContent = roadmap.geminiResponse.candidates[0].content.parts[0].text;
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const roadmapData = JSON.parse(jsonMatch[0]);
        // Return the original response along with other data
        return res.json({
          ...roadmap._doc,
          originalData: roadmapData
        });
      }
    }

    // Fallback to returning stored nodes if no Gemini response
    res.json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ 
      error: 'Failed to fetch roadmap',
      message: error.message 
    });
  }
});

// Delete a roadmap
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting roadmap with id:', id);
    
    if (!id) {
      return res.status(400).json({ error: 'Roadmap ID is required' });
    }

    const deletedRoadmap = await Roadmap.findByIdAndDelete(id);
    
    if (!deletedRoadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    console.log('Roadmap deleted successfully:', deletedRoadmap);
    res.json({ message: 'Roadmap deleted successfully', roadmap: deletedRoadmap });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    res.status(500).json({ 
      error: 'Failed to delete roadmap',
      message: error.message 
    });
  }
});

// Update a roadmap
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { domain, nodes, edges, completedNodes, progress, geminiResponse } = req.body;
    
    console.log('Updating roadmap:', id);
    console.log('New progress:', progress);
    console.log('Completed nodes:', completedNodes);

    if (!id) {
      return res.status(400).json({ error: 'Roadmap ID is required' });
    }

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid roadmap ID format' });
    }

    const updatedRoadmap = await Roadmap.findByIdAndUpdate(
      id,
      {
        domain,
        nodes,
        edges,
        completedNodes,
        progress,
        geminiResponse,
        updatedAt: new Date()
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validations
      }
    );

    if (!updatedRoadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    console.log('Roadmap updated successfully:', updatedRoadmap);
    res.json(updatedRoadmap);
  } catch (error) {
    console.error('Error updating roadmap:', error);
    res.status(500).json({ 
      error: 'Failed to update roadmap',
      message: error.message,
      details: error.stack
    });
  }
});

export default router;
