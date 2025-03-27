import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Mentors = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [connectedMentors, setConnectedMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menteeSkills, setMenteeSkills] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchMenteeProfile();
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchMenteeProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/profile?email=${user.primaryEmailAddress.emailAddress}`
      );
      if (response.ok) {
        const data = await response.json();
        setMenteeSkills(data.skills || []);
        setConnectedMentors(data.connectedMentors || []);
        fetchMentors(data.skills || []);
      } else if (response.status === 404) {
        setMenteeSkills([]);
        setConnectedMentors([]);
        fetchMentors([]);
      } else {
        throw new Error('Failed to fetch mentee profile');
      }
    } catch (error) {
      console.error('Error fetching mentee profile:', error);
      setError('Failed to load profile');
      toast.error('Failed to load profile');
    }
  };

  const fetchMentors = async (skills) => {
    try {
      setLoading(true);
      const skillString = skills.length > 0 ? skills.join(',') : 'all';
      const response = await fetch(
        `http://localhost:5001/api/users/mentors?skills=${encodeURIComponent(skillString)}`
      );
      if (response.ok) {
        const data = await response.json();
        setMentors(data);
      } else {
        throw new Error('Failed to fetch mentors');
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setError('Failed to load mentors');
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (mentorId) => {
    try {
      const response = await fetch('http://localhost:5001/api/users/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menteeEmail: user.primaryEmailAddress.emailAddress,
          mentorId,
        }),
      });
      if (response.ok) {
        const updatedConnectedMentors = await response.json();
        setConnectedMentors(updatedConnectedMentors);
        toast.success('Connected with mentor!');
      } else {
        throw new Error('Failed to connect with mentor');
      }
    } catch (error) {
      console.error('Error connecting with mentor:', error);
      toast.error('Failed to connect with mentor');
    }
  };

  const handleViewProfile = (mentorId) => {
    navigate(`/mentors/${mentorId}`);
  };

  const handleSelectMentor = (mentor) => {
    navigate(`/ChatApp/${mentor._id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMentors = mentors.filter((mentor) => {
    const nameMatch = mentor.username.toLowerCase().includes(searchTerm.toLowerCase());
    const skillMatch = mentor.skills.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || skillMatch;
  });

  if (!isLoaded) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!isSignedIn) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Please log in to view mentors.</div>;
  if (loading) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading mentors...</div>;
  if (error) return <div className="text-center py-12 text-red-500 dark:text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-dark-secondary shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Connected Mentors</h2>
        {connectedMentors.length > 0 ? (
          <ul>
            {connectedMentors.map((mentor) => (
              <li
                key={mentor._id}
                className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-content ${
                  selectedMentor?._id === mentor._id ? 'bg-gray-100 dark:bg-dark-content' : ''
                }`}
                onClick={() => handleSelectMentor(mentor)}
              >
                <span className="text-gray-900 dark:text-gray-300">{mentor.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">No connected mentors yet.</p>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recommended Mentors</h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search mentors by name or skill..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-3 px-4 bg-white dark:bg-dark-tertiary border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            />
          </div>

          {filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white dark:bg-dark-secondary shadow-md rounded-lg p-6 flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{mentor.username}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Skills: {mentor.skills.join(', ')}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleConnect(mentor._id)}
                      className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-200"
                      disabled={connectedMentors.some((m) => m._id === mentor._id)}
                    >
                      {connectedMentors.some((m) => m._id === mentor._id) ? 'Connected' : 'Connect'}
                    </button>
                    <button
                      onClick={() => handleViewProfile(mentor._id)}
                      className="px-4 py-2 bg-gray-200 dark:bg-dark-content text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-dark-content-light transition-colors duration-200"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No mentors found matching your skills or search term.</p>
          )}

          {menteeSkills.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {menteeSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentors;