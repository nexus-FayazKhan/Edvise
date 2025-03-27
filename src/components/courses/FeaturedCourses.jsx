import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const FeaturedCourses = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Simulated featured courses data
  const featuredCourses = [
    {
      id: 1,
      title: "Advanced Study Techniques",
      description: "Master effective study methods for academic excellence",
      image: "/course-images/study-techniques.jpg",
      badge: "Most Popular"
    },
    {
      id: 2,
      title: "Stress Management",
      description: "Learn practical techniques for managing academic stress",
      image: "/course-images/stress-management.jpg",
      badge: "Recommended"
    },
    {
      id: 3,
      title: "Career Planning",
      description: "Plan your career path with expert guidance",
      image: "/course-images/career-planning.jpg",
      badge: "New"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === featuredCourses.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? featuredCourses.length - 1 : prev - 1
    );
  };

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Featured Courses
      </h2>
      
      <div className="relative overflow-hidden" ref={carouselRef}>
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredCourses.map((course) => (
            <div 
              key={course.id}
              className="w-full flex-shrink-0 px-4"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
                      {course.badge}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {course.description}
                  </p>
                  <button className="w-full py-3 bg-gradient-to-r from-[#6a0dad] to-[#9c4dcc] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronRightIcon className="w-6 h-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {featuredCourses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCourses;
