import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaChalkboardTeacher, FaLaptopCode, FaBriefcase, FaGraduationCap, FaArrowLeft, FaSpinner } from 'react-icons/fa';

const API_KEY = "AIzaSyAQq6XdpLMpFYGGfnKn-VewRgjJt6EOlPA";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const CategoryTab = ({ active, name, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-tertiary'
      }`}
    >
      {icon}
      <span className="ml-2">{name}</span>
    </button>
  );
};

const ReviewItem = ({ review }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-4 mb-4 border border-transparent hover:border-primary-200 dark:hover:border-primary-900">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg mr-3">
            {review.authorName.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white">{review.authorName}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-dark-tertiary px-3 py-1 rounded-full">
          <span className="text-lg font-bold text-gray-800 dark:text-white mr-1">{review.rating}</span>
          <FaStar className="text-yellow-500" />
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-dark-tertiary p-3 rounded-lg border-l-4 border-primary-500 dark:border-primary-700">
        {review.text}
      </p>
    </div>
  );
};

const CollegeDetails = () => {
  const { collegeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const collegeData = location.state?.collegeData;
  const [activeCategory, setActiveCategory] = useState('all');
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch college details using Gemini API
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      if (!collegeData) {
        navigate('/reviews');
        return;
      }

      setIsLoading(true);
      try {
        const prompt = `
          I need comprehensive information about ${collegeData.collegeName} offering ${collegeData.courseName} in ${collegeData.location || 'India'}.
          
          Please provide a detailed JSON response with the following structure:
          {
            "collegeDescription": "A detailed 3-4 sentence description of the college including its founding year, reputation, and notable features",
            "curriculum": {
              "overview": "A paragraph about the curriculum structure and approach",
              "strengths": ["List 3-4 strengths of the curriculum"],
              "weaknesses": ["List 2-3 areas that could be improved"],
              "reviews": [
                {
                  "authorName": "A realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.5 and 4.8,
                  "text": "A detailed, realistic review about the curriculum (80-120 words)"
                },
                {
                  "authorName": "Another realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.2 and 4.9,
                  "text": "Another detailed, realistic review about the curriculum (80-120 words)"
                }
              ]
            },
            "faculty": {
              "overview": "A paragraph about the faculty quality and teaching approach",
              "strengths": ["List 3-4 strengths of the faculty"],
              "weaknesses": ["List 2-3 areas that could be improved"],
              "reviews": [
                {
                  "authorName": "A realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.5 and 4.8,
                  "text": "A detailed, realistic review about the faculty (80-120 words)"
                },
                {
                  "authorName": "Another realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.2 and 4.9,
                  "text": "Another detailed, realistic review about the faculty (80-120 words)"
                }
              ]
            },
            "internships": {
              "overview": "A paragraph about internship opportunities and industry connections",
              "strengths": ["List 3-4 strengths of the internship program"],
              "weaknesses": ["List 2-3 areas that could be improved"],
              "reviews": [
                {
                  "authorName": "A realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.5 and 4.8,
                  "text": "A detailed, realistic review about internships (80-120 words)"
                },
                {
                  "authorName": "Another realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.2 and 4.9,
                  "text": "Another detailed, realistic review about internships (80-120 words)"
                }
              ]
            },
            "placements": {
              "overview": "A paragraph about placement opportunities and success rates",
              "strengths": ["List 3-4 strengths of the placement program"],
              "weaknesses": ["List 2-3 areas that could be improved"],
              "reviews": [
                {
                  "authorName": "A realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.5 and 4.8,
                  "text": "A detailed, realistic review about placements (80-120 words)"
                },
                {
                  "authorName": "Another realistic Indian name",
                  "date": "A recent date in DD MMM YYYY format",
                  "rating": A number between 3.2 and 4.9,
                  "text": "Another detailed, realistic review about placements (80-120 words)"
                }
              ]
            }
          }
          
          Ensure the information is realistic and specific to ${collegeData.collegeName} and the ${collegeData.courseName} program. If exact information isn't available, provide plausible details that would be typical for a college of this type in ${collegeData.location || 'India'}.
        `;

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch college details');
        }

        const data = await response.json();
        const textContent = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          const parsedData = JSON.parse(jsonString);
          setCollegeDetails(parsedData);
        } else {
          throw new Error('Could not parse college details from response');
        }
      } catch (error) {
        console.error('Error fetching college details:', error);
        setError('Failed to fetch college details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [collegeData, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Loading college details...</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/reviews')}
            className="flex items-center text-primary-600 dark:text-primary-400 mb-6 hover:underline"
          >
            <FaArrowLeft className="mr-2" />
            Back to Reviews
          </button>
          
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!collegeDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/reviews')}
            className="flex items-center text-primary-600 dark:text-primary-400 mb-6 hover:underline"
          >
            <FaArrowLeft className="mr-2" />
            Back to Reviews
          </button>
          
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{collegeData.collegeName}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                {collegeData.courseName}
              </span>
              {collegeData.location && (
                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {collegeData.location}
                </span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-dark-tertiary p-3 rounded-lg border-l-4 border-primary-500 dark:border-primary-700">
              {collegeData.collegeDescription}
            </p>
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Detailed information is not available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the reviews to display based on active category
  const getReviewsByCategory = () => {
    switch (activeCategory) {
      case 'curriculum':
        return collegeDetails.curriculum.reviews;
      case 'faculty':
        return collegeDetails.faculty.reviews;
      case 'internships':
        return collegeDetails.internships.reviews;
      case 'placements':
        return collegeDetails.placements.reviews;
      default:
        return [
          ...collegeDetails.curriculum.reviews,
          ...collegeDetails.faculty.reviews,
          ...collegeDetails.internships.reviews,
          ...collegeDetails.placements.reviews
        ];
    }
  };

  // Calculate average ratings
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const curriculumRating = calculateAverageRating(collegeDetails.curriculum.reviews);
  const facultyRating = calculateAverageRating(collegeDetails.faculty.reviews);
  const internshipsRating = calculateAverageRating(collegeDetails.internships.reviews);
  const placementsRating = calculateAverageRating(collegeDetails.placements.reviews);
  
  // Calculate overall rating
  const allReviews = [
    ...collegeDetails.curriculum.reviews,
    ...collegeDetails.faculty.reviews,
    ...collegeDetails.internships.reviews,
    ...collegeDetails.placements.reviews
  ];
  const overallRating = calculateAverageRating(allReviews);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate('/reviews')}
          className="flex items-center text-primary-600 dark:text-primary-400 mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" />
          Back to Reviews
        </button>

        {/* College header */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{collegeData.collegeName}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">
                  {collegeData.courseName}
                </span>
                {collegeData.location && (
                  <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {collegeData.location}
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                {collegeDetails.collegeDescription}
              </p>
            </div>
            <div className="flex items-center justify-center bg-gray-100 dark:bg-dark-tertiary px-6 py-4 rounded-lg mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center">
                  {overallRating}
                  <FaStar className="text-yellow-500 ml-2" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Rating</p>
              </div>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-tertiary">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
                {curriculumRating}
                <FaStar className="text-yellow-500 ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                <FaLaptopCode className="mr-1" /> Curriculum
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-tertiary">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
                {facultyRating}
                <FaStar className="text-yellow-500 ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                <FaChalkboardTeacher className="mr-1" /> Faculty
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-tertiary">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
                {internshipsRating}
                <FaStar className="text-yellow-500 ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                <FaBriefcase className="mr-1" /> Internships
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-dark-tertiary">
              <div className="flex items-center justify-center text-xl font-bold text-gray-800 dark:text-white">
                {placementsRating}
                <FaStar className="text-yellow-500 ml-1 h-4 w-4" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
                <FaGraduationCap className="mr-1" /> Placements
              </p>
            </div>
          </div>
        </div>

        {/* Category-specific content */}
        {activeCategory !== 'all' && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-6">
              {collegeDetails[activeCategory].overview}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {collegeDetails[activeCategory].strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {collegeDetails[activeCategory].weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Reviews section */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Reviews</h2>
          
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            <CategoryTab
              active={activeCategory === 'all'}
              name="All Reviews"
              icon={<FaStar className="h-4 w-4" />}
              onClick={() => setActiveCategory('all')}
            />
            <CategoryTab
              active={activeCategory === 'curriculum'}
              name="Curriculum"
              icon={<FaLaptopCode className="h-4 w-4" />}
              onClick={() => setActiveCategory('curriculum')}
            />
            <CategoryTab
              active={activeCategory === 'faculty'}
              name="Faculty"
              icon={<FaChalkboardTeacher className="h-4 w-4" />}
              onClick={() => setActiveCategory('faculty')}
            />
            <CategoryTab
              active={activeCategory === 'internships'}
              name="Internships"
              icon={<FaBriefcase className="h-4 w-4" />}
              onClick={() => setActiveCategory('internships')}
            />
            <CategoryTab
              active={activeCategory === 'placements'}
              name="Placements"
              icon={<FaGraduationCap className="h-4 w-4" />}
              onClick={() => setActiveCategory('placements')}
            />
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {getReviewsByCategory().map((review, index) => (
              <ReviewItem key={index} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
