import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

const FeatureDetails = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();

  const featureData = {
    'career-counselling': {
      title: 'Career Counselling',
      description: 'Get expert guidance on your career path with personalized assessments and counseling sessions.',
      benefits: [
        'Personalized career assessment',
        'One-on-one counseling sessions',
        'Industry insights and trends',
        'Skills gap analysis'
      ],
      image: '/images/career-counselling.svg'
    },
    // Add more feature details here
  };

  const feature = featureData[featureId];

  if (!feature) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Feature not found
          </h2>
          <button
            onClick={() => navigate('/features')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Features
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-6">
              {feature.title}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              {feature.description}
            </p>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
                Key Benefits
              </h3>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {/* Add action */}}
              className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Get Started
            </button>
          </div>
          <div className="relative">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeatureDetails;
