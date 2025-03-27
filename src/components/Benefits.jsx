import React from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';

const benefits = [
  {
    title: 'Academic Excellence',
    description: 'Get personalized study plans and access to top-quality learning resources.',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-blue-600',
    darkColor: 'dark:from-blue-400 dark:to-blue-500',
  },
  {
    title: 'Peer Support Network',
    description: 'Connect with fellow students and share knowledge in a collaborative environment.',
    icon: UserGroupIcon,
    color: 'from-purple-500 to-purple-600',
    darkColor: 'dark:from-purple-400 dark:to-purple-500',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your academic growth with detailed analytics and insights.',
    icon: ChartBarIcon,
    color: 'from-green-500 to-green-600',
    darkColor: 'dark:from-green-400 dark:to-green-500',
  },
  {
    title: 'Expert Mentorship',
    description: 'Learn from experienced mentors who guide you towards your goals.',
    icon: LightBulbIcon,
    color: 'from-yellow-500 to-yellow-600',
    darkColor: 'dark:from-yellow-400 dark:to-yellow-500',
  },
  {
    title: 'Resource Library',
    description: 'Access a vast collection of study materials, guides, and practice tests.',
    icon: BookOpenIcon,
    color: 'from-red-500 to-red-600',
    darkColor: 'dark:from-red-400 dark:to-red-500',
  },
  {
    title: 'Community Support',
    description: 'Join discussion forums and get help from our supportive community.',
    icon: ChatBubbleBottomCenterTextIcon,
    color: 'from-pink-500 to-pink-600',
    darkColor: 'dark:from-pink-400 dark:to-pink-500',
  },
];

const Benefits = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Why Choose Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Discover the features that make our platform the perfect choice for your educational journey
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

              {/* Icon */}
              <div className={`mb-6 relative`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} ${benefit.darkColor} p-3 shadow-lg`}>
                  <benefit.icon className="w-full h-full text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>

              {/* Hover effect */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
