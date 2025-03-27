import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

const contactMethods = [
  {
    name: 'Email',
    description: 'email us on',
    value: 'fayaz.khanxid411@gmail.com',
    icon: EnvelopeIcon,
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Phone',
    description: 'Mon-Fri from 8am to 5pm',
    value: '(555) 123-4567',
    icon: PhoneIcon,
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Office',
    description: '-------',
    value: 'verna , salcette Goa',
    icon: MapPinIcon,
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Live Chat',
    description: '24/7 Support',
    value: 'Start a conversation',
    icon: ChatBubbleLeftRightIcon,
    color: 'from-yellow-500 to-yellow-600',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    // Show success message (you can implement this)
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-dark-primary dark:to-dark-secondary" />
      <div className="absolute inset-0">
        <div className="absolute top-0 -right-40 w-96 h-96 bg-primary-100/30 dark:bg-dark-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-primary-100/30 dark:bg-dark-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Methods */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="bg-white dark:bg-dark-content rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${method.color} mb-4`}>
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {method.description}
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      {method.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

           
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-dark-content rounded-2xl p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-300 dark:border-dark-content-light focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent focus:border-transparent dark:bg-dark-content-light dark:text-white transition-colors duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 dark:border-dark-content-light focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent focus:border-transparent dark:bg-dark-content-light dark:text-white transition-colors duration-200"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 dark:border-dark-content-light focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent focus:border-transparent dark:bg-dark-content-light dark:text-white transition-colors duration-200"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 dark:border-dark-content-light focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-accent focus:border-transparent dark:bg-dark-content-light dark:text-white transition-colors duration-200 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-dark-accent dark:to-dark-accent-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
