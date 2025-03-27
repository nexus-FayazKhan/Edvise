import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    content: "StudentCare Hub transformed my academic journey. The personalized support and resources helped me achieve my goals and boost my confidence.",
    author: "Sarah Johnson",
    role: "Computer Science Student",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5,
  },
  {
    id: 2,
    content: "The mentorship program was a game-changer. My mentor provided invaluable guidance that helped me navigate both academic and career decisions.",
    author: "Michael Chen",
    role: "Engineering Graduate",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5,
  },
  {
    id: 3,
    content: "I love how the platform combines academic support with career guidance. It's like having a personal success coach in your pocket!",
    author: "Emily Rodriguez",
    role: "Business Student",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5,
  },
  {
    id: 4,
    content: "The study resources and practice tests were exactly what I needed to excel in my courses. Highly recommend to any student looking to improve!",
    author: "David Park",
    role: "Medical Student",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    rating: 5,
  },
];

const stats = [
  { id: 1, name: 'Active Students', value: '50,000+' },
  { id: 2, name: 'Success Rate', value: '95%' },
  { id: 3, name: 'Mentor Network', value: '1,000+' },
  { id: 4, name: 'Course Materials', value: '10,000+' },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-dark-secondary dark:to-dark-primary" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-primary-300/30 dark:from-dark-accent/10 dark:to-dark-accent/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-primary-300/30 dark:from-dark-accent/10 dark:to-dark-accent/30 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            What Our Students Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Join thousands of students who have transformed their academic journey with StudentCare Hub
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-dark-content rounded-2xl p-6 text-center shadow-lg"
            >
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {stat.name}
              </dt>
              <dd className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500 dark:from-dark-accent dark:to-dark-accent-light">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Testimonial Card */}
              <div className="bg-white dark:bg-dark-content rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Quote Icon */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 dark:from-dark-accent dark:to-dark-accent-light rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={testimonial.image}
                    alt={testimonial.author}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-dark-accent dark:to-dark-accent-light text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Join Our Community
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
