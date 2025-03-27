import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { FiSearch, FiGrid, FiList, FiClock, FiUser, FiStar, FiBookmark, FiTrendingUp, FiAward, FiHeart, FiPlus, FiEdit, FiTrash2, FiUpload } from 'react-icons/fi';

const FeaturedCourse = ({ course }) => (
  <motion.div 
    className="relative h-[500px] rounded-3xl overflow-hidden bg-white dark:bg-dark-primary transition-colors duration-200"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute inset-0">
      <img 
        src={course.image} 
        alt={course.title} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
      <div className="flex items-center gap-4 mb-4">
        <span className="px-3 py-1 bg-primary-500 dark:bg-primary-600 rounded-full text-sm font-medium transition-colors duration-200">Featured</span>
        <span className="flex items-center gap-1">
          <FiStar className="text-yellow-400" />
          {course.rating}
        </span>
      </div>
      <h2 className="text-4xl font-bold mb-4">{course.title}</h2>
      <p className="text-lg text-gray-200 mb-6 line-clamp-2">{course.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FiClock className="text-gray-300" />
            {course.duration}
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-300" />
            {course.students} students
          </div>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-full font-medium transform hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 group relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-secondary-600 dark:from-secondary-600 dark:to-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative">Enroll Now</span>
        </button>
      </div>
    </div>
  </motion.div>
);

const CourseCard = ({ course, layout = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (layout === 'list') {
    return (
      <motion.div 
        className="bg-white dark:bg-dark-secondary rounded-2xl p-6 flex gap-6 hover:shadow-xl transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
              {course.category}
            </span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full backdrop-blur-md bg-white/20 dark:bg-dark-secondary/20 hover:bg-white/30 dark:hover:bg-dark-secondary/30 transform hover:scale-110 active:scale-95 transition-all duration-200 ${isBookmarked ? 'text-blue-500' : 'text-gray-400'}`}
              >
                <FiBookmark className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full backdrop-blur-md bg-white/20 dark:bg-dark-secondary/20 hover:bg-white/30 dark:hover:bg-dark-secondary/30 transform hover:scale-110 active:scale-95 transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <FiHeart className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                {course.students} students
              </span>
              <span className="flex items-center gap-1">
                <FiStar className="w-4 h-4 text-yellow-400" />
                {course.rating}
              </span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-xl hover:shadow-lg transform hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200">
              View Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-dark-secondary rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="relative h-48">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full backdrop-blur-md bg-white/20 dark:bg-dark-secondary/20 hover:bg-white/30 dark:hover:bg-dark-secondary/30 transform hover:scale-110 active:scale-95 transition-all duration-200 ${isBookmarked ? 'text-blue-500' : 'text-white'}`}
          >
            <FiBookmark className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full backdrop-blur-md bg-white/20 dark:bg-dark-secondary/20 hover:bg-white/30 dark:hover:bg-dark-secondary/30 transform hover:scale-110 active:scale-95 transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-white'}`}
          >
            <FiHeart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.level === 'Beginner' ? 'bg-green-500' :
            course.level === 'Intermediate' ? 'bg-yellow-500' :
            'bg-red-500'
          } text-white`}>
            {course.level}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <FiStar />
            <span className="text-sm">{course.rating}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <FiUser className="w-4 h-4" />
              {course.students}
            </span>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-2 border-transparent hover:border-blue-500 dark:hover:bg-blue-900/30 font-medium group transition-all duration-200">
            Learn More 
            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CourseCreationModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('beginner');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      category,
      thumbnail,
      duration,
      level,
      students: 0,
      rating: 0,
      trending: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-secondary rounded-2xl p-6 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-secondary text-gray-900 dark:text-gray-100 h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select Category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thumbnail
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {thumbnail ? thumbnail.name : "Upload thumbnail image"}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estimated Duration (e.g., "8 weeks")
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 to-indigo-700 text-white hover:shadow-lg"
            >
              Create Course
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InstructorDashboard = ({ onCreateCourse }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Instructor Dashboard</h2>
        <button
          onClick={onCreateCourse}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 to-indigo-700 text-white hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Create New Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Active Courses</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">12</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">$12,345</p>
        </div>
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
            <p className="text-gray-600 dark:text-gray-300">Discover new skills and advance your career</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 dark:text-gray-100 transition-colors duration-200"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2 bg-white dark:bg-dark-secondary rounded-lg p-1 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 dark:bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-200`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 dark:bg-primary-600 text-white' : 'text-gray-500 dark:text-gray-400'} transition-colors duration-200`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                className={`bg-white dark:bg-dark-secondary rounded-xl shadow-lg overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        <span className="text-sm text-gray-600">{course.duration}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser className="text-gray-400" />
                        <span className="text-sm text-gray-600">{course.instructor}</span>
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:shadow-lg transform hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200">
                      View Course
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No courses found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
