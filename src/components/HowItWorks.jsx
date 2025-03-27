import React from 'react';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Create Your Profile',
    description: 'Sign up and tell us about your academic goals and interests.',
    icon: UserPlusIcon,
    color: 'from-blue-500 to-blue-600',
    darkColor: 'dark:from-blue-400 dark:to-blue-500',
    features: ['Personalized dashboard', 'Goal tracking', 'Progress analytics'],
  },
  {
    title: 'Access Resources',
    description: 'Browse our extensive library of study materials and tools.',
    icon: DocumentTextIcon,
    color: 'from-purple-500 to-purple-600',
    darkColor: 'dark:from-purple-400 dark:to-purple-500',
    features: ['Study guides', 'Practice tests', 'Video tutorials'],
  },
  {
    title: 'Learn & Grow',
    description: 'Engage with mentors and peers to enhance your learning.',
    icon: AcademicCapIcon,
    color: 'from-green-500 to-green-600',
    darkColor: 'dark:from-green-400 dark:to-green-500',
    features: ['1-on-1 mentoring', 'Group study sessions', 'Peer networking'],
  },
  {
    title: 'Achieve Success',
    description: 'Track your progress and celebrate your achievements.',
    icon: TrophyIcon,
    color: 'from-yellow-500 to-yellow-600',
    darkColor: 'dark:from-yellow-400 dark:to-yellow-500',
    features: ['Achievement badges', 'Success stories', 'Career opportunities'],
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-white dark:from-blue-900/20 dark:via-gray-900 dark:to-gray-900 opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            Follow these simple steps to start your journey towards academic excellence
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 transform -translate-y-1/2 hidden lg:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center z-10">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                </div>

                {/* Card */}
                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} ${step.darkColor} p-4 shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {step.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
