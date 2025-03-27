import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineHeart, HiOutlineLibrary, HiOutlineSparkles } from 'react-icons/hi';

const featuresList = [
     {
    id: 8,
    title: "Roadmap Maker",
    description: "Generate personalized learning roadmaps using AI to guide your educational journey",
    icon: HiOutlineSparkles,
    category: "Academic",
    link: "/roadmap",
    highlights: ["AI-Powered Roadmaps", "Multiple Domains", "Download & Share"]
  },
  {
    id: 9,
    title: "Job Opportunities",
    description: "Discover AI-powered job recommendations based on your skills and get personalized career insights",
    icon: HiOutlineBriefcase,
    category: "Career",
    link: "/job-opportunities",
    highlights: ["AI Job Matching", "Skill Analysis", "Career Recommendations"]
  },
];

const Features = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  const categories = ['All', 'Career', 'Well-being', 'Academic', 'Tools'];

  const filteredFeatures = featuresList.filter(feature => {
    const searchMatch = searchTerm.trim() === '' || 
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.highlights.some(highlight => 
        highlight.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const categoryMatch = selectedCategory === 'All' || feature.category === selectedCategory;
    
    return searchMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
              Empower Your Education
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Discover our comprehensive suite of tools and services designed to enhance your learning journey
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search features..."
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchTerm('');
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:shadow-md'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(feature.link)}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="p-8">
                <div className="mb-6">
                  <feature.icon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                
                {/* Feature Highlights */}
                <div className="space-y-2 mb-6">
                  {feature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                      {highlight}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white dark:from-gray-800">
                  <button
                    className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-6"
            >
              Ready to Transform Your Learning Experience?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of students who are already benefiting from our comprehensive support system
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Started Today
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
