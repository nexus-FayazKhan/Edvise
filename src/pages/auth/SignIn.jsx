import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative p-8 items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to EDU-AI
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Your AI-powered learning platform. Access your courses, track your progress, and achieve your goals.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-primary-100">Personalized learning experience</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-primary-100">AI-powered study assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-primary-100">Track your progress</span>
            </div>
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top Navigation */}
        <nav className="p-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              EDU-AI
            </span>
          </Link>
          <Link 
            to="/sign-up" 
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            Don't have an account? Sign up
          </Link>
        </nav>

        {/* Sign In Form */}
        <div className="flex-grow flex items-center justify-center px-6 pb-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to continue your learning journey
              </p>
            </div>

            <SignIn 
              routing="path" 
              path="/sign-in" 
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-primary-600 hover:bg-primary-700 text-sm normal-case",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: 
                    "border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                  socialButtonsBlockButtonText: 
                    "text-gray-700 dark:text-gray-300 font-medium",
                  formFieldLabel: "text-gray-700 dark:text-gray-300",
                  formFieldInput: 
                    "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500",
                  footerActionLink: "text-primary-600 hover:text-primary-700 dark:text-primary-400",
                  dividerLine: "bg-gray-200 dark:bg-gray-700",
                  dividerText: "text-gray-500 dark:text-gray-400",
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  showOptionalFields: false,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
