import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon, AcademicCapIcon, UserIcon } from '@heroicons/react/24/outline';
import { UserButton, useUser } from '@clerk/clerk-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const { user, isSignedIn } = useUser();

  // Assume role comes from user metadata or profile; fallback to 'student' for now
  const [role, setRole] = useState('student'); // 'student' (mentee) or 'teacher' (mentor)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Features', path: '/features' },
    { name: 'Profile', path: '/profile' },
  ];

  // Add teacher dashboard for mentors and mentors tab for mentees
  if (isSignedIn) {
    if (role === 'teacher') {
      navItems.splice(2, 0, { name: 'Dashboard', path: '/teacher-dashboard' });
    } else if (role === 'student') {
      navItems.push({ name: 'Mentors', path: '/mentors' });
    }
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleRole = () => {
    setRole((prev) => (prev === 'student' ? 'teacher' : 'student'));
  };

  return (
    <nav className="fixed w-full z-50 backdrop-blur-lg bg-white/80 dark:bg-dark-primary/80 border-b border-gray-200 dark:border-dark-content/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-600 dark:text-dark-accent">EDU-AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-dark-accent font-medium transition-colors duration-200 ${
                  isActive(item.path) ? 'text-primary-500 dark:text-dark-accent' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-dark-content text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-content-light transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </motion.button>

            {/* Role Toggle with User Avatar */}
            {isSignedIn && (
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRole}
                  className={`flex items-center space-x-2 p-2 rounded-full ${
                    role === 'teacher'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                  } hover:bg-opacity-80 transition-colors duration-200`}
                  aria-label="Toggle role"
                >
                  <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8',
                        userButtonPopoverCard: 'dark:bg-dark-primary dark:text-gray-300',
                        userButtonPopoverActionButton: 'dark:hover:bg-dark-content',
                        userButtonPopoverActionButtonText: 'dark:text-gray-300',
                      },
                    }}
                  />
                  {role === 'teacher' ? (
                    <AcademicCapIcon className="h-5 w-5" />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-content focus:outline-none"
            >
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-dark-accent hover:bg-gray-100 dark:hover:bg-dark-content ${
                      isActive(item.path) ? 'text-primary-500 dark:text-dark-accent bg-gray-100 dark:bg-dark-content' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Theme Toggle in Mobile */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-content"
                >
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;