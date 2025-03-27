import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('courses');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    content: '',
    duration: '',
    level: 'Beginner',
    category: '',
    price: '0'
  });
  const { user } = useUser();

  useEffect(() => {
    fetchCourses();
  }, [user?.id]);

  const fetchCourses = async () => {
    try {
      if (!user?.id) return;
      const response = await axios.get(`http://localhost:5001/api/courses/instructor/${user.id}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Unable to connect to the server. Please check your connection.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        toast.error('Please sign in to create/edit courses');
        return;
      }

      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        instructor: user.fullName,
        instructorId: user.id
      };

      if (formData._id) {
        await axios.put(`http://localhost:5001/api/courses/${formData._id}`, courseData);
        toast.success('Course updated successfully!');
      } else {
        await axios.post('http://localhost:5001/api/courses', courseData);
        toast.success('Course created successfully!');
      }
      
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
        content: '',
        duration: '',
        level: 'Beginner',
        category: '',
        price: '0'
      });
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Unable to connect to the server. Please check your connection.');
      } else {
        toast.error('Failed to save course. Please try again.');
      }
    }
  };

  const handleDelete = async (courseId) => {
    try {
      if (!user?.id) {
        toast.error('Please sign in to delete courses');
        return;
      }

      const confirmDelete = window.confirm('Are you sure you want to delete this course? This action cannot be undone.');
      if (!confirmDelete) return;

      console.log('Sending delete request:', {
        courseId,
        instructorId: user.id
      });

      const response = await axios.delete(`http://localhost:5001/api/courses/${courseId}`, {
        data: { instructorId: user.id }
      });

      console.log('Delete response:', response.data);
      toast.success(response.data.message);
      
      // Update the courses list
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to delete course';
      
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.message || errorMessage;
        
        if (error.response.status === 403) {
          errorMessage = 'You are not authorized to delete this course';
        } else if (error.response.status === 404) {
          errorMessage = 'Course not found';
          // Remove the course from UI if it doesn't exist
          setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Server not responding. Please try again later.';
      }
      
      toast.error(errorMessage);
    }
  };

  const stats = [
    { name: 'Total Courses', value: courses.length, icon: BookOpenIcon },
    { name: 'Active Students', value: '124', icon: UsersIcon },
    { name: 'Total Revenue', value: '$1,240', icon: CurrencyDollarIcon },
    { name: 'Course Hours', value: '48h', icon: ClockIcon },
  ];

  const CourseCard = ({ course }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(course._id)}
            className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full shadow-md"
          >
            <TrashIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setFormData(course);
              setIsModalOpen(true);
            }}
            className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full shadow-md"
          >
            <PencilIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center space-x-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-content text-gray-800 dark:text-gray-200">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{course.duration}</span>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary-600 dark:text-dark-accent">
            ${course.price}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center space-x-2 mb-8">
          <AcademicCapIcon className="h-8 w-8 text-primary-600 dark:text-dark-accent" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Portal</h1>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setSelectedTab('courses')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${
              selectedTab === 'courses'
                ? 'bg-primary-100 dark:bg-dark-accent/20 text-primary-600 dark:text-dark-accent font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-content'
            }`}
          >
            <BookOpenIcon className="h-5 w-5" />
            <span>My Courses</span>
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${
              selectedTab === 'analytics'
                ? 'bg-primary-100 dark:bg-dark-accent/20 text-primary-600 dark:text-dark-accent font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-content'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setSelectedTab('students')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${
              selectedTab === 'students'
                ? 'bg-primary-100 dark:bg-dark-accent/20 text-primary-600 dark:text-dark-accent font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-content'
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span>Students</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.name}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-dark-secondary p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary-100 dark:bg-dark-accent/20 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary-600 dark:text-dark-accent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedTab === 'courses' ? 'My Courses' :
               selectedTab === 'analytics' ? 'Analytics' : 'Students'}
            </h2>
            {selectedTab === 'courses' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Course
              </motion.button>
            )}
          </div>

          {/* Course Grid */}
          {selectedTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Create/Edit Course Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-dark-secondary rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formData._id ? 'Edit Course' : 'Create New Course'}
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-dark-content rounded-lg"
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                        rows="4"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                          placeholder="e.g., 2 hours"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Level
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value || '0' })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Thumbnail URL
                      </label>
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent"
                        rows="6"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-content rounded-lg hover:bg-gray-200 dark:hover:bg-dark-content/80"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        {formData._id ? 'Update Course' : 'Create Course'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
