import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { FiArrowRight, FiTrash2, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SavedRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/roadmaps');
      if (!response.ok) {
        throw new Error('Failed to fetch roadmaps');
      }
      const data = await response.json();
      setRoadmaps(data);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      setError('Failed to load roadmaps');
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/roadmaps/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete roadmap');
      }

      setRoadmaps(roadmaps.filter(roadmap => roadmap._id !== id));
      toast.success('Roadmap deleted successfully');
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      toast.error('Failed to delete roadmap');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleViewRoadmap = (roadmapId) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Saved Roadmaps</h1>
      <div className="grid gap-6">
        {roadmaps.map((roadmap) => (
          <div 
            key={roadmap._id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{roadmap.domain}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiClock className="w-4 h-4" />
                  {formatDate(roadmap.createdAt)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {roadmap.progress || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {roadmap.completedNodes?.length || 0} of {roadmap.nodes?.length || 0} tasks completed
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${roadmap.progress || 0}%` }}
                >
                  {roadmap.progress > 0 && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Progress Stats */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDeleteRoadmap(roadmap._id)}
                  className="bg-gray-100 hover:bg-gray-200 text-red-500 hover:text-red-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg p-2"
                  title="Delete Roadmap"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleViewRoadmap(roadmap._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span>Continue Learning</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {roadmaps.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No roadmaps saved yet
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>Create Your First Roadmap</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedRoadmaps;
