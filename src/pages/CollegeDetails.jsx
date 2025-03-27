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
          ? 'bg-primary-100 dark:bg-primary-900/40 text-blue-600 dark:text-primary-300'
          : 'bg-gray-100 dark:bg-dark-tertiary text-blue-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-tertiary'
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
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [syllabusData, setSyllabusData] = useState(null);
  const [syllabusError, setSyllabusError] = useState(null);
  const [reviewData, setReviewData] = useState({
    curriculum: { rating: 0, text: '' },
    faculty: { rating: 0, text: '' },
    internships: { rating: 0, text: '' },
    placements: { rating: 0, text: '' }
  });
  const [collegeDetails, setCollegeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch syllabus data using Gemini API
  const fetchSyllabusData = async () => {
    try {
      setSyllabusError(null);
      const prompt = `Search for the semester-wise subject names of the ${collegeData.courseName} program at ${collegeData.collegeName}${collegeData.location ? `, ${collegeData.location}` : ''}. Look for this information on the college's official website or other reliable academic sources.

If you find the curriculum or syllabus, format it as a JSON object where:
- Keys should be "Semester [Number]" (e.g., "Semester 1")
- Values should be comma-separated lists of subject names
- Include both core subjects and electives
- Include lab courses if available

Respond ONLY with a JSON object in this format:
{
  "Semester 1": "Subject 1, Subject 2, Lab 1",
  "Semester 2": "Subject 3, Subject 4, Lab 2"
}`;

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
        throw new Error('Failed to fetch syllabus data');
      }

      const data = await response.json();
      const textContent = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonString = jsonMatch[0];
        const parsedData = JSON.parse(jsonString);
        setSyllabusData(parsedData);
      } else {
        throw new Error('Could not parse syllabus data from response');
      }
    } catch (error) {
      console.error('Error fetching syllabus data:', error);
      setSyllabusError('Failed to fetch syllabus data. Please try again.');
    }
  };

  // Fetch syllabus data when modal is opened
  useEffect(() => {
    if (showSyllabusModal && !syllabusData) {
      fetchSyllabusData();
    }
  }, [showSyllabusModal]);

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

  const handleRatingChange = (category, value) => {
    setReviewData(prev => ({
      ...prev,
      [category]: { ...prev[category], rating: value }
    }));
  };

  const handleReviewTextChange = (category, value) => {
    setReviewData(prev => ({
      ...prev,
      [category]: { ...prev[category], text: value }
    }));
  };

  const handleSubmitReview = () => {
    // Here you would typically send the review data to your backend
    console.log('Review submitted:', reviewData);
    setShowReviewModal(false);
    // Reset form
    setReviewData({
      curriculum: { rating: 0, text: '' },
      faculty: { rating: 0, text: '' },
      internships: { rating: 0, text: '' },
      placements: { rating: 0, text: '' }
    });
  };

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
            <p className="text-gray-700 dark:text-gray-200 mb-6">{error}</p>
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
            <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-dark-tertiary px-6 py-4 rounded-lg mt-4 md:mt-0">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center">
                  {overallRating}
                  <FaStar className="text-yellow-500 ml-2" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Rating</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add Review
              </button>
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

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pt-2 pb-2 pl-2">
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

        {/* Category-specific content */}
        {activeCategory !== 'all' && (
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Overview
            </h2>
            {activeCategory === 'curriculum' && (
              <button
                onClick={() => setShowSyllabusModal(true)}
                className="mb-4 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                View Syllabus
              </button>
            )}
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

        {/* Syllabus Modal */}
        {showSyllabusModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowSyllabusModal(false)}>
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-dark-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full mx-4">
                <div className="bg-white dark:bg-dark-secondary px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Course Syllabus
                        </h3>
                        <button
                          onClick={() => setShowSyllabusModal(false)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {syllabusError ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <svg className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">{syllabusError}</p>
                          <button
                            onClick={fetchSyllabusData}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry
                          </button>
                        </div>
                      ) : !syllabusData ? (
                        <div className="flex items-center justify-center py-12">
                          <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
                        </div>
                      ) : (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(syllabusData).map(([semester, subjects]) => (
                            <div key={semester} className="bg-gray-50 dark:bg-dark-tertiary rounded-lg p-4">
                              <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-3">
                                {semester}
                              </h4>
                              <ul className="space-y-2">
                                {subjects.split(', ').map((subject, index) => (
                                  <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                                    <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                    {subject}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-tertiary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowSyllabusModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowReviewModal(false)}>
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-dark-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full mx-4">
                <div className="bg-white dark:bg-dark-secondary px-4 pt-5 pb-4 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                          Add Your Review
                        </h3>
                        <button
                          onClick={() => setShowReviewModal(false)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-6">
                        {['curriculum', 'faculty', 'internships', 'placements'].map((category) => (
                          <div key={category} className="bg-gray-50 dark:bg-dark-tertiary rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white capitalize mb-3">
                              {category}
                            </h4>
                            <div className="flex items-center mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRatingChange(category, star)}
                                  className="p-1"
                                >
                                  <FaStar
                                    className={`h-6 w-6 ${
                                      star <= reviewData[category].rating
                                        ? 'text-yellow-500'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={reviewData[category].text}
                              onChange={(e) => handleReviewTextChange(category, e.target.value)}
                              placeholder={`Share your experience about the ${category}...`}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-tertiary dark:text-white"
                              rows="3"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-dark-tertiary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleSubmitReview}
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-dark-tertiary dark:text-gray-300 dark:border-gray-600 dark:hover:bg-dark-secondary"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews section */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Reviews</h2>
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
