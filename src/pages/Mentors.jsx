import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const Mentors = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menteeSkills, setMenteeSkills] = useState([]);

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
        fetchMentors(data.skills || []);
      } else if (response.status === 404) {
        setMenteeSkills([]);
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
      const url = `http://localhost:5001/api/users/mentors?skills=${encodeURIComponent(skillString)}`;
      console.log('Fetching mentors from:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('Mentors data:', data);
        setMentors(data);
      } else {
        throw new Error(`Failed to fetch mentors: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error.message);
      setError(`Failed to load mentors: ${error.message}`);
      toast.error(`Failed to load mentors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMentors = mentors.filter((mentor) => {
    const nameMatch = mentor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const skillMatch = mentor.skills.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || skillMatch;
  });

  if (!isLoaded) return <div className="text-center py-12 text-gray-600">Loading...</div>;
  if (!isSignedIn) return <div className="text-center py-12 text-gray-600">Please log in to view mentors.</div>;
  if (loading) return <div className="text-center py-12 text-gray-600">Loading mentors...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recommended Mentors</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search mentors by name or skill..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-900 transition-colors duration-200"
          />
        </div>

        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor._id}
                className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{mentor.email}</h2>
                  <p className="text-sm text-gray-600">Skills: {mentor.skills.join(', ')}</p>
                </div>
                <button
                  className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => toast.info(`Connect with ${mentor.email} feature coming soon!`)}
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No mentors found matching your skills or search term.</p>
        )}

        {menteeSkills.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900">Your Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {menteeSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;