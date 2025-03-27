import express from 'express';
import Course from '../models/Course.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get courses by instructor
router.get('/instructor/:instructorId', async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.instructorId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructorId !== req.body.instructorId) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    course.updatedAt = new Date();
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { instructorId } = req.body;

    console.log('Delete request received:', {
      courseId: id,
      instructorId: instructorId,
      body: req.body
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    if (!instructorId) {
      return res.status(400).json({ message: 'Instructor ID is required' });
    }

    // Find and delete the course in one operation
    const result = await Course.deleteOne({ 
      _id: id,
      instructorId: instructorId
    });

    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        message: 'Course not found or you are not authorized to delete it'
      });
    }

    res.json({ 
      message: 'Course deleted successfully',
      courseId: id
    });

  } catch (error) {
    console.error('Delete course error:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      courseId: req.params.id,
      instructorId: req.body.instructorId
    });

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    res.status(500).json({ 
      message: 'Error deleting course',
      error: error.message
    });
  }
});

export default router;
