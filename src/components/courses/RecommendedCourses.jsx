import { useEffect, useState } from 'react';
import CourseCard from './CourseCard';

const RecommendedCourses = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Simulated API call to get personalized recommendations
    // In a real application, this would fetch data based on user preferences and history
    const fetchRecommendations = async () => {
      // Simulated recommendations data
      const mockRecommendations = [
        {
          id: 101,
          title: "Time Management Mastery",
          description: "Learn effective strategies to manage your academic schedule",
          category: "Academic",
          difficulty: "Intermediate",
          duration: "4 weeks",
          image: "/course-images/time-management.jpg",
        },
        {
          id: 102,
          title: "Research Methods",
          description: "Master the fundamentals of academic research",
          category: "Academic",
          difficulty: "Advanced",
          duration: "6 weeks",
          image: "/course-images/research.jpg",
        },
        {
          id: 103,
          title: "Mindfulness for Students",
          description: "Develop mindfulness techniques for academic success",
          category: "Well-being",
          difficulty: "Beginner",
          duration: "3 weeks",
          image: "/course-images/mindfulness.jpg",
        }
      ];

      setRecommendations(mockRecommendations);
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Courses You Might Like
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;
